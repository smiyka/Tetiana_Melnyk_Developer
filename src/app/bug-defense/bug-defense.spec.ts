import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BugDefense, DEFENSE_PATH, DefenseEnemy, defensePosition, defenseStep } from './bug-defense';

describe('Bug Tower Defense', () => {
  beforeEach(() => { vi.useFakeTimers(); localStorage.removeItem('portfolio.defense.best'); TestBed.configureTestingModule({ imports: [BugDefense], providers: [provideRouter([])] }); });
  afterEach(() => { TestBed.resetTestingModule(); vi.useRealTimers(); localStorage.removeItem('portfolio.defense.best'); });
  const enemy = (extra: Partial<DefenseEnemy> = {}): DefenseEnemy => ({ id: 1, distance: 3, hp: 40, maxHp: 40, speed: 1, slow: 0, kind: 'normal', ...extra });
  it('interpolates continuous motion along corners of the fixed route', () => {
    expect(defensePosition(3.5)).toEqual({ x: 3.5, y: 1 });
    expect(defensePosition(9.5)).toEqual({ x: 9, y: 1.5 });
    expect(defensePosition(100)).toEqual(DEFENSE_PATH.at(-1));
  });
  it('shoots only in range, respects cooldowns and slows bugs without mutating inputs', () => {
    const enemies = [enemy()];
    const hit = defenseStep(enemies, [{ pad: 0, type: 2, level: 1, cooldown: 0 }], .1);
    expect(hit.enemies[0].hp).toBe(36); expect(hit.enemies[0].slow).toBe(2); expect(enemies[0].hp).toBe(40);
    const cooling = defenseStep(hit.enemies, hit.towers, .1); expect(cooling.shots).toHaveLength(0);
    expect(cooling.enemies[0].distance - hit.enemies[0].distance).toBeCloseTo(.05);
    expect(defenseStep([enemy({ distance: 20 })], [{ pad: 0, type: 0, level: 1, cooldown: 0 }], .1).shots).toHaveLength(0);
  });
  it('counts kills once and removes escaping enemies', () => {
    const result = defenseStep([enemy({ hp: 1 }), enemy({ id: 2, distance: DEFENSE_PATH.length - .01 })], [{ pad: 0, type: 0, level: 1, cooldown: 0 }, { pad: 1, type: 1, level: 1, cooldown: 0 }], .1);
    expect(result.kills).toBe(1); expect(result.leaks).toBe(1); expect(result.enemies).toHaveLength(0);
  });
  it('enforces build and upgrade costs and refunds only part of the investment', () => {
    const g = TestBed.createComponent(BugDefense).componentInstance;
    g.startWave(); expect(g.wave()).toBe(0);
    g.build(0); expect(g.coins()).toBe(85); g.build(0); expect(g.coins()).toBe(85);
    g.upgrade(); expect(g.coins()).toBe(50); expect(g.selectedTower()?.level).toBe(2);
    g.upgrade(); expect(g.selectedTower()?.level).toBe(2);
    g.sell(); expect(g.coins()).toBe(92); expect(g.towers()).toHaveLength(0);
    g.selectedType.set(1); g.build(1); g.build(2); expect(g.towers()).toHaveLength(1); expect(g.coins()).toBe(32);
  });
  it('pauses, resumes and cancels simulation timers when leaving', () => {
    const fixture = TestBed.createComponent(BugDefense), g = fixture.componentInstance;
    g.build(0); g.startWave(); vi.advanceTimersByTime(1000); expect(g.spawned()).toBeGreaterThan(0);
    g.blur(); const enemies = g.enemies(); vi.advanceTimersByTime(3000); expect(g.enemies()).toBe(enemies);
    g.togglePause(); vi.advanceTimersByTime(100); expect(g.enemies()).not.toBe(enemies);
    fixture.destroy(); const last = g.enemies(); vi.advanceTimersByTime(3000); expect(g.enemies()).toBe(last);
  });
  it('ends immediately when lives reach zero and resets all battle state', () => {
    const g = TestBed.createComponent(BugDefense).componentInstance;
    g.build(0); g.startWave(); g.lives.set(1);
    g.enemies.set([enemy({ distance: DEFENSE_PATH.length - .01 })]); g.tick(.1);
    expect(g.phase()).toBe('over'); expect(g.lives()).toBe(0);
    g.restart(); expect(g.phase()).toBe('build'); expect(g.coins()).toBe(120); expect(g.wave()).toBe(0); expect(g.enemies()).toHaveLength(0);
  });

  it('allows all eight waves to be won with earned coins and records the campaign', () => {
    const g = TestBed.createComponent(BugDefense).componentInstance;
    g.selectedType.set(1); g.build(2); g.selectedType.set(0); g.build(5);
    for (let ticks = 0; ticks < 12000 && g.phase() !== 'won' && g.phase() !== 'over'; ticks++) {
      if (g.phase() === 'build') {
        for (const pad of [4, 8, 1, 6, 7, 9, 3, 0]) { if (!g.towerAt(pad) && g.coins() >= 35) g.build(pad); }
        for (const tower of g.towers()) {
          g.selected.set(tower.pad);
          while (g.selectedTower()!.level < 3 && g.coins() >= g.upgradeCost(g.selectedTower()!)) g.upgrade();
        }
        g.startWave();
      }
      g.tick(.1);
    }
    expect(g.phase()).toBe('won'); expect(g.wave()).toBe(8); expect(g.lives()).toBeGreaterThan(0);
    expect(localStorage.getItem('portfolio.defense.best')).toBe('8');
  });
});
