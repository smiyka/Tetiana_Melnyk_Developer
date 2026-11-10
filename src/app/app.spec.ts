import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Progress } from './progress';

describe('SkillQuest', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('assegna XP una sola volta e ripristina i progressi', () => {
    const progress = new Progress();
    progress.complete('logic');
    progress.complete('logic');
    expect(progress.xp()).toBe(100);
    expect(new Progress().completed()).toEqual(['logic']);
    progress.complete('search');
    progress.complete('form');
    expect(progress.xp()).toBe(450);
    progress.reset();
    expect(new Progress().completed()).toEqual([]);
  });

  it('ignora dati salvati corrotti o sconosciuti', () => {
    localStorage.setItem('skillquest.progress.v1', 'not-json');
    expect(new Progress().completed()).toEqual([]);
    localStorage.setItem('skillquest.progress.v1', '["logic","logic","fake"]');
    expect(new Progress().completed()).toEqual(['logic']);
  });

  it('completa le missioni solo con le risposte corrette', () => {
    const app = TestBed.createComponent(App).componentInstance;
    app.solve(false);
    app.discover('RxJS');
    app.launch();
    expect(app.progress.xp()).toBe(0);
    app.solve(true);
    app.query.set('rx');
    expect(app.filteredSkills()).toEqual(['RxJS']);
    app.discover('RxJS');
    app.launchForm.setValue({ name: 'Demo missione', email: 'pilota@example.com' });
    app.launch();
    expect(app.progress.xp()).toBe(450);
  });

  it('mostra le missioni e cambia playground dal pulsante', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent).toContain('Le skill si vedono.');
    (root.querySelectorAll('.mission-card')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(root.querySelector('#skill-search')).toBeTruthy();
  });
});
