import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BugGame } from './bug-game';

describe('Bug Blaster', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'performance'] });
    vi.spyOn(Math, 'random').mockReturnValue(0);
    TestBed.configureTestingModule({ imports: [BugGame] });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function createGame() { return TestBed.createComponent(BugGame).componentInstance; }

  it('scores each bug once and resets the combo on an empty hit', () => {
    const game = createGame();
    game.start();
    game.hit(0);
    expect(game.score()).toBe(10);
    expect(game.kills()).toBe(1);
    game.hit(0);
    expect(game.score()).toBe(10);
    expect(game.combo()).toBe(0);
  });

  it('increases the multiplier and saves the record after a full round', () => {
    const game = createGame();
    game.start();
    for (let i = 0; i < 300; i++) {
      for (const bug of game.bugs()) game.hit(bug.slot);
      vi.advanceTimersByTime(100);
    }
    expect(game.phase()).toBe('over');
    expect(game.health()).toBe(5);
    expect(game.seconds()).toBe(0);
    expect(game.wave()).toBe(3);
    expect(game.score()).toBeGreaterThan(game.kills() * 10);
    expect(game.best()).toBe(game.score());
    expect(localStorage.getItem('skillquest.bug-blaster.best.v1')).toBe(String(game.score()));
    const score = game.score();
    game.hit(0);
    vi.advanceTimersByTime(5000);
    expect(game.score()).toBe(score);
    expect(game.bugs()).toEqual([]);
  });

  it('freezes time and input while paused and resumes without charging paused time', () => {
    const game = createGame();
    game.start();
    vi.advanceTimersByTime(500);
    game.togglePause();
    const elapsed = game.elapsed();
    vi.advanceTimersByTime(5000);
    game.hit(0);
    expect(game.elapsed()).toBe(elapsed);
    expect(game.score()).toBe(0);
    game.togglePause();
    vi.advanceTimersByTime(100);
    expect(game.elapsed()).toBe(elapsed + 100);
    game.hit(0);
    expect(game.score()).toBe(10);
  });

  it('ends on five escaped bugs and starts a clean new round', () => {
    const game = createGame();
    game.start();
    vi.advanceTimersByTime(10_000);
    expect(game.phase()).toBe('over');
    expect(game.health()).toBe(0);
    expect(game.seconds()).toBeGreaterThan(0);
    game.start();
    expect(game.health()).toBe(5);
    expect(game.seconds()).toBe(30);
    expect(game.bugs()).toHaveLength(1);
    expect(game.score()).toBe(0);
  });

  it('does not score an expired target when the browser delays timer callbacks', () => {
    const game = createGame();
    game.start();
    vi.spyOn(performance, 'now').mockReturnValue(4000);
    game.hit(0);
    expect(game.health()).toBe(4);
    expect(game.score()).toBe(0);
    expect(game.kills()).toBe(0);
  });

  it('supports keyboard input and pauses when the window loses focus', () => {
    const fixture = TestBed.createComponent(BugGame);
    fixture.detectChanges();
    const game = fixture.componentInstance;
    game.start();
    fixture.detectChanges();
    const board = fixture.nativeElement.querySelector('.arena') as HTMLElement;
    board.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
    expect(game.kills()).toBe(1);
    window.dispatchEvent(new Event('blur'));
    expect(game.phase()).toBe('paused');
    game.togglePause();
    const elapsed = game.elapsed();
    fixture.destroy();
    vi.advanceTimersByTime(1000);
    expect(game.elapsed()).toBe(elapsed);
  });

  it('works when local storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const game = createGame();
    game.start();
    game.hit(0);
    vi.advanceTimersByTime(10_000);
    expect(game.phase()).toBe('over');
    expect(game.best()).toBe(10);
  });
});
