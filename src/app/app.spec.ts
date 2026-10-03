import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { toRoman } from './shared/roman';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the header and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('aw-header img')?.getAttribute('alt')).toBe('AppianWay');
    expect(el.querySelector('aw-footer .motto')?.textContent).toContain('Your active edge.');
  });
});

describe('toRoman', () => {
  it('converts years', () => {
    expect(toRoman(2026)).toBe('MMXXVI');
    expect(toRoman(312)).toBe('CCCXII');
    expect(toRoman(404)).toBe('CDIV');
  });
});
