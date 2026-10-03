import { Directive, ElementRef, OnDestroy, afterNextRender, inject, input, numberAttribute } from '@angular/core';

/** Adds `.is-visible` once the element scrolls into view. Styles live in styles.scss. */
@Directive({
  selector: '[awReveal]',
  host: { '[style.--reveal-delay.ms]': 'awReveal()' },
})
export class RevealDirective implements OnDestroy {
  /** Optional delay in ms; bare `awReveal` means no delay. */
  readonly awReveal = input(0, { transform: (v: unknown) => numberAttribute(v, 0) });

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (!('IntersectionObserver' in window)) {
        node.classList.add('is-visible');
        return;
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              node.classList.add('is-visible');
              this.observer?.disconnect();
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
