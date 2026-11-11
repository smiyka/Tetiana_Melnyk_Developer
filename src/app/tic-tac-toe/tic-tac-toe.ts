import { Component, OnDestroy, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugToken } from '../bug-token/bug-token';

export type Player = 'green' | 'red';
export type Cell = Player | null;
const LINES = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
export function boardResult(board: readonly Cell[]) {
  const line = LINES.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  return { winner: line ? board[line[0]] : null, line: line ?? [], draw: !line && board.every(Boolean) };
}

function minimax(board: Cell[], player: Player, depth: number): number {
  const result = boardResult(board);
  if (result.winner) return result.winner === 'red' ? 10 - depth : depth - 10;
  if (result.draw) return 0;
  const values = board.flatMap((cell, slot) => {
    if (cell) return [];
    const next = [...board]; next[slot] = player;
    return [minimax(next, player === 'red' ? 'green' : 'red', depth + 1)];
  });
  return player === 'red' ? Math.max(...values) : Math.min(...values);
}

export function chooseComputerMove(board: readonly Cell[]): number {
  if (boardResult(board).winner || board.every(Boolean)) return -1;
  let best = -Infinity, choice = -1;
  for (const slot of [4,0,2,6,8,1,3,5,7]) {
    if (board[slot]) continue;
    const next = [...board]; next[slot] = 'red';
    const value = minimax(next, 'green', 0);
    if (value > best) { best = value; choice = slot; }
  }
  return choice;
}

@Component({
  selector: 'app-tic-tac-toe', imports: [RouterLink, BugToken],
  templateUrl: './tic-tac-toe.html', styleUrl: './tic-tac-toe.scss',
})
export class TicTacToe implements OnDestroy {
  readonly cells = signal<Cell[]>(Array(9).fill(null));
  readonly turn = signal<Player>('green');
  readonly mode = signal<'computer' | 'friend'>('computer');
  readonly scores = signal({ green: 0, red: 0, draws: 0 });
  readonly result = computed(() => boardResult(this.cells()));
  readonly finished = computed(() => !!this.result().winner || this.result().draw);
  readonly thinking = computed(() => this.mode() === 'computer' && this.turn() === 'red' && !this.finished());
  readonly status = computed(() => {
    if (this.result().winner) return this.result().winner === 'green' ? 'Green bugs win!' : 'Red bugs win!';
    if (this.result().draw) return 'A draw. The bugs are evenly matched.';
    if (this.thinking()) return 'Red bugs are planning their move…';
    return this.turn() === 'green' ? 'Green bugs, your move.' : 'Red bugs, your move.';
  });
  private starter: Player = 'green';
  private computerTimer?: ReturnType<typeof setTimeout>;

  move(slot: number): void {
    if (!Number.isInteger(slot) || slot < 0 || slot > 8 || this.cells()[slot] || this.finished() || this.thinking()) return;
    this.place(slot);
  }

  setMode(mode: 'computer' | 'friend'): void {
    if (mode === this.mode()) return;
    this.mode.set(mode);
    this.resetMatch();
  }

  nextRound(): void {
    this.starter = this.starter === 'green' ? 'red' : 'green';
    this.clearBoard();
  }

  restartRound(): void { this.clearBoard(); }

  resetMatch(): void {
    this.scores.set({ green: 0, red: 0, draws: 0 });
    this.starter = 'green';
    this.clearBoard();
  }

  keyboard(event: KeyboardEvent): void {
    if (!event.repeat && !event.ctrlKey && !event.altKey && !event.metaKey && /^[1-9]$/.test(event.key)) {
      event.preventDefault(); this.move(Number(event.key) - 1);
    }
  }

  ngOnDestroy(): void { this.cancelComputer(); }

  private place(slot: number): void {
    const player = this.turn();
    this.cells.update((cells) => cells.map((cell, index) => index === slot ? player : cell));
    const result = this.result();
    if (result.winner) this.scores.update((scores) => ({ ...scores, [player]: scores[player] + 1 }));
    else if (result.draw) this.scores.update((scores) => ({ ...scores, draws: scores.draws + 1 }));
    else { this.turn.set(player === 'green' ? 'red' : 'green'); this.scheduleComputer(); }
  }

  private clearBoard(): void {
    this.cancelComputer();
    this.cells.set(Array(9).fill(null));
    this.turn.set(this.starter);
    this.scheduleComputer();
  }

  private scheduleComputer(): void {
    if (!this.thinking()) return;
    this.computerTimer = setTimeout(() => {
      this.computerTimer = undefined;
      if (!this.thinking()) return;
      const slot = chooseComputerMove(this.cells());
      if (slot >= 0) this.place(slot);
    }, 450);
  }

  private cancelComputer(): void {
    if (this.computerTimer !== undefined) clearTimeout(this.computerTimer);
    this.computerTimer = undefined;
  }
}
