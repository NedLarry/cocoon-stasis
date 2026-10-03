import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Milestone } from '../../shared/milestone';
import { NextMilestone } from '../../shared/next-milestone';
import { PageHero } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { SignalDecomp } from '../../viz/signal-decomp';

@Component({
  selector: 'aw-approach',
  imports: [Milestone, NextMilestone, PageHero, RevealDirective, SignalDecomp],
  templateUrl: './approach.html',
  styleUrl: './approach.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Approach {
  /** Survival share is illustrative — it conveys how selective the pipeline is. */
  protected readonly pipeline = [
    { n: 'I', name: 'Hypothesis', body: 'A falsifiable claim about why a price should move, grounded in economics or market structure.', survive: 100 },
    { n: 'II', name: 'Data', body: 'Point-in-time, survivorship-free datasets assembled and cleaned before a single test is run.', survive: 62 },
    { n: 'III', name: 'Backtest', body: 'Realistic simulation with costs, latency and capacity — not a curve fitted to the past.', survive: 31 },
    { n: 'IV', name: 'Out-of-sample', body: 'Walk-forward and hold-out validation, corrected for every other test we have ever run.', survive: 12 },
    { n: 'V', name: 'Paper', body: 'Live data, simulated orders. The model must behave in production as it did in research.', survive: 6 },
    { n: 'VI', name: 'Production', body: 'Small capital first, scaled with evidence, monitored continuously and retired without sentiment.', survive: 3 },
  ];

  protected readonly markets = [
    { asset: 'Nigerian equities', instruments: 'NGX-listed equities and ETFs', horizon: 'Intraday — multi-day' },
    { asset: 'Fixed income', instruments: 'FGN bonds, Nigerian Treasury Bills, OMO bills', horizon: 'Days — months' },
    { asset: 'FX', instruments: 'USD/NGN and major African currency pairs', horizon: 'Intraday — days' },
    { asset: 'Pan-African', instruments: 'JSE and other liquid African exchanges', horizon: 'Roadmap — next' },
    { asset: 'Global', instruments: 'Futures, FX and equities in developed markets', horizon: 'Roadmap — later' },
  ];

  protected readonly risk = [
    { k: 'Pre-trade', v: 'Hard limits on every order: size, price bands, notional and message rate — enforced in hardware and software.' },
    { k: 'Real-time', v: 'Exposure, factor risk and P&L recomputed continuously across every book and venue.' },
    { k: 'Drawdown', v: 'Automatic de-risking at predefined thresholds. No strategy is too good to be switched off.' },
    { k: 'Independent', v: 'Risk reports to the firm, not to the strategy. Separation is structural, not cultural.' },
  ];
}
