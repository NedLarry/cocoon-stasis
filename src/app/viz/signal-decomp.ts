import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RevealDirective } from '../shared/reveal.directive';
import { gaussian, rng, toPath } from './random';

interface Row {
  key: string;
  label: string;
  title: string;
  body: string;
  data: number[];
}

const N = 240;
const W = 1000;
const ROW_H = 92;
const GAP = 28;

/**
 * A classical time-series decomposition — observed = trend + seasonal + residual —
 * used to describe how we think about markets. Synthetic data.
 */
@Component({
  selector: 'aw-signal-decomp',
  hostDirectives: [RevealDirective],
  templateUrl: './signal-decomp.html',
  styleUrl: './signal-decomp.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalDecomp {
  protected readonly W = W;
  protected readonly ROW_H = ROW_H;
  protected readonly GAP = GAP;
  protected readonly height = 4 * ROW_H + 3 * GAP;

  protected readonly rows: Row[];
  protected readonly active = signal(1);
  protected readonly current = computed(() => this.rows[this.active()]);
  protected readonly paths: string[];

  constructor() {
    const z = gaussian(rng(4242));
    const trend: number[] = [];
    const season: number[] = [];
    const resid: number[] = [];
    for (let i = 0; i < N; i++) {
      trend.push(0.011 * i + 0.9 * Math.sin(i / 48) + 0.35 * Math.sin(i / 17 + 1));
      season.push(0.55 * Math.sin((2 * Math.PI * i) / 26) + 0.22 * Math.sin((2 * Math.PI * i) / 8.5));
      resid.push(0.42 * z());
    }
    const observed = trend.map((t, i) => t + season[i] + resid[i]);

    this.rows = [
      {
        key: 'observed',
        label: 'Observed',
        title: 'The road as it appears.',
        body: 'Prices are the sum of many processes at once. Read naively, every wiggle looks like information.',
        data: observed,
      },
      {
        key: 'trend',
        label: 'Signal',
        title: 'Persistent, forecastable drift.',
        body: 'The small, durable component we can predict ahead of time — tested out-of-sample, across regimes and markets.',
        data: trend,
      },
      {
        key: 'season',
        label: 'Structure',
        title: 'Patterns with a cause.',
        body: 'Intraday seasonality, index rebalances, flows and auctions. Structure we schedule around, not guess at.',
        data: season,
      },
      {
        key: 'resid',
        label: 'Noise',
        title: 'What we refuse to trade.',
        body: 'The residual is not discarded — it is measured. Its variance sets position sizes and every risk limit we run.',
        data: resid,
      },
    ];

    this.paths = this.rows.map((row, r) => {
      const min = Math.min(...row.data);
      const max = Math.max(...row.data);
      const top = r * (ROW_H + GAP);
      return toPath(row.data.map((v, i) => [(i / (N - 1)) * W, top + ROW_H - ((v - min) / (max - min || 1)) * ROW_H] as const));
    });
  }
}
