import { TestBed } from '@angular/core/testing';
import { Missions } from './missions';
import { Progress } from './progress';

describe('Portfolio missions', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [Missions] }).compileComponents();
  });

  it('awards XP only once and restores progress', () => {
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

  it('ignores corrupt or unknown saved data', () => {
    localStorage.setItem('skillquest.progress.v1', 'not-json');
    expect(new Progress().completed()).toEqual([]);
    localStorage.setItem('skillquest.progress.v1', '["logic","logic","fake"]');
    expect(new Progress().completed()).toEqual(['logic']);
  });

  it('completes missions only with correct answers', () => {
    const app = TestBed.createComponent(Missions).componentInstance;
    app.solve(false);
    app.discover('RxJS');
    app.launch();
    expect(app.progress.xp()).toBe(0);
    app.solve(true);
    app.query.set('rx');
    expect(app.filteredSkills()).toEqual(['RxJS']);
    app.discover('RxJS');
    app.launchForm.setValue({ name: 'Demo mission', email: 'pilot@example.com' });
    app.launch();
    expect(app.progress.xp()).toBe(450);
  });

  it('shows missions and switches the playground using a button', () => {
    const fixture = TestBed.createComponent(Missions);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent).toContain('Small challenges.');
    (root.querySelectorAll('.mission-card')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(root.querySelector('#skill-search')).toBeTruthy();
  });
});
