import { Component, ElementRef, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly main = viewChild<ElementRef<HTMLElement>>('main');
  skip(event: Event): void { event.preventDefault(); this.main()?.nativeElement.focus(); }
  onPageChange(): void { this.main()?.nativeElement.focus({ preventScroll: true }); }
}
