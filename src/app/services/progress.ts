import { Injectable, signal } from '@angular/core';

export const LAB_EXAMPLE_IDS = ['logic', 'search', 'form'] as const;
export type ExampleId = (typeof LAB_EXAMPLE_IDS)[number];
// Preserve completion data saved by earlier versions of the portfolio.
const KEY = 'skillquest.progress.v1';

@Injectable({ providedIn: 'root' })
export class LabProgress {
  readonly completed = signal<ExampleId[]>(this.load());
  readonly storageAvailable = signal(true);

  complete(id: ExampleId): void {
    if (this.completed().includes(id)) return;
    this.completed.update(ids => [...ids, id]);
    this.persist();
  }

  reset(): void { this.completed.set([]); this.persist(); }

  private load(): ExampleId[] {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      return Array.isArray(value) ? LAB_EXAMPLE_IDS.filter(id => value.includes(id)) : [];
    } catch { return []; }
  }

  private persist(): void {
    try { localStorage.setItem(KEY, JSON.stringify(this.completed())); }
    catch { this.storageAvailable.set(false); }
  }
}
