import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Page navigation', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()] }));

  it('keeps the CV separate from games and the lab and offers a CV download', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/cv');
    await fixture.whenStable();
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent).toContain('Tetiana Melnyk');
    expect(root.querySelector('.cv-page')?.lastElementChild?.tagName).toBe('APP-CODEWARS');
    expect(root.querySelector('a[download]')?.getAttribute('href')).toBe('tetiana-melnyk-cv.pdf');
    const printLink = root.querySelector<HTMLAnchorElement>('.cv-print-link');
    expect(printLink?.getAttribute('href')).toBe('tetiana-melnyk-cv.pdf');
    expect(printLink?.target).toBe('_blank');
    expect(root.querySelector('app-bug-game')).toBeNull();
    expect(root.querySelector('app-developer-lab')).toBeNull();
    expect(root.querySelector('nav a[aria-current="page"]')?.textContent).toBe('My CV');
  });

  it('opens each game on its own page and supports the previous Bug Blaster link', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/games/tic-tac-toe');
    await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.square')).toHaveLength(9);
    expect(fixture.nativeElement.querySelector('app-cv')).toBeNull();
    await router.navigateByUrl('/bug-blaster');
    await fixture.whenStable(); fixture.detectChanges();
    expect(router.url).toBe('/games/bug-blaster');
    expect(fixture.nativeElement.querySelector('app-bug-game')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.board')).toBeNull();
  });

  it('redirects the earlier missions URL to the structured Developer Lab', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/missions');
    await fixture.whenStable(); fixture.detectChanges();
    expect(router.url).toBe('/lab');
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('See how I build');
    expect(fixture.nativeElement.querySelector('nav a[aria-current="page"]')?.textContent).toBe('Developer Lab');
  });

  it('lists six games and opens the three new games as separate pages', async () => {
    const fixture = TestBed.createComponent(App), router = TestBed.inject(Router);
    fixture.detectChanges();
    await router.navigateByUrl('/games'); await fixture.whenStable(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.game-destination')).toHaveLength(6);
    for (const [path, selector, count] of [['bug-memory', '.memory-card', 16], ['bug-merge', '.merge-cell', 16], ['bug-defense', '.build-pad', 10]] as const) {
      await router.navigateByUrl(`/games/${path}`); await fixture.whenStable(); fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll(selector)).toHaveLength(count);
      expect(fixture.nativeElement.querySelector('app-cv')).toBeNull();
    }
  });
});

describe('Color themes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] });
    localStorage.removeItem('portfolio-theme');
    delete document.documentElement.dataset['theme'];
  });

  afterEach(() => {
    localStorage.removeItem('portfolio-theme');
    delete document.documentElement.dataset['theme'];
  });

  it('switches both themes through accessible buttons and saves the choice', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.theme-switch button') as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    fixture.detectChanges();
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    buttons[0].click();
    fixture.detectChanges();
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(localStorage.getItem('portfolio-theme')).toBe('light');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('preserves the theme applied before Angular starts', () => {
    document.documentElement.dataset['theme'] = 'dark';
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.componentInstance.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('still changes theme when storage is unavailable', () => {
    const fixture = TestBed.createComponent(App);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage blocked'); });
    try {
      expect(() => fixture.componentInstance.setTheme('dark')).not.toThrow();
      expect(document.documentElement.dataset['theme']).toBe('dark');
    } finally { vi.restoreAllMocks(); }
  });
});
