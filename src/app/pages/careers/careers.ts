import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ROLES, TEAMS, Team } from '../../data/roles';
import { Milestone } from '../../shared/milestone';
import { NextMilestone } from '../../shared/next-milestone';
import { PageHero } from '../../shared/page-hero';
import { RevealDirective } from '../../shared/reveal.directive';
import { Tick } from '../../shared/tick';

@Component({
  selector: 'aw-careers',
  imports: [Milestone, NextMilestone, PageHero, RevealDirective, Tick],
  templateUrl: './careers.html',
  styleUrl: './careers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Careers {
  protected readonly teams = TEAMS;
  protected readonly team = signal<Team | 'All'>('All');
  protected readonly open = signal<string | null>(null);
  protected readonly roles = computed(() => ROLES.filter((r) => this.team() === 'All' || r.team === this.team()));
  protected readonly counts = computed(() =>
    Object.fromEntries(['All', ...TEAMS].map((t) => [t, t === 'All' ? ROLES.length : ROLES.filter((r) => r.team === t).length])),
  );

  protected readonly process = [
    { n: 'I', name: 'Apply', body: 'A CV and a few lines on a problem you found interesting. No cover letter templates.' },
    { n: 'II', name: 'Assessment', body: 'A short online exercise in probability, programming or both, depending on the role.' },
    { n: 'III', name: 'Technical', body: 'Two or three conversations with the people you would work with. Real problems, not trivia.' },
    { n: 'IV', name: 'Final day', body: 'Meet the team, see how we work and ask us anything. We decide quickly after.' },
  ];

  protected readonly offer = [
    { k: 'Impact', v: 'Small teams, direct ownership. Your work reaches production — and P&L — in weeks.' },
    { k: 'Learning', v: 'Weekly research seminars, an internal curriculum and a generous education budget.' },
    { k: 'Compensation', v: 'Top-of-market salary and a bonus tied to firm and individual performance.' },
    { k: 'Wellbeing', v: 'Comprehensive health cover, meals in the office, and time off that is actually taken.' },
  ];

  constructor() {
    inject(ActivatedRoute)
      .fragment.pipe(takeUntilDestroyed())
      .subscribe((f) => {
        if (f && ROLES.some((r) => r.id === f)) {
          this.team.set('All');
          this.open.set(f);
        }
      });
  }

  protected toggle(id: string): void {
    this.open.update((cur) => (cur === id ? null : id));
  }

  protected mailto(title: string): string {
    return `mailto:careers@appianway.com?subject=${encodeURIComponent('Application — ' + title)}`;
  }
}
