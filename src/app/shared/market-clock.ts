import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

interface Venue {
  code: string;
  tz: string;
  /** Regular session in local minutes-from-midnight, Mon–Fri. Holidays are ignored. */
  open: number;
  close: number;
}

const VENUES: Venue[] = [
  { code: 'NGX', tz: 'Africa/Lagos', open: 10 * 60, close: 14 * 60 + 30 },
  { code: 'JSE', tz: 'Africa/Johannesburg', open: 9 * 60, close: 17 * 60 },
  { code: 'LDN', tz: 'Europe/London', open: 8 * 60, close: 16 * 60 + 30 },
];

interface VenueState {
  code: string;
  time: string;
  open: boolean;
}

/** Live local clocks for the major venues, with a session-open indicator. */
@Component({
  selector: 'aw-market-clock',
  template: `
    @for (v of venues(); track v.code) {
      <span class="venue" [class.open]="v.open" [attr.title]="v.code + (v.open ? ' — regular session open' : ' — closed')">
        <i aria-hidden="true"></i>{{ v.code }} <b>{{ v.time }}</b>
      </span>
    }
  `,
  styles: `
    :host {
      display: flex;
      gap: 18px;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.08em;
      color: var(--ink-3);
      font-feature-settings: 'tnum' 1;
    }
    .venue {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    b {
      font-weight: 400;
      color: var(--ink-2);
    }
    i {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--rule-strong);
    }
    .open i {
      background: var(--aw-signal-blue);
      box-shadow: 0 0 0 3px rgb(142 201 255 / 0.15);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketClock {
  protected readonly venues = signal<VenueState[]>(this.compute());

  constructor() {
    const id = setInterval(() => this.venues.set(this.compute()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  private compute(): VenueState[] {
    const now = new Date();
    return VENUES.map((v) => {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: v.tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
        hourCycle: 'h23',
      }).formatToParts(now);
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
      const minutes = Number(get('hour')) * 60 + Number(get('minute'));
      const weekday = !['Sat', 'Sun'].includes(get('weekday'));
      return {
        code: v.code,
        time: `${get('hour')}:${get('minute')}:${get('second')}`,
        open: weekday && minutes >= v.open && minutes < v.close,
      };
    });
  }
}
