import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-codewars',
  templateUrl: './codewars.html',
  styles: `:host { display: block; margin: 10px 0 48px; }.codewars-card { display: grid; grid-template-columns: 1fr 230px; gap: 28px; align-items: center; padding: 30px; border: 1px solid var(--accent-border); border-radius: 22px; background: var(--panel); box-shadow: var(--shadow); }h2 { font-size: 27px; line-height: 1.2; }p:not(.eyebrow) { color: var(--muted); font-size: 13px; line-height: 1.8; }.kata-stat { display: flex; flex-direction: column; gap: 8px; padding-left: 28px; border-left: 1px solid var(--line); }.kata-stat strong { color: var(--lime); font: 700 48px var(--mono); }.kata-stat span { font-size: 13px; }.kata-stat small { color: var(--muted); font-size: 10px; line-height: 1.7; }button { align-self: start; cursor: pointer; color: var(--lime); background: var(--accent-soft); border: 1px solid var(--accent-border); border-radius: 8px; min-height: 44px; padding: 8px 14px; margin-top: 6px; }button:disabled { opacity: .6; cursor: default; }@media(max-width: 600px) { .codewars-card { grid-template-columns: 1fr; padding: 24px; }.kata-stat { border-left: 0; border-top: 1px solid var(--line); padding: 20px 0 0; }}@media print { button, small { display: none; } }`,
})
export class Codewars implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  readonly count = signal<number | null>(null);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly updated = signal(false);
  readonly rank = signal<string | null>(null);
  readonly honor = signal<number | null>(null);
  readonly languages = signal<{ name: string; rank: string }[]>([]);

  ngOnInit(): void {
    this.refresh();
    const timer = setInterval(() => { if (!document.hidden) this.refresh(); }, 60_000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  refresh(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.http.get<{ codeChallenges?: { totalCompleted?: number }; honor?: number; ranks?: { overall?: { name?: string }; languages?: Record<string, { name?: string }> } }>('https://www.codewars.com/api/v1/users/smiyka', { timeout: 8000 })
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: data => {
          const total = data.codeChallenges?.totalCompleted;
          if (typeof total === 'number' && Number.isSafeInteger(total) && total >= 0) {
            this.count.set(total); this.failed.set(false); this.updated.set(true);
            this.rank.set(typeof data.ranks?.overall?.name === 'string' ? data.ranks.overall.name : null);
            this.honor.set(typeof data.honor === 'number' && Number.isSafeInteger(data.honor) && data.honor >= 0 ? data.honor : null);
            const names: Record<string, string> = { javascript: 'JavaScript', typescript: 'TypeScript', rust: 'Rust', python: 'Python', csharp: 'C#', cpp: 'C++' };
            this.languages.set(Object.entries(data.ranks?.languages ?? {}).flatMap(([name, rank]) => typeof rank?.name === 'string' ? [{ name: names[name] ?? name, rank: rank.name }] : []));
          } else { this.failed.set(true); }
          this.loading.set(false);
        },
        error: () => { this.failed.set(true); this.loading.set(false); },
      });
  }
}
