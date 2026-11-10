import { Component, HostListener, OnDestroy, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugToken } from './bug-token';

export const MEMORY_BUGS = [
  { symbol: '★', name: 'Star', color: '#f4a6cb' }, { symbol: '♥', name: 'Heart', color: '#ff8b9a' },
  { symbol: '☀', name: 'Sun', color: '#f5ca77' }, { symbol: '◇', name: 'Diamond', color: '#b7a2ed' },
  { symbol: '+', name: 'Plus', color: '#80d2bb' }, { symbol: '≈', name: 'Wave', color: '#85c7ed' },
  { symbol: '@', name: 'At', color: '#e2b4f2' }, { symbol: '#', name: 'Hash', color: '#b4cf83' },
  { symbol: '∞', name: 'Infinity', color: '#f5b68a' }, { symbol: '☾', name: 'Moon', color: '#b0baff' },
  { symbol: '✿', name: 'Flower', color: '#eea4df' }, { symbol: '!', name: 'Surprise', color: '#8ed9df' },
];
export interface MemoryCard { id: number; bug: number }
export function createMemoryDeck(pairs: number): MemoryCard[] {
  const deck = Array.from({ length: pairs * 2 }, (_, id) => ({ id, bug: Math.floor(id / 2) }));
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  return deck;
}
interface MemoryRecord { seconds: number; moves: number }

@Component({ selector: 'app-bug-memory', imports: [RouterLink, BugToken], templateUrl: './bug-memory.html', styleUrls: ['./arcade.scss', './bug-memory.scss'] })
export class BugMemory implements OnDestroy {
  readonly bugs = MEMORY_BUGS;
  readonly levels = [{ pairs: 6, label: 'Easy · 12 cards' }, { pairs: 8, label: 'Classic · 16 cards' }, { pairs: 12, label: 'Expert · 24 cards' }];
  readonly pairs = signal(8);
  readonly cards = signal(createMemoryDeck(8));
  readonly opened = signal<number[]>([]);
  readonly matched = signal<number[]>([]);
  readonly moves = signal(0);
  readonly seconds = signal(0);
  readonly phase = signal<'ready' | 'playing' | 'paused' | 'won'>('ready');
  readonly best = signal<MemoryRecord | null>(this.loadBest(8));
  readonly clock = computed(() => `${Math.floor(this.seconds() / 60)}:${String(this.seconds() % 60).padStart(2, '0')}`);
  readonly message = signal('Flip any card to start. Find each bug’s twin!');
  private clockTimer?: ReturnType<typeof setInterval>;
  private flipTimer?: ReturnType<typeof setTimeout>;
  private flipDue = 0;
  private flipRemaining = 900;
  private startedAt = 0;
  private playedMs = 0;

  revealed(card: MemoryCard): boolean { return this.opened().includes(card.id) || this.matched().includes(card.bug); }
  flip(id: number): void {
    const card = this.cards().find(c => c.id === id);
    if (!card || this.phase() === 'paused' || this.phase() === 'won' || this.opened().length === 2 || this.revealed(card)) return;
    if (this.phase() === 'ready') { this.phase.set('playing'); this.runClock(); }
    this.opened.update(cards => [...cards, id]);
    if (this.opened().length !== 2) { this.message.set('Now find its twin.'); return; }
    this.moves.update(value => value + 1);
    const first = this.cards().find(c => c.id === this.opened()[0])!;
    if (first.bug === card.bug) {
      this.matched.update(bugs => [...bugs, card.bug]); this.opened.set([]);
      this.message.set(`${this.bugs[card.bug].name} bugs reunited!`);
      if (this.matched().length === this.pairs()) this.win();
    } else { this.message.set('Different bugs. Remember them for the next turn.'); this.scheduleFlip(900); }
  }

  newGame(pairs = this.pairs()): void {
    this.clearTimers(); this.pairs.set(pairs); this.cards.set(createMemoryDeck(pairs));
    this.opened.set([]); this.matched.set([]); this.moves.set(0); this.seconds.set(0);
    this.playedMs = 0; this.phase.set('ready'); this.best.set(this.loadBest(pairs));
    this.message.set('Flip any card to start. Find each bug’s twin!');
  }

  togglePause(): void {
    if (this.phase() === 'playing') {
      this.playedMs += Date.now() - this.startedAt; this.seconds.set(Math.floor(this.playedMs / 1000));
      if (this.flipTimer !== undefined) { this.flipRemaining = Math.max(0, this.flipDue - Date.now()); }
      this.clearTimers(); this.phase.set('paused'); this.message.set('Paused. The bugs are taking a little nap.');
    } else if (this.phase() === 'paused') {
      this.phase.set('playing'); this.runClock();
      if (this.opened().length === 2) this.scheduleFlip(this.flipRemaining);
      this.message.set('Welcome back. Find those twins!');
    }
  }

  @HostListener('document:visibilitychange') hidden(): void { if (document.hidden && this.phase() === 'playing') this.togglePause(); }
  @HostListener('window:blur') blur(): void { if (this.phase() === 'playing') this.togglePause(); }
  ngOnDestroy(): void { this.clearTimers(); }
  private runClock(): void { this.startedAt = Date.now(); this.clockTimer = setInterval(() => this.seconds.set(Math.floor((this.playedMs + Date.now() - this.startedAt) / 1000)), 250); }
  private scheduleFlip(delay: number): void { this.flipDue = Date.now() + delay; this.flipTimer = setTimeout(() => { this.opened.set([]); this.flipTimer = undefined; }, delay); }
  private clearTimers(): void { clearInterval(this.clockTimer); clearTimeout(this.flipTimer); this.clockTimer = undefined; this.flipTimer = undefined; }
  private win(): void {
    this.seconds.set(Math.floor((this.playedMs + Date.now() - this.startedAt) / 1000)); this.clearTimers(); this.phase.set('won');
    this.message.set(`All ${this.pairs()} pairs found in ${this.moves()} moves. Beautifully remembered!`);
    const best = this.best();
    if (!best || this.seconds() < best.seconds || (this.seconds() === best.seconds && this.moves() < best.moves)) {
      const record = { seconds: this.seconds(), moves: this.moves() }; this.best.set(record);
      try { localStorage.setItem(`portfolio.memory.${this.pairs()}`, JSON.stringify(record)); } catch { /* Play without storage. */ }
    }
  }
  private loadBest(pairs: number): MemoryRecord | null {
    try { const value = JSON.parse(localStorage.getItem(`portfolio.memory.${pairs}`) ?? 'null'); return value && Number.isSafeInteger(value.seconds) && value.seconds >= 0 && Number.isSafeInteger(value.moves) && value.moves >= pairs ? value : null; } catch { return null; }
  }
}
