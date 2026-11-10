import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DeveloperLab } from './developer-lab';
import { LabProgress } from './progress';

describe('Developer Lab', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [DeveloperLab] });
  });
  afterEach(() => vi.restoreAllMocks());

  it('preserves earlier completion records while rejecting corrupt, duplicate and unknown entries', () => {
    localStorage.setItem('skillquest.progress.v1', 'not-json');
    expect(new LabProgress().completed()).toEqual([]);
    localStorage.setItem('skillquest.progress.v1', '["logic","logic","unknown"]');
    const progress = new LabProgress();
    expect(progress.completed()).toEqual(['logic']);
    progress.complete('logic'); progress.complete('search');
    expect(new LabProgress().completed()).toEqual(['logic', 'search']);
    progress.reset();
    expect(new LabProgress().completed()).toEqual([]);
  });

  it('requires two successful counter runs and demonstrates why the wrong fix fails', () => {
    const lab = TestBed.createComponent(DeveloperLab).componentInstance;
    lab.chooseFix('assign'); lab.runCounter(); lab.runCounter();
    expect(lab.counter()).toBe(1);
    expect(lab.progress.completed()).toEqual([]);
    expect(lab.feedbackError()).toBe(true);
    lab.chooseFix('decrement'); lab.runCounter(); lab.runCounter();
    expect(lab.counter()).toBe(-2);
    expect(lab.progress.completed()).toEqual([]);
    lab.chooseFix('increment'); lab.runCounter();
    expect(lab.progress.completed()).toEqual([]);
    lab.runCounter(); lab.runCounter();
    expect(lab.counter()).toBe(3);
    expect(lab.progress.completed()).toEqual(['logic']);
    expect(lab.feedbackError()).toBe(false);
  });

  it('requires a query and the correct result before completing the reactive search example', () => {
    const lab = TestBed.createComponent(DeveloperLab).componentInstance;
    lab.discover('RxJS');
    expect(lab.progress.completed()).toEqual([]);
    lab.query.set('  RX  ');
    expect(lab.filteredSkills()).toEqual(['RxJS']);
    lab.discover('Angular');
    expect(lab.progress.completed()).toEqual([]);
    lab.discover('RxJS');
    expect(lab.progress.completed()).toEqual(['search']);
    lab.query.set('no-such-skill');
    expect(lab.filteredSkills()).toEqual([]);
  });

  it('explains form errors, validates a demo brief and clears the success state when edited', () => {
    const fixture = TestBed.createComponent(DeveloperLab), lab = fixture.componentInstance;
    lab.select('form'); fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(root.querySelector('#project-name')?.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector('#name-error')?.textContent).toContain('3–60');
    expect(lab.progress.completed()).toEqual([]);
    lab.launchForm.setValue({ name: '   ', email: 'hello@example.com' }); lab.launch();
    expect(lab.formValidated()).toBe(false);
    lab.launchForm.setValue({ name: 'Customer portal', email: 'hello@example.com' }); lab.launch();
    fixture.detectChanges();
    expect(root.querySelector('.validated-result')).toBeTruthy();
    expect(lab.progress.completed()).toEqual(['form']);
    const input = root.querySelector<HTMLInputElement>('#project-name')!;
    input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelector('.validated-result')).toBeNull();
  });

  it('guides the visitor from a working counter to the next example and resets all examples', () => {
    const fixture = TestBed.createComponent(DeveloperLab), lab = fixture.componentInstance;
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector<HTMLButtonElement>('.action.primary')?.disabled).toBe(true);
    (root.querySelectorAll('.fix-options button')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    const run = root.querySelector<HTMLButtonElement>('.action.primary')!;
    run.click(); run.click(); fixture.detectChanges();
    expect(root.querySelector('.explanation')?.hasAttribute('open')).toBe(true);
    expect(root.querySelector('.example-footer')?.textContent).toContain('Next example');
    root.querySelector<HTMLButtonElement>('.example-footer button')!.click(); fixture.detectChanges();
    expect(root.querySelector('#skill-search')).toBeTruthy();
    expect(root.querySelector('.example-link[aria-current="step"]')?.textContent).toContain('Filter a skill catalog');
    lab.query.set('rx'); lab.discover('RxJS'); lab.next();
    lab.launchForm.setValue({ name: 'Demo project', email: 'hello@example.com' }); lab.launch();
    expect(lab.progress.completed()).toHaveLength(3);
    lab.reset(); fixture.detectChanges();
    expect(lab.index()).toBe(0);
    expect(lab.progress.completed()).toEqual([]);
    expect(lab.launchForm.controls.name.value).toBe('');
    expect(lab.query()).toBe('');
    expect(lab.fix()).toBeNull();
  });

  it('keeps the examples usable when the browser cannot save progress', () => {
    const lab = TestBed.createComponent(DeveloperLab).componentInstance;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    lab.chooseFix('increment'); lab.runCounter(); lab.runCounter();
    expect(lab.progress.completed()).toEqual(['logic']);
    expect(lab.progress.storageAvailable()).toBe(false);
  });
});
