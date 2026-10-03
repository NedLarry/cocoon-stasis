import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PavingBand } from '../../shared/paving-band';
import { Tick } from '../../shared/tick';

@Component({
  selector: 'aw-not-found',
  imports: [RouterLink, PavingBand, Tick],
  template: `
    <aw-paving-band class="bg" [height]="900" [cell]="72" [seed]="404" />
    <div class="container inner">
      <p class="eyebrow">M·P CDIV — Off the road</p>
      <h1 class="display">This path has<br /><span class="accent">no edge.</span></h1>
      <p class="lede">The page you were looking for doesn't exist, or has moved.</p>
      <a routerLink="/" class="btn btn--primary">Return to the road <aw-tick /></a>
    </div>
  `,
  styles: `
    :host {
      display: grid;
      align-items: center;
      position: relative;
      min-height: 100svh;
      overflow: hidden;
    }
    .bg {
      position: absolute;
      inset: 0;
      mask-image: radial-gradient(ellipse at 70% 50%, #000, transparent 70%);
    }
    .inner {
      position: relative;
      display: grid;
      gap: 28px;
      justify-items: start;
      padding-top: var(--header-h);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
