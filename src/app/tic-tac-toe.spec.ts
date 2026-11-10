import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Cell, TicTacToe, boardResult, chooseComputerMove } from './tic-tac-toe';

describe('Bug Tac Toe', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ imports: [TicTacToe], providers: [provideRouter([])] });
  });
  afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); });

  function createGame() { return TestBed.createComponent(TicTacToe).componentInstance; }

  it('recognizes every horizontal, vertical and diagonal winning line for both teams', () => {
    for (const line of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]) {
      for (const player of ['green', 'red'] as const) {
        const board: Cell[] = Array(9).fill(null);
        line.forEach(slot => board[slot] = player);
        expect(boardResult(board)).toEqual({ winner: player, line, draw: false });
      }
    }
  });

  it('alternates local players, prevents overwrites and scores a win only once', () => {
    const game = createGame(); game.setMode('friend');
    game.move(0); game.move(0);
    expect(game.turn()).toBe('red');
    expect(game.cells()[0]).toBe('green');
    [3,1,4,2].forEach(slot => game.move(slot));
    expect(game.result().winner).toBe('green');
    expect(game.scores().green).toBe(1);
    game.move(8);
    expect(game.cells()[8]).toBeNull();
    expect(game.scores().green).toBe(1);
    game.nextRound();
    expect(game.turn()).toBe('red');
    expect(game.cells().every(cell => !cell)).toBe(true);
    expect(game.scores().green).toBe(1);
  });

  it('scores red wins and full-board draws', () => {
    const game = createGame(); game.setMode('friend');
    [0,3,1,4,8,5].forEach(slot => game.move(slot));
    expect(game.result().winner).toBe('red');
    expect(game.scores().red).toBe(1);
    game.resetMatch();
    [0,1,2,4,3,5,7,6,8].forEach(slot => game.move(slot));
    expect(game.result().draw).toBe(true);
    expect(game.scores()).toEqual({ green: 0, red: 0, draws: 1 });
  });

  it('takes a winning move and blocks an immediate threat', () => {
    expect(chooseComputerMove(['red','red',null,'green','green',null,null,null,null])).toBe(2);
    expect(chooseComputerMove(['green','green',null,null,'red',null,null,null,null])).toBe(2);
  });

  it('never loses against any sequence of human moves, including when it starts', () => {
    function explore(board: Cell[]): void {
      const result = boardResult(board);
      expect(result.winner).not.toBe('green');
      if (result.winner || result.draw) return;
      board.forEach((cell, slot) => {
        if (cell) return;
        const next = [...board]; next[slot] = 'green';
        expect(boardResult(next).winner).not.toBe('green');
        if (boardResult(next).draw) return;
        const move = chooseComputerMove(next);
        expect(move).toBeGreaterThanOrEqual(0);
        expect(next[move]).toBeNull();
        next[move] = 'red';
        explore(next);
      });
    }
    explore(Array(9).fill(null));
    const board: Cell[] = Array(9).fill(null);
    board[chooseComputerMove(board)] = 'red';
    explore(board);
  });

  it('cancels a pending computer move on reset, mode change and destruction', () => {
    const fixture = TestBed.createComponent(TicTacToe);
    const game = fixture.componentInstance;
    game.move(0);
    expect(game.thinking()).toBe(true);
    game.move(1);
    expect(game.cells()[1]).toBeNull();
    game.resetMatch(); vi.advanceTimersByTime(500);
    expect(game.cells().every(cell => !cell)).toBe(true);
    game.move(0); game.setMode('friend'); vi.advanceTimersByTime(500);
    expect(game.cells().every(cell => !cell)).toBe(true);
    game.setMode('computer'); game.move(0);
    fixture.destroy(); vi.advanceTimersByTime(500);
    expect(game.cells().filter(Boolean)).toHaveLength(1);
  });

  it('responds as the computer and supports keyboard moves', () => {
    const game = createGame();
    game.keyboard(new KeyboardEvent('keydown', { key: '1' }));
    expect(game.cells()[0]).toBe('green');
    vi.advanceTimersByTime(450);
    expect(game.cells()[4]).toBe('red');
    expect(game.turn()).toBe('green');
    game.nextRound();
    expect(game.thinking()).toBe(true);
    vi.advanceTimersByTime(450);
    expect(game.cells().filter(cell => cell === 'red')).toHaveLength(1);
  });
});
