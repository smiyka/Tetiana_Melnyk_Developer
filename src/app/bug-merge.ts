import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugToken } from './bug-token';

export type MergeDirection = 'up' | 'down' | 'left' | 'right';
export function slideBugs(board: readonly number[], direction: MergeDirection) {
  const next = [...board]; let score = 0;
  for (let line = 0; line < 4; line++) {
    const indices = Array.from({ length: 4 }, (_, i) => direction === 'left' ? line * 4 + i : direction === 'right' ? line * 4 + 3 - i : direction === 'up' ? i * 4 + line : (3 - i) * 4 + line);
    const values = indices.map(i => board[i]).filter(Boolean);
    const merged: number[] = [];
    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) { const value = values[i] * 2; merged.push(value); score += value; i++; }
      else merged.push(values[i]);
    }
    indices.forEach((index, i) => { next[index] = merged[i] ?? 0; });
  }
  return { board: next, score, changed: next.some((value, i) => value !== board[i]) };
}
export function canMergeMove(board: readonly number[]): boolean {
  return board.some(value => !value) || board.some((value, i) => (i % 4 < 3 && value === board[i + 1]) || (i < 12 && value === board[i + 4]));
}
export function addMergeBug(board: readonly number[]): number[] {
  const free = board.flatMap((value, i) => value ? [] : [i]);
  if (!free.length) return [...board];
  const next = [...board]; next[free[Math.floor(Math.random() * free.length)]] = Math.random() < .9 ? 2 : 4;
  return next;
}

@Component({ selector: 'app-bug-merge', imports: [RouterLink, BugToken], templateUrl: './bug-merge.html', styleUrls: ['./arcade.scss', './bug-merge.scss'] })
export class BugMerge {
  readonly boardElement = viewChild<ElementRef<HTMLElement>>('boardElement');
  readonly board = signal(addMergeBug(addMergeBug(Array(16).fill(0))));
  readonly score = signal(0);
  readonly best = signal(this.loadBest());
  readonly moves = signal(0);
  readonly phase = signal<'playing' | 'won' | 'over'>('playing');
  readonly highest = computed(() => Math.max(...this.board()));
  readonly message = signal('Slide the garden. Two equal bugs become one bigger bug.');
  readonly colors = ['#f4a6cb', '#d9b4ef', '#aabcf5', '#92d4dc', '#9bd2b1', '#c7d58d', '#f2d080', '#f2b183', '#ed96ab', '#de91dd', '#b9a2ff', '#95dcdb'];
  readonly symbols = ['·', ':', '+', '✿', '★', '♥', '◇', '☀', '∞', '♛', '✦', '!'];
  readonly names = ['Tiny', 'Curious', 'Bouncy', 'Bloom', 'Star', 'Lovely', 'Crystal', 'Sunny', 'Cosmic', 'Royal', 'Legend', 'Epic'];
  private celebrated = false;
  private pointer: { x: number; y: number; id: number } | null = null;

  tier(value: number): number { return Math.min(this.names.length - 1, Math.max(0, Math.log2(value) - 1)); }
  move(direction: MergeDirection): void {
    if (this.phase() !== 'playing') return;
    const result = slideBugs(this.board(), direction);
    if (!result.changed) { this.message.set('No room in that direction. Try another way.'); return; }
    this.board.set(addMergeBug(result.board)); this.score.update(score => score + result.score); this.moves.update(moves => moves + 1);
    this.message.set(result.score ? `A little evolution! +${result.score} points.` : 'A fresh bug joins the garden.');
    if (this.score() > this.best()) { this.best.set(this.score()); try { localStorage.setItem('portfolio.merge.best', String(this.best())); } catch { /* Play without storage. */ } }
    if (this.highest() >= 2048 && !this.celebrated) { this.celebrated = true; this.phase.set('won'); this.message.set('The legendary 2048 bug! Your garden has evolved.'); }
    else if (!canMergeMove(this.board())) { this.phase.set('over'); this.message.set('The garden is full. A fresh start awaits!'); }
  }
  keepGoing(): void { this.phase.set(canMergeMove(this.board()) ? 'playing' : 'over'); }
  restart(): void { this.board.set(addMergeBug(addMergeBug(Array(16).fill(0)))); this.score.set(0); this.moves.set(0); this.phase.set('playing'); this.celebrated = false; this.message.set('A fresh garden. Let’s grow something wonderful.'); }
  keyboard(event: KeyboardEvent): void {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    const directions: Record<string, MergeDirection> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
    if (directions[event.key]) { event.preventDefault(); if (!event.repeat) this.move(directions[event.key]); }
  }
  pointerDown(event: PointerEvent): void { this.pointer = { x: event.clientX, y: event.clientY, id: event.pointerId }; this.boardElement()?.nativeElement.setPointerCapture?.(event.pointerId); }
  pointerUp(event: PointerEvent): void {
    const start = this.pointer; this.pointer = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    this.move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }
  cancelPointer(): void { this.pointer = null; }
  private loadBest(): number { try { const value = Number(localStorage.getItem('portfolio.merge.best')); return Number.isSafeInteger(value) && value >= 0 ? value : 0; } catch { return 0; } }
}
