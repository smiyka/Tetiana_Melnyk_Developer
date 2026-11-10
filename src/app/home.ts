import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home', imports: [RouterLink],
  template: `<div class="page home-page">
    <section class="hero home-hero"><div><p class="eyebrow">TETIANA MELNYK / SOFTWARE DEVELOPER</p>
      <h1>Thoughtful interfaces.<br /><span>Solid foundations.</span></h1>
      <p class="intro">I build across Angular, TypeScript and .NET, from accessible interfaces to APIs and automated tests. Explore my professional experience, then try the interactive side of my portfolio.</p>
      <div class="cv-actions"><a class="button primary" routerLink="/cv">Explore my CV ↗</a><a class="button secondary" routerLink="/lab">Explore the Developer Lab ↗</a></div>
    </div><aside class="developer-card" aria-label="Professional overview"><span class="eyebrow">CODE. COLLABORATION. CRAFT.</span><span class="developer-monogram" aria-hidden="true">TM<span>↗</span></span><h2>From interface<br />to implementation.</h2><p>Angular · TypeScript · .NET</p><div><span>3+ years of commercial experience</span><span>Milan, Italy · International teams</span></div></aside></section>
    <section aria-labelledby="explore-title"><p class="eyebrow">EXPLORE MY PORTFOLIO</p><h2 id="explore-title">Experience, examples and a little play.</h2>
      <div class="destination-grid">
        <a class="destination" routerLink="/cv"><span class="destination-icon">&lt;/&gt;</span><span class="eyebrow">THE PERSON</span><h3>My CV</h3><p>Experience, skills, education and ways to get in touch. Just the professional story.</p><span class="card-link">Meet Tetiana ↗</span></a>
        <a class="destination" routerLink="/lab"><span class="destination-icon">⌕</span><span class="eyebrow">HOW I BUILD</span><h3>Developer Lab</h3><p>Guided examples of debugging, reactive search and accessible form validation. Try the behavior and understand the approach.</p><span class="card-link">Explore the examples ↗</span></a>
        <a class="destination" routerLink="/games"><span class="destination-icon">✦</span><span class="eyebrow">A LITTLE PLAY</span><h3>Games</h3><p>Grow a hungry Bug Snake, test your reactions with Bug Blaster or plan your next move in Bug Tac Toe.</p><span class="card-link">Choose a game ↗</span></a>
      </div>
    </section></div>`,
})
export class Home {}
