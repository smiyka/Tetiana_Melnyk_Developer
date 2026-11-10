import { Component, HostListener, OnDestroy, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugToken } from './bug-token';

export const DEFENSE_PATH = [
  ...Array.from({ length: 10 }, (_, x) => ({ x, y: 1 })),
  ...Array.from({ length: 3 }, (_, i) => ({ x: 9, y: i + 2 })),
  ...Array.from({ length: 7 }, (_, i) => ({ x: 8 - i, y: 4 })),
  { x: 2, y: 5 }, { x: 2, y: 6 },
  ...Array.from({ length: 9 }, (_, i) => ({ x: 3 + i, y: 6 })),
];
export const DEFENSE_PADS = [{ x: 3, y: 0 }, { x: 6, y: 0 }, { x: 8, y: 2 }, { x: 10, y: 3 }, { x: 6, y: 3 }, { x: 3, y: 3 }, { x: 1, y: 5 }, { x: 4, y: 7 }, { x: 7, y: 5 }, { x: 10, y: 7 }];
export const TOWER_TYPES = [
  { name: 'Sprayer', icon: '✳', cost: 35, damage: 9, range: 2.3, interval: .65, description: 'Quick shots. Great for busy corners.' },
  { name: 'Sniper', icon: '⌖', cost: 60, damage: 29, range: 3.6, interval: 1.6, description: 'Long range. Big hits for armored bugs.' },
  { name: 'Chiller', icon: '❄', cost: 45, damage: 4, range: 2.5, interval: 1, description: 'Slows bugs to half speed for two seconds.' },
];
export interface DefenseEnemy { id: number; distance: number; hp: number; maxHp: number; speed: number; slow: number; kind: 'normal' | 'runner' | 'armored' }
export interface DefenseTower { pad: number; type: number; level: number; cooldown: number }
export function defensePosition(distance: number) {
  const index = Math.max(0, Math.min(DEFENSE_PATH.length - 1, Math.floor(distance)));
  const a = DEFENSE_PATH[index], b = DEFENSE_PATH[Math.min(index + 1, DEFENSE_PATH.length - 1)];
  const fraction = Math.max(0, Math.min(1, distance - index));
  return { x: a.x + (b.x - a.x) * fraction, y: a.y + (b.y - a.y) * fraction };
}
export function defenseStep(enemies: DefenseEnemy[], towers: DefenseTower[], delta: number) {
  let leaks = 0, kills = 0;
  const shots: { x1: number; y1: number; x2: number; y2: number; type: number }[] = [];
  let remaining = enemies.map(enemy => ({ ...enemy, distance: enemy.distance + enemy.speed * (enemy.slow > 0 ? .5 : 1) * delta, slow: Math.max(0, enemy.slow - delta) })).filter(enemy => {
    if (enemy.distance >= DEFENSE_PATH.length) { leaks++; return false; } return true;
  });
  const updated = towers.map(tower => {
    const type = TOWER_TYPES[tower.type], pad = DEFENSE_PADS[tower.pad];
    const next = { ...tower, cooldown: Math.max(0, tower.cooldown - delta) };
    if (next.cooldown > 0) return next;
    const range = type.range + (tower.level - 1) * .3;
    const target = remaining.filter(enemy => { const p = defensePosition(enemy.distance); return Math.hypot(p.x - pad.x, p.y - pad.y) <= range; }).sort((a, b) => b.distance - a.distance)[0];
    if (!target) return next;
    target.hp -= type.damage * (1 + (tower.level - 1) * .65);
    if (tower.type === 2) target.slow = 2;
    const pos = defensePosition(target.distance);
    shots.push({ x1: (pad.x + .5) * 10, y1: (pad.y + .5) * 10, x2: (pos.x + .5) * 10, y2: (pos.y + .5) * 10, type: tower.type });
    if (target.hp <= 0) { remaining = remaining.filter(enemy => enemy.id !== target.id); kills++; }
    next.cooldown = type.interval / (1 + (tower.level - 1) * .15);
    return next;
  });
  return { enemies: remaining, towers: updated, shots, leaks, kills };
}

@Component({ selector: 'app-bug-defense', imports: [RouterLink, BugToken], templateUrl: './bug-defense.html', styleUrls: ['./arcade.scss', './bug-defense.scss'] })
export class BugDefense implements OnDestroy {
  readonly pads = DEFENSE_PADS; readonly types = TOWER_TYPES;
  readonly route = DEFENSE_PATH.map(p => `${(p.x + .5) * 10},${(p.y + .5) * 10}`).join(' ');
  readonly towers = signal<DefenseTower[]>([]); readonly enemies = signal<DefenseEnemy[]>([]);
  readonly shots = signal<ReturnType<typeof defenseStep>['shots']>([]);
  readonly selected = signal<number | null>(null); readonly selectedType = signal(0);
  readonly coins = signal(120); readonly lives = signal(10); readonly wave = signal(0); readonly kills = signal(0);
  readonly phase = signal<'build' | 'playing' | 'paused' | 'won' | 'over'>('build');
  readonly message = signal('Choose a tower, then a + pad. Build your defense before wave 1.');
  readonly best = signal(this.loadBest());
  readonly selectedTower = computed(() => this.towers().find(tower => tower.pad === this.selected()));
  readonly selectedPad = computed(() => this.selected() === null ? null : this.pads[this.selected()!]);
  readonly range = computed(() => { const tower = this.selectedTower(); return tower ? (this.types[tower.type].range + (tower.level - 1) * .3) * 10 : 0; });
  readonly quota = computed(() => 6 + this.wave() * 2);
  readonly spawned = signal(0);
  private spawnWait = 0; private nextId = 0;
  private timer?: ReturnType<typeof setInterval>; private lastTick = 0;

  towerAt(pad: number): DefenseTower | undefined { return this.towers().find(tower => tower.pad === pad); }
  position(enemy: DefenseEnemy) { return defensePosition(enemy.distance); }
  build(pad: number): void {
    if (this.phase() === 'paused' || this.phase() === 'won' || this.phase() === 'over') return;
    this.selected.set(pad);
    if (this.towerAt(pad)) { this.message.set('Tower selected. Upgrade it or sell it to change your plan.'); return; }
    const type = this.types[this.selectedType()];
    if (this.coins() < type.cost) { this.message.set(`You need ${type.cost} coins for a ${type.name}.`); return; }
    this.coins.update(coins => coins - type.cost);
    this.towers.update(towers => [...towers, { pad, type: this.selectedType(), level: 1, cooldown: 0 }]);
    this.message.set(`${type.name} ready. Select its pad to see its range.`);
  }
  upgradeCost(tower: DefenseTower): number { return this.types[tower.type].cost * tower.level; }
  upgrade(): void {
    const tower = this.selectedTower();
    if (!tower || tower.level >= 3 || this.coins() < this.upgradeCost(tower) || !['build', 'playing'].includes(this.phase())) return;
    this.coins.update(coins => coins - this.upgradeCost(tower));
    this.towers.update(towers => towers.map(t => t.pad === tower.pad ? { ...t, level: t.level + 1 } : t));
    this.message.set(`${this.types[tower.type].name} upgraded to level ${tower.level + 1}.`);
  }
  sellValue(tower: DefenseTower): number { return Math.floor(this.types[tower.type].cost * (1 + tower.level * (tower.level - 1) / 2) * .6); }
  sell(): void {
    const tower = this.selectedTower();
    if (!tower || !['build', 'playing'].includes(this.phase())) return;
    this.coins.update(coins => coins + this.sellValue(tower)); this.towers.update(towers => towers.filter(t => t.pad !== tower.pad)); this.selected.set(null);
    this.message.set('Tower sold. There’s room for a new plan.');
  }
  startWave(): void {
    if (this.phase() !== 'build') return;
    if (!this.towers().length) { this.message.set('Place at least one tower before sending the bugs.'); return; }
    this.wave.update(wave => wave + 1); this.spawned.set(0); this.spawnWait = 0;
    this.phase.set('playing'); this.message.set(`Wave ${this.wave()} incoming! You can still build and upgrade.`); this.runTimer();
  }
  tick(delta: number): void {
    if (this.phase() !== 'playing') return;
    this.spawnWait -= delta;
    if (this.spawned() < this.quota() && this.spawnWait <= 0) {
      const index = this.spawned(), kind = index % 5 === 4 ? 'armored' : index % 3 === 2 ? 'runner' : 'normal';
      const hp = (16 + this.wave() * 10) * (kind === 'armored' ? 2 : kind === 'runner' ? .7 : 1);
      this.enemies.update(enemies => [...enemies, { id: this.nextId++, distance: 0, hp, maxHp: hp, speed: (1.25 + this.wave() * .08) * (kind === 'runner' ? 1.6 : kind === 'armored' ? .8 : 1), slow: 0, kind }]);
      this.spawned.update(count => count + 1); this.spawnWait = Math.max(.5, 1 - this.wave() * .04);
    }
    const result = defenseStep(this.enemies(), this.towers(), delta);
    this.enemies.set(result.enemies); this.towers.set(result.towers); this.shots.set(result.shots);
    this.coins.update(coins => coins + result.kills * 8); this.kills.update(kills => kills + result.kills);
    this.lives.update(lives => Math.max(0, lives - result.leaks));
    if (!this.lives()) { this.finish('over'); return; }
    if (this.spawned() === this.quota() && !this.enemies().length) {
      this.stopTimer(); this.shots.set([]); this.coins.update(coins => coins + 25 + this.wave() * 3);
      if (this.wave() > this.best()) { this.best.set(this.wave()); try { localStorage.setItem('portfolio.defense.best', String(this.best())); } catch { /* Play without storage. */ } }
      if (this.wave() === 8) this.finish('won');
      else { this.phase.set('build'); this.message.set(`Wave ${this.wave()} cleared! Spend your bonus and prepare the next defense.`); }
    }
  }
  togglePause(): void { if (this.phase() === 'playing') { this.stopTimer(); this.shots.set([]); this.phase.set('paused'); } else if (this.phase() === 'paused') { this.phase.set('playing'); this.runTimer(); } }
  restart(): void { this.stopTimer(); this.towers.set([]); this.enemies.set([]); this.shots.set([]); this.selected.set(null); this.coins.set(120); this.lives.set(10); this.wave.set(0); this.kills.set(0); this.spawned.set(0); this.phase.set('build'); this.message.set('A fresh garden. Choose your towers and build your defense.'); }
  @HostListener('document:visibilitychange') hidden(): void { if (document.hidden && this.phase() === 'playing') this.togglePause(); }
  @HostListener('window:blur') blur(): void { if (this.phase() === 'playing') this.togglePause(); }
  ngOnDestroy(): void { this.stopTimer(); }
  private finish(phase: 'over' | 'won'): void { this.stopTimer(); this.shots.set([]); this.phase.set(phase); this.message.set(phase === 'won' ? 'All eight waves cleared. Your garden is bug-proof!' : 'The bugs reached the code. Time for a new strategy.'); }
  private runTimer(): void { this.lastTick = Date.now(); this.timer = setInterval(() => { const now = Date.now(); this.tick(Math.min(.25, (now - this.lastTick) / 1000)); this.lastTick = now; }, 100); }
  private stopTimer(): void { clearInterval(this.timer); this.timer = undefined; }
  private loadBest(): number { try { const value = Number(localStorage.getItem('portfolio.defense.best')); return Number.isInteger(value) && value >= 0 && value <= 8 ? value : 0; } catch { return 0; } }
}
