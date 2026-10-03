import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../shared/reveal.directive';
import { gaussian, rng } from './random';

interface Bar {
  x: number;
  h: number;
  tail: boolean;
}

interface Marker {
  label: string;
  value: number;
  x: number;
}

const SAMPLES = 20_000;
const BINS = 72;
const MAX_US = 9;
const W = 1000;
const H = 260;

/** Illustrative tick-to-trade latency distribution (log-normal), with percentile markers. */
@Component({
  selector: 'aw-latency-histogram',
  hostDirectives: [RevealDirective],
  template: `
    <svg [attr.viewBox]="'0 -40 ' + W + ' ' + (H + 80)" role="img" aria-label="Illustrative latency distribution with p50, p99 and p99.9 markers">
      <line x1="0" [attr.y1]="H" [attr.x2]="W" [attr.y2]="H" class="base" />
      @for (b of bars; track $index; let i = $index) {
        <rect [attr.x]="b.x" [attr.y]="H - b.h" [attr.width]="W / BINS - 3" [attr.height]="b.h" [class.tail]="b.tail"
          [style.transition-delay.ms]="i * 12" />
      }
      @for (m of markers; track m.label; let i = $index) {
        <g class="marker" [class.main]="i === 0">
          <line [attr.x1]="m.x" y1="-8" [attr.x2]="m.x" [attr.y2]="H" />
          <text [attr.x]="m.x + 8" [attr.y]="-24 + i * 18">{{ m.label }} {{ m.value.toFixed(2) }}µs</text>
        </g>
      }
      @for (t of ticks; track t) {
        <text class="tick-label" [attr.x]="(t / MAX_US) * W" [attr.y]="H + 26" text-anchor="middle">{{ t }}µs</text>
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
    }
    svg {
      width: 100%;
      height: auto;
      overflow: visible;
    }
    rect {
      fill: rgb(201 207 214 / 0.32);
      transform-box: fill-box;
      transform-origin: bottom;
      transform: scaleY(0);
      transition: transform 0.8s var(--ease);
    }
    rect.tail {
      fill: rgb(201 207 214 / 0.14);
    }
    :host(.is-visible) rect {
      transform: none;
    }
    .base {
      stroke: var(--rule-strong);
    }
    .marker line {
      stroke: rgb(201 207 214 / 0.4);
      stroke-dasharray: 3 4;
    }
    .marker.main line {
      stroke: var(--aw-signal-blue);
      stroke-dasharray: none;
      stroke-width: 1.5;
    }
    text {
      font-family: var(--font-mono);
      font-size: 13px;
      fill: var(--ink-2);
    }
    .marker.main text {
      fill: var(--aw-signal-blue);
    }
    .tick-label {
      fill: var(--ink-3);
      font-size: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatencyHistogram {
  protected readonly W = W;
  protected readonly H = H;
  protected readonly BINS = BINS;
  protected readonly MAX_US = MAX_US;
  protected readonly ticks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  protected readonly bars: Bar[];
  protected readonly markers: Marker[];

  constructor() {
    const z = gaussian(rng(77));
    const samples = Array.from({ length: SAMPLES }, () => Math.exp(Math.log(2.4) + 0.32 * z())).sort((a, b) => a - b);
    const q = (p: number) => samples[Math.min(SAMPLES - 1, Math.floor(p * SAMPLES))];
    const p99 = q(0.99);

    const counts = new Array<number>(BINS).fill(0);
    for (const s of samples) {
      const b = Math.floor((s / MAX_US) * BINS);
      if (b < BINS) counts[b]++;
    }
    const max = Math.max(...counts);
    this.bars = counts.map((c, i) => ({
      x: (i / BINS) * W,
      h: c ? Math.max(2, (Math.sqrt(c) / Math.sqrt(max)) * H) : 0,
      tail: ((i + 0.5) / BINS) * MAX_US > p99,
    }));
    this.markers = [
      ['p50', q(0.5)],
      ['p99', p99],
      ['p99.9', q(0.999)],
    ].map(([label, value]) => ({ label: label as string, value: value as number, x: ((value as number) / MAX_US) * W }));
  }
}
