import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Section label styled after a Roman milestone (miliarium):
 * "M·P III ——— Research". Every section on the road gets one.
 */
@Component({
  selector: 'aw-milestone',
  template: `
    <span class="mp">M·P</span>
    <span class="num">{{ numeral() }}</span>
    <span class="rule" aria-hidden="true"></span>
    <span class="label">{{ label() }}</span>
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: var(--font-mono);
      font-size: 12px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ink-3);
    }
    .num {
      color: var(--accent);
      min-width: 3ch;
    }
    .rule {
      width: 56px;
      height: 1px;
      background: var(--rule-strong);
    }
    .label {
      color: var(--ink-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Milestone {
  readonly numeral = input.required<string>();
  readonly label = input.required<string>();
}
