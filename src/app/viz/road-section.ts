import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { paving } from './paving';
import { rng } from './random';

interface Layer {
  id: string;
  latin: string;
  gloss: string;
  name: string;
  body: string;
  spec: string[];
  /** Vertical band in the diagram's 1000×460 viewBox. */
  y: number;
  h: number;
}

const LAYERS: Layer[] = [
  {
    id: 'crusta',
    latin: 'Summa crusta',
    gloss: 'Fitted polygonal basalt',
    name: 'Execution',
    body: 'The surface that meets the market. Smart order routing and microstructure-aware algorithms that work every order for minimal impact, slippage and information leakage.',
    spec: ['Direct market access', 'Adaptive order scheduling', 'Real-time TCA'],
    y: 40,
    h: 86,
  },
  {
    id: 'nucleus',
    latin: 'Nucleus',
    gloss: 'Kernel of gravel, sand & lime',
    name: 'Strategy',
    body: 'Portfolio construction binds individual signals into one coherent book — sized by conviction, constrained by risk, and netted for cost before a single order is sent.',
    spec: ['Signal combination', 'Convex optimisation', 'Cost-aware sizing'],
    y: 126,
    h: 72,
  },
  {
    id: 'rudus',
    latin: 'Rudus',
    gloss: 'Broken stone in lime mortar',
    name: 'Research',
    body: 'Hypotheses broken against decades of data. Out-of-sample by default, walk-forward by habit, and corrected for the thousand tests we did not publish.',
    spec: ['Point-in-time datasets', 'Walk-forward validation', 'Multiple-testing control'],
    y: 198,
    h: 112,
  },
  {
    id: 'statumen',
    latin: 'Statumen',
    gloss: 'Foundation of large flat stones',
    name: 'Infrastructure',
    body: 'Unseen, and the reason everything above holds. Clean data pipelines, elastic research compute and co-located production hardware, engineered for determinism.',
    spec: ['Tick-level data lake', 'Elastic compute grid', 'Co-located hardware'],
    y: 310,
    h: 130,
  },
];

interface Blob {
  cx: number;
  cy: number;
  r: number;
  points: string;
}

/**
 * Cross-section of a Roman road (after Vitruvius) used as a model of the firm's stack.
 * Each construction layer maps to one layer of how AppianWay trades.
 */
@Component({
  selector: 'aw-road-section',
  templateUrl: './road-section.html',
  styleUrl: './road-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadSection {
  protected readonly layers = LAYERS;
  protected readonly active = signal(0);
  private auto = true;

  protected readonly stones = paving(1000, 86, 52, 11, 2.4);
  /** Per-stone tone so the basalt reads as individual blocks. */
  protected readonly shades = this.stones.map((_, i) => 0.55 + rng(i + 101)() * 0.45);
  protected readonly gravel = this.scatter(LAYERS[1], 900, 1.2, 2.6, 21);
  protected readonly rubble = this.scatter(LAYERS[2], 340, 6, 14, 33);
  protected readonly boulders = this.scatter(LAYERS[3], 90, 20, 36, 47);

  constructor() {
    const id = setInterval(() => {
      if (this.auto) this.active.update((i) => (i + 1) % LAYERS.length);
    }, 5000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  protected select(i: number): void {
    this.auto = false;
    this.active.set(i);
  }

  protected onKey(e: KeyboardEvent, i: number): void {
    const next = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = (next + LAYERS.length) % LAYERS.length;
    this.select(n);
    (document.getElementById(`layer-tab-${n}`) as HTMLElement | null)?.focus();
  }

  /** Irregular rounded stones scattered within a layer band. */
  private scatter(layer: Layer, count: number, rMin: number, rMax: number, seed: number): Blob[] {
    const rand = rng(seed);
    return Array.from({ length: count }, () => {
      const r = rMin + rand() * (rMax - rMin);
      const cx = rand() * 1000;
      const cy = layer.y + r + rand() * Math.max(1, layer.h - 2 * r);
      const sides = 7;
      const pts: string[] = [];
      for (let k = 0; k < sides; k++) {
        const a = (k / sides) * Math.PI * 2 + rand() * 0.4;
        const rr = r * (0.72 + rand() * 0.36);
        pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * 0.72).toFixed(1)}`);
      }
      return { cx, cy, r, points: pts.join(' ') };
    });
  }
}
