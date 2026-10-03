import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { paving } from '../viz/paving';

/** A strip of fitted Via Appia paving, used as a divider and background texture. */
@Component({
  selector: 'aw-paving-band',
  template: `
    <svg [attr.viewBox]="'0 0 1600 ' + height()" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      @for (s of stones(); track $index) {
        <polygon [attr.points]="s" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
      pointer-events: none;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    polygon {
      fill: rgb(201 207 214 / 0.035);
      stroke: rgb(201 207 214 / 0.09);
      stroke-width: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PavingBand {
  readonly height = input(120);
  readonly cell = input(56);
  readonly seed = input(3);
  protected readonly stones = computed(() => paving(1600, this.height(), this.cell(), this.seed(), 2));
}
