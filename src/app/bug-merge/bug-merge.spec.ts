import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BugMerge, addMergeBug, canMergeMove, slideBugs } from './bug-merge';

describe('Bug Merge', () => {
  beforeEach(() => { localStorage.removeItem('portfolio.merge.best'); TestBed.configureTestingModule({ imports: [BugMerge], providers: [provideRouter([])] }); });
  afterEach(() => { TestBed.resetTestingModule(); vi.restoreAllMocks(); localStorage.removeItem('portfolio.merge.best'); });
  const row = (values: number[]) => [...values, ...Array(12).fill(0)];
  it('merges each bug once, awards the resulting values, and preserves its input', () => {
    const board = row([2, 2, 2, 2]); const result = slideBugs(board, 'left');
    expect(result.board.slice(0, 4)).toEqual([4, 4, 0, 0]); expect(result.score).toBe(8); expect(board.slice(0, 4)).toEqual([2, 2, 2, 2]);
    expect(slideBugs(row([2, 2, 4, 0]), 'left').board.slice(0, 4)).toEqual([4, 4, 0, 0]);
    expect(slideBugs(row([2, 0, 2, 4]), 'right').board.slice(0, 4)).toEqual([0, 0, 4, 4]);
  });
  it('slides and merges columns in both directions', () => {
    const board = Array(16).fill(0); board[0] = 8; board[8] = 8;
    expect(slideBugs(board, 'up').board[0]).toBe(16);
    expect(slideBugs(board, 'down').board[12]).toBe(16);
    expect(slideBugs(board, 'down').score).toBe(16);
  });
  it('recognizes a blocked garden and allows full gardens with matching neighbors', () => {
    const blocked = [2,4,2,4, 4,2,4,2, 2,4,2,4, 4,2,4,2];
    expect(canMergeMove(blocked)).toBe(false);
    const match = [...blocked]; match[0] = 4; expect(canMergeMove(match)).toBe(true);
    const free = [...blocked]; free[0] = 0; expect(canMergeMove(free)).toBe(true);
    expect(addMergeBug(blocked)).toEqual(blocked);
  });
  it('only spawns after valid moves and saves the best score', () => {
    const g = TestBed.createComponent(BugMerge).componentInstance; g.board.set(row([2, 0, 0, 0]));
    g.move('left'); expect(g.board()).toEqual(row([2, 0, 0, 0])); expect(g.moves()).toBe(0);
    g.board.set(row([2, 2, 0, 0])); g.move('left');
    expect(g.board().filter(Boolean)).toHaveLength(2); expect(g.score()).toBe(4); expect(localStorage.getItem('portfolio.merge.best')).toBe('4');
    g.restart(); expect(g.score()).toBe(0); expect(g.best()).toBe(4); expect(g.board().filter(Boolean)).toHaveLength(2);
  });
  it('celebrates 2048 once, supports continuing and responds to keyboard and swipes', () => {
    const g = TestBed.createComponent(BugMerge).componentInstance;
    g.board.set(row([1024, 1024, 0, 0])); g.keyboard(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(g.phase()).toBe('won'); expect(g.highest()).toBe(2048);
    g.keepGoing(); expect(g.phase()).toBe('playing');
    g.board.set(row([2, 0, 0, 0])); g.pointerDown({ pointerId: 1, clientX: 0, clientY: 0 } as PointerEvent);
    g.pointerUp({ pointerId: 1, clientX: 100, clientY: 0 } as PointerEvent);
    expect(g.board()[3]).toBe(2);
  });
});
