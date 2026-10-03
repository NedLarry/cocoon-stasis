import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer';
import { Header } from './layout/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <a class="skip" href="#main">Skip to content</a>
    <aw-header />
    <main id="main">
      <router-outlet />
    </main>
    <aw-footer />
  `,
  styles: `
    .skip {
      position: absolute;
      left: 16px;
      top: -60px;
      z-index: 100;
      padding: 10px 14px;
      background: var(--aw-signal-blue);
      color: var(--aw-onyx);
      font-family: var(--font-mono);
      font-size: 12px;
      &:focus {
        top: 12px;
      }
    }
    main {
      display: block;
      min-height: 100vh;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
