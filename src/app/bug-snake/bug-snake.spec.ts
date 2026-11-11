import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BugSnake, Point, spawnFood, stepSnake } from './bug-snake';

describe('Bug Snake', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.removeItem('portfolio.bug-snake.best');
    TestBed.configureTestingModule({ imports: [BugSnake], providers: [provideRouter([])] });
  });
  afterEach(() => { TestBed.resetTestingModule(); localStorage.removeItem('portfolio.bug-snake.best'); vi.useRealTimers(); });

  it('grows exactly one segment when eating and keeps its length otherwise', () => {
    const body = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
    const eating = stepSnake(body, 'right', { x: 6, y: 5 });
    expect(eating.ate).toBe(true);
    expect(eating.body).toHaveLength(4);
    expect(eating.body.at(-1)).toEqual(body.at(-1));
    const moving = stepSnake(body, 'up', { x: 6, y: 5 });
    expect(moving.body).toHaveLength(3);
    expect(moving.body[0]).toEqual({ x: 5, y: 4 });
  });

  it('detects walls and body collisions but allows the departing tail cell', () => {
    expect(stepSnake([{ x: 19, y: 5 }], 'right', { x: 10, y: 10 }).collision).toBe(true);
    const body = [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 2 }];
    expect(stepSnake(body, 'down', { x: 10, y: 10 }).collision).toBe(true);
    expect(stepSnake(body, 'left', { x: 10, y: 10 }).collision).toBe(false);
  });

  it('only spawns food on free cells and handles a full garden', () => {
    const full: Point[] = Array.from({ length: 400 }, (_, i) => ({ x: i % 20, y: Math.floor(i / 20) }));
    expect(spawnFood(full)).toBeNull();
    expect(spawnFood(full.slice(1))).toEqual({ x: 0, y: 0 });
  });

  it('rejects reversals including rapid queued turns and accepts arrow keys', () => {
    const game = TestBed.createComponent(BugSnake).componentInstance;
    game.start(); game.food.set({ x: 19, y: 19 });
    game.turn('left'); game.tick();
    expect(game.body()[0]).toEqual({ x: 6, y: 10 });
    game.keyboard(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    game.turn('down'); game.turn('left');
    game.tick(); expect(game.body()[0]).toEqual({ x: 6, y: 9 });
    game.tick(); expect(game.body()[0]).toEqual({ x: 5, y: 9 });
  });

  it('pauses movement and survival time, resumes and cleans up on navigation', () => {
    const fixture = TestBed.createComponent(BugSnake), game = fixture.componentInstance;
    game.start(); game.food.set({ x: 19, y: 19 });
    vi.advanceTimersByTime(1050);
    game.togglePause();
    const body = game.body();
    vi.advanceTimersByTime(10000);
    expect(game.body()).toBe(body); expect(game.elapsed()).toBe(1);
    game.togglePause(); vi.advanceTimersByTime(150);
    expect(game.body()).not.toBe(body); expect(game.elapsed()).toBe(1);
    game.blur(); expect(game.phase()).toBe('paused');
    game.togglePause(); fixture.destroy();
    const last = game.body(); vi.advanceTimersByTime(1000);
    expect(game.body()).toBe(last);
  });

  it('ends on collision, saves the best length and resets a new run', () => {
    const game = TestBed.createComponent(BugSnake).componentInstance;
    game.start(); game.food.set({ x: 6, y: 10 }); game.tick();
    expect(game.best()).toBe(4);
    expect(localStorage.getItem('portfolio.bug-snake.best')).toBe('4');
    game.body.set([{ x: 19, y: 0 }, { x: 18, y: 0 }]); game.tick();
    expect(game.phase()).toBe('over');
    game.start(); expect(game.body()).toHaveLength(3); expect(game.elapsed()).toBe(0); expect(game.best()).toBe(4);
  });

  it('steers toward the pointer on the board', () => {
    const fixture = TestBed.createComponent(BugSnake);
    fixture.detectChanges();
    const game = fixture.componentInstance;
    vi.spyOn(game.board()!.nativeElement, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 400, height: 400 } as DOMRect);
    game.start(); game.food.set({ x: 19, y: 19 });
    game.point({ clientX: 110, clientY: 10, type: 'pointermove', pointerType: 'mouse' } as PointerEvent);
    game.tick(); expect(game.body()[0]).toEqual({ x: 5, y: 9 });
  });
});
