import { Component, input } from '@angular/core';

@Component({
  selector: 'app-bug-token',
  host: { '[class.red]': "color() === 'red'", 'aria-hidden': 'true' },
  template: `<svg viewBox="0 0 64 64" focusable="false">
    <path class="legs" d="m21 24-9-7m9 16H8m13 9-9 7m31-25 9-7m-9 16h13m-13 9 9 7M26 14l-4-7m16 7 4-7" />
    <path fill="currentColor" d="M20 29c0-8 5-15 12-15s12 7 12 15v10c0 10-5 17-12 17s-12-7-12-17z" />
    <path class="eyes" d="M27 22h1m8 0h1" />
    <text x="32" y="44" text-anchor="middle">{{ symbol() || (color() === 'red' ? 'O' : 'X') }}</text>
  </svg>`,
  styles: `:host { display: inline-flex; width: 72px; height: 72px; color: var(--bug-color, var(--lime)); }
    :host(.red) { color: #ff827d; } svg { width: 100%; height: 100%; overflow: visible; }
    .legs { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; }
    .eyes { stroke: #101610; stroke-width: 4; stroke-linecap: round; }
    text { fill: #101610; font: bold 17px Consolas, monospace; }`,
})
export class BugToken {
  readonly color = input<'green' | 'red'>('green');
  readonly symbol = input('');
}
