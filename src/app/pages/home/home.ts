import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ROLES } from '../../data/roles';
import { Milestone } from '../../shared/milestone';
import { PavingBand } from '../../shared/paving-band';
import { RevealDirective } from '../../shared/reveal.directive';
import { Tick } from '../../shared/tick';
import { PathField, PathStats } from '../../viz/path-field';
import { RoadSection } from '../../viz/road-section';
import { SignalDecomp } from '../../viz/signal-decomp';

@Component({
  selector: 'aw-home',
  imports: [DecimalPipe, RouterLink, Milestone, PavingBand, RevealDirective, Tick, PathField, RoadSection, SignalDecomp],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly stats = signal<PathStats | null>(null);
  protected readonly roles = ROLES.filter((r) => r.type === 'Full-time').slice(0, 4);

  protected readonly principles = [
    {
      n: 'I',
      title: 'Evidence over intuition',
      body: 'Every idea is a hypothesis until the data says otherwise. Conviction is earned out-of-sample.',
    },
    {
      n: 'II',
      title: 'Small edges, many times',
      body: 'We do not need to be right often — only slightly more often, across thousands of independent bets.',
    },
    {
      n: 'III',
      title: 'Risk is a signal',
      body: 'Variance, correlation and liquidity are modelled with the same rigour as returns. Survival compounds.',
    },
    {
      n: 'IV',
      title: 'Engineering is alpha',
      body: 'A forecast is only as good as the system that acts on it. Our engineers sit at the centre of the firm.',
    },
  ];
}
