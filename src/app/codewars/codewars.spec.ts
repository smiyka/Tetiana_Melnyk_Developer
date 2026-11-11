import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Codewars } from './codewars';

describe('Live Codewars statistics', () => {
  const url = 'https://www.codewars.com/api/v1/users/smiyka';
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ imports: [Codewars], providers: [provideHttpClient(), provideHttpClientTesting()] });
  });
  afterEach(() => { TestBed.inject(HttpTestingController).verify(); TestBed.resetTestingModule(); vi.useRealTimers(); });

  it('reads the count on opening and refreshes it without hardcoded totals', () => {
    const fixture = TestBed.createComponent(Codewars);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(url).flush({ codeChallenges: { totalCompleted: 30 }, honor: 165, ranks: { overall: { name: '6 kyu' }, languages: { javascript: { name: '6 kyu' }, rust: { name: '7 kyu' }, typescript: { name: '8 kyu' } } } });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('strong').textContent).toBe('30');
    expect(fixture.componentInstance.honor()).toBe(165);
    expect(fixture.componentInstance.rank()).toBe('6 kyu');
    expect(fixture.componentInstance.languages()).toEqual([{ name: 'JavaScript', rank: '6 kyu' }, { name: 'Rust', rank: '7 kyu' }, { name: 'TypeScript', rank: '8 kyu' }]);
    expect(fixture.nativeElement.querySelector('a').href).toBe('https://www.codewars.com/users/smiyka');
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    vi.advanceTimersByTime(60000);
    http.expectOne(url).flush({ codeChallenges: { totalCompleted: 31 } });
    expect(fixture.componentInstance.count()).toBe(31);
    fixture.destroy(); vi.advanceTimersByTime(60000);
    http.expectNone(url); vi.restoreAllMocks();
  });

  it('handles failures and retries without presenting a made-up count', () => {
    const fixture = TestBed.createComponent(Codewars);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(url).flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    expect(fixture.componentInstance.failed()).toBe(true);
    expect(fixture.componentInstance.count()).toBeNull();
    fixture.componentInstance.refresh();
    http.expectOne(url).flush({ codeChallenges: { totalCompleted: 0 } });
    expect(fixture.componentInstance.count()).toBe(0);
    expect(fixture.componentInstance.failed()).toBe(false);
  });

  it('rejects malformed totals and cancels pending requests when leaving the CV', () => {
    const fixture = TestBed.createComponent(Codewars);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(url).flush({ codeChallenges: { totalCompleted: -1 } });
    expect(fixture.componentInstance.failed()).toBe(true);
    fixture.componentInstance.refresh();
    const pending = http.expectOne(url);
    fixture.destroy();
    expect(pending.cancelled).toBe(true);
  });
});
