import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugGame } from './bug-game';

@Component({ selector: 'app-blaster-page', imports: [RouterLink, BugGame], template: `<div class="game-page"><a class="back-link" routerLink="/games">← All games</a><app-bug-game /></div>` })
export class BlasterPage {}
