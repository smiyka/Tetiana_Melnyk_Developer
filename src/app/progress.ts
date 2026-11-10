import { computed, Injectable, signal } from '@angular/core';

export const MISSIONS = [
  {
    id: 'logic',
    title: 'Caccia al bug',
    skill: 'TypeScript · Logica',
    xp: 100,
    icon: '</>',
    description: 'Un contatore ha perso la strada. Trova la correzione.',
  },
  {
    id: 'search',
    title: 'Radar delle skill',
    skill: 'Angular · Stato reattivo',
    xp: 150,
    icon: '⌕',
    description: 'Esplora il catalogo e rintraccia la skill nascosta.',
  },
  {
    id: 'form',
    title: 'Pronti al lancio',
    skill: 'Form · Validazione',
    xp: 200,
    icon: '↗',
    description: 'Prepara una missione con dati validi e inviala.',
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
