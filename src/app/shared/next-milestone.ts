import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tick } from './tick';

/** End-of-page link to the next page along the road. */
@Component({
  selector: 'aw-next-milestone',
  imports: [RouterLink, Tick],
  template: `
    <div class="container inner">
      <p class="eyebrow">Next milestone</p>
      <a [routerLink]="link()" class="next-link">
        <span class="mono">{{ numeral() }}</span> {{ label() }} <aw-tick />
      </a>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding-block: 96px;
      border-top: 1px solid var(--rule);
    }
    .inner {
      display: grid;
      gap: 16px;
    }
    .next-link {
      display: inline-flex;
      align-items: center;
      gap: 24px;
      font-size: clamp(40px, 7vw, 96px);
      font-weight: 300;
      letter-spacing: -0.04em;
      line-height: 1.1;
      width: fit-content;
      .mono {
        font-size: 16px;
        color: var(--aw-signal-blue);
      }
      aw-tick {
        width: 28px;
        height: 40px;
        color: var(--aw-signal-blue);
        transition: transform 0.4s var(--ease);
      }
      &:hover aw-tick {
        transform: translate(8px, -8px);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextMilestone {
  readonly numeral = input.required<string>();
  readonly label = input.required<string>();
  readonly link = input.required<string>();
}
