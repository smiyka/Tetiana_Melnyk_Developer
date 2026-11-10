import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugToken } from './bug-token';

@Component({
  selector: 'app-home', imports: [RouterLink, BugToken],
  template: `<div class="page home-page">
    <section class="hero home-hero"><div><p class="eyebrow">TETIANA MELNYK / SOFTWARE DEVELOPER</p>
      <h1>Thoughtful interfaces.<br /><span>Solid foundations.</span></h1>
      <p class="intro">I build across Angular, TypeScript and .NET, from accessible interfaces to APIs and automated tests. Explore my professional experience, then try the interactive side of my portfolio.</p>
      <div class="cv-actions"><a class="button primary" routerLink="/cv">Explore my CV ↗</a><a class="button secondary" routerLink="/games">Enter the arcade ↗</a></div>
    </div><div class="home-art" aria-hidden="true"><span class="eyebrow">DEVELOP. DEBUG. REPEAT.</span><div><app-bug-token /><span class="versus">VS</span><app-bug-token color="red" /></div><span class="art-label">GOOD CODE. FRIENDLY COMPETITION.</span></div></section>
    <section aria-labelledby="explore-title"><p class="eyebrow">CHOOSE YOUR PATH</p><h2 id="explore-title">One space. Different adventures.</h2>
      <div class="destination-grid">
        <a class="destination" routerLink="/cv"><span class="destination-icon">&lt;/&gt;</span><span class="eyebrow">THE PERSON</span><h3>My CV</h3><p>Experience, skills, education and ways to get in touch. Just the professional story.</p><span class="card-link">Meet Tetiana ↗</span></a>
        <a class="destination" routerLink="/games"><span class="destination-icon">✦</span><span class="eyebrow">THE PLAYGROUND</span><h3>Games</h3><p>Bug Blaster for quick reactions. Bug Tac Toe for a little strategy. No login needed.</p><span class="card-link">Choose a game ↗</span></a>
        <a class="destination" routerLink="/missions"><span class="destination-icon">⌕</span><span class="eyebrow">THE LAB</span><h3>Missions</h3><p>Three interactive challenges in TypeScript, reactive search and form validation.</p><span class="card-link">Earn some XP ↗</span></a>
      </div>
    </section></div>`,
})
export class Home {}
