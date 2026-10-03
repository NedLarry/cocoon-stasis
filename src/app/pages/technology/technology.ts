import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Milestone } from '../../shared/milestone';
import { NextMilestone } from '../../shared/next-milestone';
import { PageHero } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { LatencyHistogram } from '../../viz/latency-histogram';
import { OrderBook } from '../../viz/order-book';

@Component({
  selector: 'aw-technology',
  imports: [Milestone, NextMilestone, PageHero, RevealDirective, LatencyHistogram, OrderBook],
  templateUrl: './technology.html',
  styleUrl: './technology.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Technology {
  protected readonly stack = [
    {
      area: 'Trading engine',
      items: ['Modern C++', 'Kernel-bypass networking', 'FPGA feed handlers', 'Lock-free messaging'],
    },
    {
      area: 'Research platform',
      items: ['Python & Rust', 'Columnar tick store', 'Distributed backtester', 'Notebook-to-production tooling'],
    },
    {
      area: 'Infrastructure',
      items: ['Co-located servers', 'Precision time (PTP)', 'Elastic compute grid', 'Infrastructure as code'],
    },
    {
      area: 'Reliability',
      items: ['Deterministic replay', 'Full-fidelity capture', 'Canary deployment', 'Automated risk checks'],
    },
  ];

  protected readonly tenets = [
    { n: '01', title: 'Measure everything', body: 'If it is not instrumented, it is not in production. Every hop is timestamped in nanoseconds.' },
    { n: '02', title: 'Determinism by design', body: 'Any day of trading can be replayed bit-for-bit — so every anomaly can be explained.' },
    { n: '03', title: 'Own the critical path', body: 'We build what differentiates us and buy what does not. The hot path is always ours.' },
  ];
}
