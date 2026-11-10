import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BugMemory, createMemoryDeck } from './bug-memory';

describe('Bug Memory', () => {
  beforeEach(() => { vi.useFakeTimers(); [6, 8, 12].forEach(n => localStorage.removeItem(`portfolio.memory.${n}`)); TestBed.configureTestingModule({ imports: [BugMemory], providers: [provideRouter([])] }); });
  afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); [6, 8, 12].forEach(n => localStorage.removeItem(`portfolio.memory.${n}`)); });
  function game() { return TestBed.createComponent(BugMemory).componentInstance; }

  it('creates exactly two of each bug with unique card IDs at every difficulty', () => {
    for (const pairs of [6, 8, 12]) { const cards = createMemoryDeck(pairs); expect(new Set(cards.map(c => c.id)).size).toBe(pairs * 2); for (let bug = 0; bug < pairs; bug++) expect(cards.filter(c => c.bug === bug)).toHaveLength(2); }
  });
  it('counts pairs as moves and ignores repeated flips and matched cards', () => {
    const g = game(), twins = g.cards().filter(c => c.bug === 0);
    g.flip(twins[0].id); g.flip(twins[0].id); expect(g.moves()).toBe(0);
    g.flip(twins[1].id); expect(g.moves()).toBe(1); expect(g.matched()).toEqual([0]);
    g.flip(twins[0].id); expect(g.opened()).toEqual([]);
  });
  it('locks a mismatched pair briefly and cancels old flips on restart', () => {
    const g = game(), first = g.cards().find(c => c.bug === 0)!, second = g.cards().find(c => c.bug === 1)!, third = g.cards().find(c => c.bug === 2)!;
    g.flip(first.id); g.flip(second.id); g.flip(third.id); expect(g.opened()).toEqual([first.id, second.id]);
    vi.advanceTimersByTime(900); expect(g.opened()).toEqual([]);
    g.flip(first.id); g.flip(second.id); g.newGame(6);
    const newCard = g.cards()[0]; g.flip(newCard.id); vi.advanceTimersByTime(900);
    expect(g.opened()).toEqual([newCard.id]); expect(g.pairs()).toBe(6);
  });
  it('pauses time and mismatch resolution and cleans up when leaving', () => {
    const fixture = TestBed.createComponent(BugMemory), g = fixture.componentInstance;
    g.flip(g.cards().find(c => c.bug === 0)!.id); g.flip(g.cards().find(c => c.bug === 1)!.id);
    vi.advanceTimersByTime(300); g.togglePause(); vi.advanceTimersByTime(5000);
    expect(g.opened()).toHaveLength(2); expect(g.seconds()).toBe(0);
    g.togglePause(); vi.advanceTimersByTime(599); expect(g.opened()).toHaveLength(2);
    vi.advanceTimersByTime(1); expect(g.opened()).toHaveLength(0);
    vi.advanceTimersByTime(1000); expect(g.seconds()).toBe(1);
    fixture.destroy(); const seconds = g.seconds(); vi.advanceTimersByTime(3000); expect(g.seconds()).toBe(seconds);
  });
  it('finishes, saves a separate record per difficulty, and stops the clock', () => {
    const g = game(); g.newGame(6);
    for (let bug = 0; bug < 6; bug++) { const cards = g.cards().filter(c => c.bug === bug); cards.forEach(c => g.flip(c.id)); vi.advanceTimersByTime(1000); }
    expect(g.phase()).toBe('won'); expect(g.moves()).toBe(6); expect(g.best()?.seconds).toBe(5);
    expect(JSON.parse(localStorage.getItem('portfolio.memory.6')!).moves).toBe(6);
    vi.advanceTimersByTime(5000); expect(g.seconds()).toBe(5);
    g.newGame(12); expect(g.best()).toBeNull();
  });
  it('does not reveal identities in face-down accessible labels', () => {
    const fixture = TestBed.createComponent(BugMemory); fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.memory-card') as NodeListOf<HTMLButtonElement>;
    expect(cards).toHaveLength(16); expect(cards[0].getAttribute('aria-label')).toBe('Card 1, face down');
    cards[0].click(); fixture.detectChanges(); expect(cards[0].getAttribute('aria-label')).toContain('bug, face up');
  });
});
