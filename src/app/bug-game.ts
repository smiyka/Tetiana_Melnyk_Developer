import { Component, ElementRef, HostListener, OnDestroy, computed, signal, viewChild } from '@angular/core';

type Phase = 'ready' | 'playing' | 'paused' | 'over';
interface Bug { slot: number; name: string; born: number; expires: number }
const DURATION = 30_000;
const RECORD_KEY = 'skillquest.bug-blaster.best.v1';

@Component({
  selector: 'app-bug-game',
  templateUrl: './bug-game.html',
  styleUrl: './bug-game.scss',
})
export class BugGame implements OnDestroy {
  readonly slots = Array.from({ length: 9 }, (_, i) => i);
  readonly phase = signal<Phase>('ready');
  readonly bugs = signal<Bug[]>([]);
  readonly elapsed = signal(0);
  readonly score = signal(0);
  readonly kills = signal(0);
  readonly combo = signal(0);
  readonly health = signal(5);
  readonly best = signal(this.loadBest());
  readonly message = signal('The build is quiet. Suspiciously quiet.');
  readonly blast = signal<{ slot: number; points: number; until: number } | null>(null);
  readonly seconds = computed(() => Math.ceil((DURATION - this.elapsed()) / 1000));
  readonly multiplier = computed(() => Math.min(4, 1 + Math.floor(this.combo() / 5)));
  readonly wave = computed(() => Math.min(3, 1 + Math.floor(this.elapsed() / 10_000)));
  readonly board = viewChild<ElementRef<HTMLElement>>('board');
  private timer?: ReturnType<typeof setInterval>;
  private lastTick = 0;
  private nextSpawn = 0;

  bugAt(slot: number): Bug | undefined { return this.bugs().find((bug) => bug.slot === slot); }

  start(): void {
    this.stopTimer();
    this.elapsed.set(0);
    this.score.set(0);
    this.kills.set(0);
    this.combo.set(0);
    this.health.set(5);
    this.bugs.set([]);
    this.blast.set(null);
    this.nextSpawn = 0;
    this.phase.set('playing');
    this.message.set('Incoming bugs! Protect the build.');
    this.advance(0);
    this.runTimer();
    this.board()?.nativeElement.focus();
  }

  togglePause(): void {
    if (this.phase() === 'playing') {
      this.phase.set('paused');
      this.stopTimer();
      this.message.set('Paused. Your build can wait.');
    } else if (this.phase() === 'paused') {
      this.phase.set('playing');
      this.message.set('Back in action. Go get those bugs!');
      this.runTimer();
      this.board()?.nativeElement.focus();
    }
  }

  hit(slot: number): void {
    if (this.phase() !== 'playing') return;
    const target = this.bugAt(slot);
    // Resolve real time before accepting input, including delayed browser timers.
    this.synchronize();
    if (this.phase() !== 'playing') return;
    const bug = this.bugs().find((candidate) => candidate.slot === slot);
    if (target !== bug) return;
    if (!bug) {
      this.combo.set(0);
      this.message.set('Empty slot! Combo reset. Aim for a bug.');
      return;
    }
    const points = 10 * this.multiplier();
    this.bugs.update((bugs) => bugs.filter((candidate) => candidate.slot !== slot));
    this.score.update((value) => value + points);
    this.kills.update((value) => value + 1);
    this.combo.update((value) => value + 1);
    this.blast.set({ slot, points, until: this.elapsed() + 450 });
    this.message.set(`${bug.name} squashed! +${points} points.`);
  }

  keyboard(event: KeyboardEvent): void {
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    if (/^[1-9]$/.test(event.key) && this.phase() === 'playing') {
      event.preventDefault();
      this.hit(Number(event.key) - 1);
    } else if (event.key.toLowerCase() === 'p' || event.key === 'Escape') {
      if (this.phase() === 'playing' || this.phase() === 'paused') {
        event.preventDefault();
        this.togglePause();
      }
    }
  }

  @HostListener('document:visibilitychange')
  visibilityChanged(): void {
    if (document.hidden && this.phase() === 'playing') this.togglePause();
  }

  @HostListener('window:blur')
  windowBlurred(): void {
    if (this.phase() === 'playing') this.togglePause();
  }

  ngOnDestroy(): void { this.stopTimer(); }

  private runTimer(): void {
    this.lastTick = performance.now();
    this.timer = setInterval(() => this.synchronize(), 100);
  }

  private synchronize(): void {
    const now = performance.now();
    const delta = now - this.lastTick;
    this.lastTick = now;
    this.advance(delta);
  }

  private advance(delta: number): void {
    if (this.phase() !== 'playing') return;
    this.elapsed.update((value) => Math.min(DURATION, value + delta));
    if (this.elapsed() >= DURATION) { this.finish(); return; }
    const expired = this.bugs().filter((bug) => bug.expires <= this.elapsed());
    if (expired.length) {
      this.bugs.update((bugs) => bugs.filter((bug) => bug.expires > this.elapsed()));
      this.health.update((value) => Math.max(0, value - expired.length));
      this.combo.set(0);
      this.message.set('A bug escaped! Your build lost stability.');
      if (!this.health()) { this.finish(); return; }
    }
    if (this.blast() && this.blast()!.until <= this.elapsed()) this.blast.set(null);
    if (this.elapsed() >= this.nextSpawn) {
      const free = this.slots.filter((slot) => !this.bugs().some((bug) => bug.slot === slot));
      if (free.length) {
        const slot = free[Math.floor(Math.random() * free.length)];
        const names = ['Null pointer', 'Memory leak', 'Race condition', 'Off-by-one', 'Infinite loop'];
        const lifetime = 3000 - (this.wave() - 1) * 350;
        this.bugs.update((bugs) => [...bugs, {
          slot, name: names[Math.floor(Math.random() * names.length)],
          born: this.elapsed(), expires: this.elapsed() + lifetime,
        }]);
      }
      this.nextSpawn = this.elapsed() + 950 - (this.wave() - 1) * 180;
    }
  }

  private finish(): void {
    this.phase.set('over');
    this.stopTimer();
    this.bugs.set([]);
    this.blast.set(null);
    this.message.set(this.health() ? 'Build saved. Nicely debugged!' : 'Build crashed. The bugs won this round.');
    if (this.score() > this.best()) {
      this.best.set(this.score());
      try { localStorage.setItem(RECORD_KEY, String(this.score())); } catch { /* Play without storage. */ }
    }
  }

  private loadBest(): number {
    try {
      const score = Number(localStorage.getItem(RECORD_KEY));
      return Number.isSafeInteger(score) && score >= 0 && score <= 1_000_000 ? score : 0;
    } catch { return 0; }
  }

  private stopTimer(): void {
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
  }
}
