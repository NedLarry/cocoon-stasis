import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { gaussian, rng } from './random';

export interface PathStats {
  paths: number;
  step: number;
  steps: number;
  /** Edge path position in standard deviations of the crowd at the current step. */
  edgeZ: number;
  /** Percentile of the edge path within the crowd at the current step. */
  percentile: number;
  /** Simulation number — increments every time the field regenerates. */
  run: number;
}

const STEPS = 260;
const PATHS = 10_000;
const BATCHES = 48;
const DRAW_MS = 5200;
const HOLD_MS = 6500;
const FADE_MS = 900;

/**
 * Hero visual: a field of zero-drift random walks (the crowd) and one path with
 * a small positive drift (the edge), drawn against the theoretical ±1σ/±2σ cone.
 * Purely illustrative — no market data.
 */
@Component({
  selector: 'aw-path-field',
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host {
      display: block;
      position: relative;
      cursor: crosshair;
    }
    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  `,
  host: {
    '(pointermove)': 'onPointer($event)',
    '(pointerleave)': 'pointerX = null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PathField {
  readonly stats = output<PathStats>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private ctx!: CanvasRenderingContext2D;
  /** Accumulation layer: crowd segments are drawn once, as the front advances. */
  private acc = document.createElement('canvas');
  private accCtx = this.acc.getContext('2d')!;
  private w = 0;
  private h = 0;
  private dpr = 1;
  /** Crowd paths, column-major: value of path i at step t is crowd[t * PATHS + i]. */
  private crowd = new Float32Array(PATHS * (STEPS + 1));
  private edge = new Float32Array(STEPS + 1);
  private pct = new Float32Array(STEPS + 1);
  private z: () => number = () => 0;
  private generated = 0;
  private drawn = 0;
  private seed = 20250312;
  private run = 1;
  private phaseStart = 0;
  private raf = 0;
  private visible = true;
  private reduced = false;
  private lastEmit = 0;
  protected pointerX: number | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const canvas = this.canvas().nativeElement;
      this.ctx = canvas.getContext('2d')!;
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

      const ro = new ResizeObserver(() => this.resize());
      ro.observe(this.host.nativeElement);

      const io = new IntersectionObserver(([e]) => {
        this.visible = e.isIntersecting;
        if (this.visible) this.loop();
      });
      io.observe(this.host.nativeElement);

      this.reset();
      this.resize();
      this.phaseStart = performance.now() - (this.reduced ? DRAW_MS : 0);
      this.loop();

      const onVisibility = () => this.loop();
      document.addEventListener('visibilitychange', onVisibility);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.raf);
        document.removeEventListener('visibilitychange', onVisibility);
        ro.disconnect();
        io.disconnect();
      });
    });
  }

  protected onPointer(e: PointerEvent): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.pointerX = e.clientX - rect.left;
    if (this.reduced) this.frame(performance.now());
  }

  private resize(): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = rect.width;
    this.h = rect.height;
    const canvas = this.canvas().nativeElement;
    canvas.width = this.acc.width = Math.round(this.w * this.dpr);
    canvas.height = this.acc.height = Math.round(this.h * this.dpr);
    this.drawn = 0; // geometry changed — repaint the crowd layer from the start
    if (this.reduced) this.frame(performance.now());
  }

  /** Start a new simulation: draw the edge path up front, the crowd lazily. */
  private reset(): void {
    this.z = gaussian(rng(this.seed));
    this.generated = 0;
    this.drawn = 0;

    // The edge: a small positive drift, ~1.6σ over the horizon. Resample until
    // the realisation is representative of that drift rather than unlucky.
    const ze = gaussian(rng(this.seed ^ 0x5bd1e995));
    const mu = 1.6 / Math.sqrt(STEPS);
    for (let attempt = 0; attempt < 40; attempt++) {
      for (let t = 1; t <= STEPS; t++) this.edge[t] = this.edge[t - 1] + mu + ze();
      if (this.edge[STEPS] > 1.25 * Math.sqrt(STEPS)) break;
    }
    this.pct[0] = 50;
  }

  /** Simulate crowd steps up to `step`, recording the edge's percentile at each. */
  private advanceTo(step: number): void {
    const { crowd, z } = this;
    for (let t = this.generated + 1; t <= step; t++) {
      const prev = (t - 1) * PATHS;
      const cur = t * PATHS;
      const e = this.edge[t];
      let below = 0;
      for (let i = 0; i < PATHS; i++) {
        const v = crowd[prev + i] + z();
        crowd[cur + i] = v;
        if (v < e) below++;
      }
      this.pct[t] = (below / PATHS) * 100;
    }
    this.generated = Math.max(this.generated, step);
  }

  private loop = (): void => {
    cancelAnimationFrame(this.raf);
    if (!this.visible || document.hidden) return;
    const now = performance.now();
    this.frame(now);
    if (!this.reduced || this.pointerX !== null) this.raf = requestAnimationFrame(this.loop);
  };

  private frame(now: number): void {
    let elapsed = now - this.phaseStart;
    if (!this.reduced && elapsed > DRAW_MS + HOLD_MS + FADE_MS) {
      this.seed += 1;
      this.run += 1;
      this.reset();
      this.phaseStart = now;
      elapsed = 0;
    }

    const drawT = Math.min(1, elapsed / DRAW_MS);
    const eased = 1 - Math.pow(1 - drawT, 3);
    const step = Math.max(1, Math.round(eased * STEPS));
    const fade = this.reduced ? 1 : 1 - Math.max(0, (elapsed - DRAW_MS - HOLD_MS) / FADE_MS);

    this.advanceTo(step);
    this.draw(step, fade);

    if (now - this.lastEmit > 120) {
      this.lastEmit = now;
      this.stats.emit({
        paths: PATHS,
        step,
        steps: STEPS,
        edgeZ: this.edge[step] / Math.sqrt(step),
        percentile: this.pct[step],
        run: this.run,
      });
    }
  }

  /** Paint new crowd segments onto the accumulation layer. Batched so alpha stacks into density. */
  private paintCrowd(step: number, X: (t: number) => number, Y: (v: number) => number): void {
    const { accCtx: c, crowd, dpr } = this;
    if (this.drawn === 0) {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, this.acc.width, this.acc.height);
    }
    if (step <= this.drawn) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.lineWidth = 1;
    // Same path count on a smaller canvas stacks denser — thin the ink to match.
    const alpha = Math.max(0.008, Math.min(0.022, (0.022 * this.w) / 1100));
    c.strokeStyle = `rgba(201,207,214,${alpha.toFixed(4)})`;
    const from = this.drawn;
    const batch = Math.ceil(PATHS / BATCHES);
    for (let b = 0; b < PATHS; b += batch) {
      c.beginPath();
      for (let i = b; i < Math.min(PATHS, b + batch); i++) {
        c.moveTo(X(from), Y(crowd[from * PATHS + i]));
        for (let t = from + 1; t <= step; t++) c.lineTo(X(t), Y(crowd[t * PATHS + i]));
      }
      c.stroke();
    }
    this.drawn = step;
  }

  private draw(step: number, fade: number): void {
    const { ctx, w, h, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const x0 = w * 0.02;
    const x1 = w - Math.max(96, w * 0.08);
    const mid = h * 0.6;
    const span = h * 0.36;
    const scale = span / (2.4 * Math.sqrt(STEPS));
    const X = (t: number) => x0 + (t / STEPS) * (x1 - x0);
    const Y = (v: number) => mid - v * scale;

    this.paintCrowd(step, X, Y);
    ctx.globalAlpha = fade;

    // σ grid lines at the horizon
    ctx.font = '11px "Roboto Mono", monospace';
    ctx.textBaseline = 'middle';
    for (const k of [-2, -1, 0, 1, 2]) {
      const y = Y(k * Math.sqrt(STEPS));
      ctx.strokeStyle = k === 0 ? 'rgba(201,207,214,0.14)' : 'rgba(201,207,214,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0, Math.round(y) + 0.5);
      ctx.lineTo(w, Math.round(y) + 0.5);
      ctx.stroke();
      ctx.fillStyle = 'rgba(201,207,214,0.32)';
      ctx.fillText(k === 0 ? ' 0σ' : `${k > 0 ? '+' : '−'}${Math.abs(k)}σ`, w - 40, y - 9);
    }

    // Theoretical cone ±2σ√t
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = 'rgba(201,207,214,0.28)';
    for (const sgn of [1, -1]) {
      ctx.beginPath();
      for (let t = 0; t <= step; t += 2) {
        const x = X(t);
        const y = Y(sgn * 2 * Math.sqrt(t));
        t ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // The crowd
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.acc, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Terminal distribution histogram at the current front
    this.drawDensity(X(step), Y, step);

    // The edge
    ctx.strokeStyle = '#8EC9FF';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    ctx.moveTo(X(0), Y(0));
    for (let t = 1; t <= step; t++) ctx.lineTo(X(t), Y(this.edge[t]));
    ctx.stroke();

    const hx = X(step);
    const hy = Y(this.edge[step]);
    ctx.fillStyle = '#8EC9FF';
    ctx.beginPath();
    ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(142,201,255,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(hx, hy, 9, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#8EC9FF';
    ctx.textBaseline = 'middle';
    ctx.fillText('EDGE', hx + 16, hy - 8);
    ctx.fillStyle = 'rgba(201,207,214,0.6)';
    ctx.fillText(`P${Math.round(this.pct[step])}`, hx + 16, hy + 8);

    this.drawProbe(X, Y, x0, x1, step);
    ctx.globalAlpha = 1;
  }

  /** Sideways histogram of the crowd's distribution at the drawing front. */
  private drawDensity(x: number, Y: (v: number) => number, step: number): void {
    const { ctx } = this;
    const bins = 28;
    const lim = 3 * Math.sqrt(STEPS);
    const counts = new Array<number>(bins).fill(0);
    const base = step * PATHS;
    for (let i = 0; i < PATHS; i++) {
      const b = Math.floor(((this.crowd[base + i] + lim) / (2 * lim)) * bins);
      if (b >= 0 && b < bins) counts[b]++;
    }
    const max = Math.max(...counts) || 1;
    const bh = Math.abs(Y(0) - Y((2 * lim) / bins));
    ctx.fillStyle = 'rgba(201,207,214,0.10)';
    for (let i = 0; i < bins; i++) {
      const v = -lim + ((i + 0.5) / bins) * 2 * lim;
      const len = (counts[i] / max) * 56;
      ctx.fillRect(x + 4, Y(v) - bh / 2 + 0.5, len, Math.max(1, bh - 1.5));
    }
  }

  private drawProbe(X: (t: number) => number, Y: (v: number) => number, x0: number, x1: number, step: number): void {
    if (this.pointerX === null) return;
    const { ctx, h } = this;
    const t = Math.round(((this.pointerX - x0) / (x1 - x0)) * STEPS);
    if (t < 1 || t > step) return;
    const x = X(t);
    const y = Y(this.edge[t]);

    ctx.strokeStyle = 'rgba(201,207,214,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, h * 0.12);
    ctx.lineTo(Math.round(x) + 0.5, h);
    ctx.stroke();

    ctx.fillStyle = '#0A0B0D';
    ctx.strokeStyle = '#8EC9FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const lines = [`t   ${String(t).padStart(3, '0')}`, `z   ${(this.edge[t] / Math.sqrt(t)).toFixed(2)}σ`, `pct ${this.pct[t].toFixed(1)}`];
    const bw = 116;
    const bh = 62;
    const bx = x + 14 + bw > this.w ? x - 14 - bw : x + 14;
    const by = Math.max(8, Math.min(h - bh - 8, y - bh - 14));
    ctx.fillStyle = 'rgba(22,25,29,0.92)';
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(201,207,214,0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
    ctx.fillStyle = 'rgba(242,244,246,0.9)';
    ctx.textBaseline = 'top';
    lines.forEach((l, i) => ctx.fillText(l, bx + 12, by + 10 + i * 15));
  }
}
