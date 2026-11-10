import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<'light' | 'dark'>(this.document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light');

  constructor() {
    this.applyTheme(this.theme());
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    try { this.document.defaultView?.localStorage.setItem('portfolio-theme', theme); } catch { /* Themes work without storage. */ }
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    this.document.documentElement.dataset['theme'] = theme;
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#19131c' : '#fff8fb');
  }

  readonly main = viewChild<ElementRef<HTMLElement>>('main');
  skip(event: Event): void { event.preventDefault(); this.main()?.nativeElement.focus(); }
  onPageChange(): void { this.main()?.nativeElement.focus({ preventScroll: true }); }
}
