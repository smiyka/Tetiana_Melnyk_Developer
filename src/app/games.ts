import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugToken } from './bug-token';

@Component({
  selector: 'app-games', imports: [RouterLink, BugToken],
  template: `<div class="page"><header class="page-intro"><p class="eyebrow">THE ARCADE / NO LOGIN REQUIRED</p><h1>Pick your<br /><span>kind of bug.</span></h1><p class="intro">Fast reactions or a clever next move? Two small games, one very buggy universe.</p></header>
    <div class="games-grid">
      <a class="destination game-destination" routerLink="/games/bug-blaster"><div class="game-art"><app-bug-token /><span class="crosshair">⌖</span></div><span class="eyebrow">REACTION / SOLO / 30 SECONDS</span><h2>Bug Blaster</h2><p>Squash the bugs before they escape. Build combos and keep your application alive through three waves.</p><span class="card-link">Start blasting ↗</span></a>
      <a class="destination game-destination" routerLink="/games/tic-tac-toe"><div class="game-art"><app-bug-token /><span class="versus">VS</span><app-bug-token color="red" /></div><span class="eyebrow">STRATEGY / SOLO OR TWO PLAYERS</span><h2>Bug Tac Toe</h2><p>Green bugs versus red bugs. Claim three squares in a row to win. Challenge the computer or a friend.</p><span class="card-link">Make your move ↗</span></a>
    </div></div>`,
})
export class Games {}
