import { Component, ElementRef, HostListener, OnDestroy, computed, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugToken } from '../bug-token/bug-token';

export interface Point { x: number; y: number }
export type Direction = 'up' | 'down' | 'left' | 'right';
const VECTORS: Record<Direction, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
export const BOARD_SIZE = 20;
const KEY = 'portfolio.bug-snake.best';
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export function stepSnake(body: Point[], direction: Direction, food: Point) {
  const vector = VECTORS[direction];
  const head = { x: body[0].x + vector.x, y: body[0].y + vector.y };
  const ate = same(head, food);
  const occupied = ate ? body : body.slice(0, -1);
  const collision = head.x < 0 || head.y < 0 || head.x >= BOARD_SIZE || head.y >= BOARD_SIZE || occupied.some(p => same(p, head));
  return { body: collision ? body : [head, ...(ate ? body : body.slice(0, -1))], ate, collision };
}

export function spawnFood(body: Point[]): Point | null {
  const empty = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => ({ x: i % BOARD_SIZE, y: Math.floor(i / BOARD_SIZE) })).filter(p => !body.some(b => same(p, b)));
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
}

@Component({
  selector: 'app-bug-snake', imports: [RouterLink, BugToken],
  templateUrl: './bug-snake.html', styleUrl: './bug-snake.scss',
})
export class BugSnake implements OnDestroy {
  readonly board = viewChild<ElementRef<HTMLElement>>('board');
  readonly body = signal<Point[]>([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]);
  readonly food = signal<Point | null>({ x: 10, y: 10 });
  readonly direction = signal<Direction>('right');
  readonly phase = signal<'ready' | 'playing' | 'paused' | 'over' | 'won'>('ready');
  readonly elapsed = signal(0);
  readonly best = signal(this.loadBest());
  readonly clock = computed(() => `${Math.floor(this.elapsed() / 60)}:${String(this.elapsed() % 60).padStart(2, '0')}`);
  readonly rotation = computed(() => ({ up: 0, right: 90, down: 180, left: 270 })[this.direction()]);
  readonly message = computed(() => ({ ready: 'A tiny bug. A big appetite.', playing: 'Eat the pink snacks. Keep growing!', paused: 'Take a breath. Your bug can wait.', over: 'Oops, a crash! Ready to grow again?', won: 'Garden complete. One magnificent bug!' })[this.phase()]);
  private turns: Direction[] = [];
  private timer?: ReturnType<typeof setInterval>;
  private startedAt = 0;
  private playedMs = 0;

  start(): void {
    this.stopTimer();
    this.body.set([{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }]);
    this.food.set(spawnFood(this.body()));
    this.direction.set('right'); this.turns = [];
    this.elapsed.set(0); this.playedMs = 0;
    this.phase.set('playing'); this.runTimer();
    this.board()?.nativeElement.focus();
  }

  turn(direction: Direction): void {
    if (this.phase() !== 'playing' || this.turns.length >= 2) return;
    const current = this.turns.at(-1) ?? this.direction();
    const a = VECTORS[current], b = VECTORS[direction];
    if (direction !== current && !(a.x + b.x === 0 && a.y + b.y === 0)) this.turns.push(direction);
  }

  tick(): void {
    if (this.phase() !== 'playing') return;
    this.elapsed.set(Math.floor((this.playedMs + Date.now() - this.startedAt) / 1000));
    this.direction.set(this.turns.shift() ?? this.direction());
    const result = stepSnake(this.body(), this.direction(), this.food()!);
    if (result.collision) { this.finish('over'); return; }
    this.body.set(result.body);
    if (result.ate) {
      this.saveBest();
      const food = spawnFood(result.body);
      this.food.set(food);
      if (!food) this.finish('won');
    }
  }

  togglePause(): void {
    if (this.phase() === 'playing') {
      this.playedMs += Date.now() - this.startedAt;
      this.elapsed.set(Math.floor(this.playedMs / 1000));
      this.stopTimer(); this.phase.set('paused');
    } else if (this.phase() === 'paused') {
      this.phase.set('playing'); this.runTimer(); this.board()?.nativeElement.focus();
    }
  }

  keyboard(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const directions: Record<string, Direction> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
    const direction = directions[event.key];
    if (direction) { event.preventDefault(); this.turn(direction); }
    else if (!event.repeat && [' ', 'p', 'Escape'].includes(event.key)) { event.preventDefault(); this.togglePause(); }
  }

  point(event: PointerEvent): void {
    if (this.phase() !== 'playing' || (event.type === 'pointermove' && event.pointerType !== 'mouse' && !event.buttons)) return;
    const rect = this.board()?.nativeElement.getBoundingClientRect();
    if (!rect) return;
    const head = this.body()[0];
    const dx = (event.clientX - rect.left) / rect.width * BOARD_SIZE - head.x - 0.5;
    const dy = (event.clientY - rect.top) / rect.height * BOARD_SIZE - head.y - 0.5;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 0.7) return;
    this.turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }

  @HostListener('document:visibilitychange') hidden(): void { if (document.hidden && this.phase() === 'playing') this.togglePause(); }
  @HostListener('window:blur') blur(): void { if (this.phase() === 'playing') this.togglePause(); }
  ngOnDestroy(): void { this.stopTimer(); }

  private runTimer(): void { this.startedAt = Date.now(); this.timer = setInterval(() => this.tick(), 150); }
  private stopTimer(): void { if (this.timer !== undefined) clearInterval(this.timer); this.timer = undefined; }
  private finish(phase: 'over' | 'won'): void { this.stopTimer(); this.phase.set(phase); this.saveBest(); }
  private saveBest(): void {
    if (this.body().length <= this.best()) return;
    this.best.set(this.body().length);
    try { localStorage.setItem(KEY, String(this.best())); } catch { /* Play without storage. */ }
  }
  private loadBest(): number {
    try { const best = Number(localStorage.getItem(KEY)); return Number.isInteger(best) && best >= 3 && best <= 400 ? best : 3; } catch { return 3; }
  }
}
