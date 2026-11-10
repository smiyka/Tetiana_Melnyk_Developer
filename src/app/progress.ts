import { computed, Injectable, signal } from '@angular/core';

export const MISSIONS = [
  {
    id: 'logic',
    title: 'Bug hunt',
    skill: 'TypeScript · Logic',
    xp: 100,
    icon: '</>',
    description: 'A counter has lost its way. Find the fix.',
  },
  {
    id: 'search',
    title: 'Skill radar',
    skill: 'Angular · Reactive state',
    xp: 150,
    icon: '⌕',
    description: 'Explore the catalog and track down the hidden skill.',
  },
  {
    id: 'form',
    title: 'Ready for launch',
    skill: 'Forms · Validation',
    xp: 200,
    icon: '↗',
    description: 'Prepare a mission with valid data and launch it.',
  },
] as const;
export type MissionId = (typeof MISSIONS)[number]['id'];
const KEY = 'skillquest.progress.v1';

@Injectable({ providedIn: 'root' })
export class Progress {
  readonly completed = signal<MissionId[]>(this.load());
  readonly xp = computed(() =>
    MISSIONS.filter((m) => this.completed().includes(m.id)).reduce((sum, m) => sum + m.xp, 0),
  );
  readonly level = computed(() => 1 + Math.floor(this.xp() / 150));
  readonly storageAvailable = signal(true);

  complete(id: MissionId): void {
    if (this.completed().includes(id)) return;
    this.completed.update((ids) => [...ids, id]);
    this.persist();
  }

  reset(): void {
    this.completed.set([]);
    this.persist();
  }

  private load(): MissionId[] {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      return Array.isArray(value)
        ? MISSIONS.filter((m) => value.includes(m.id)).map((m) => m.id)
        : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.completed()));
    } catch {
      this.storageAvailable.set(false);
    }
  }
}
