import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Milestone } from './milestone';
import { PavingBand } from './paving-band';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'aw-page-hero',
  imports: [Milestone, PavingBand, RevealDirective],
  template: `
    <div class="container inner">
      <aw-milestone [numeral]="numeral()" [label]="label()" awReveal />
      <h1 class="display" awReveal="80"><ng-content select="[title]" /></h1>
      <div class="lede" awReveal="160"><ng-content select="[lede]" /></div>
    </div>
    <aw-paving-band class="band" [height]="110" [seed]="seed()" />
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      padding-top: calc(var(--header-h) + clamp(72px, 12vw, 160px));
    }
    .inner {
      display: grid;
      gap: 32px;
      padding-bottom: clamp(72px, 10vw, 128px);
    }
    .display {
      max-width: 14ch;
    }
    .band {
      height: 110px;
      border-top: 1px solid var(--rule);
      mask-image: linear-gradient(to bottom, #000, transparent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHero {
  readonly numeral = input.required<string>();
  readonly label = input.required<string>();
  readonly seed = input(5);
}
