import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The final up-stroke of the AppianWay mark — used as the brand's directional glyph. */
@Component({
  selector: 'aw-tick',
  host: { class: 'tick', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 12 16" width="100%" height="100%">
      <line x1="1.5" y1="15" x2="10.5" y2="1" stroke="currentColor" stroke-width="2.2" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      width: 12px;
      height: 16px;
      flex: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tick {}
