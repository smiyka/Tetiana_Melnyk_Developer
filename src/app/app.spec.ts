import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('Page navigation', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] }));

  it('keeps the CV separate from games and missions and offers a CV download', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await TestBed.inject(Router).navigateByUrl('/cv');
    await fixture.whenStable();
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent).toContain('Tetiana Melnyk');
    expect(root.querySelector('a[download]')?.getAttribute('href')).toBe('tetiana-melnyk-cv.pdf');
    const printLink = root.querySelector<HTMLAnchorElement>('.cv-print-link');
    expect(printLink?.getAttribute('href')).toBe('tetiana-melnyk-cv.pdf');
    expect(printLink?.target).toBe('_blank');
    expect(root.querySelector('app-bug-game')).toBeNull();
    expect(root.querySelector('.mission-grid')).toBeNull();
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
});
