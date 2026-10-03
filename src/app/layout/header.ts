import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { MarketClock } from '../shared/market-clock';

@Component({
  selector: 'aw-header',
  imports: [RouterLink, RouterLinkActive, MarketClock],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    '[class.scrolled]': 'scrolled()',
    '[class.menu-open]': 'menuOpen()',
    '(window:scroll)': 'onScroll()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly nav = [
    { path: '/approach', label: 'Approach', numeral: 'I' },
    { path: '/technology', label: 'Technology', numeral: 'II' },
    { path: '/careers', label: 'Careers', numeral: 'III' },
  ];

  protected readonly scrolled = signal(false);
  protected readonly progress = signal(0);
  protected readonly menuOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  protected onScroll(): void {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.scrolled.set(y > 8);
    this.progress.set(max > 0 ? Math.min(1, y / max) : 0);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }
}
