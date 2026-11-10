import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MISSIONS, MissionId, Progress } from './progress';
import { PROFILE } from './profile';
import { BugGame } from './bug-game';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, BugGame],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly profile = PROFILE;
  readonly progress = inject(Progress);
  readonly missions = MISSIONS;
  readonly active = signal<MissionId>('logic');
  readonly feedback = signal('');
  readonly query = signal('');
  readonly skills = [...new Set(PROFILE.skillGroups.flatMap((group) => [...group.skills]))];
  readonly filteredSkills = computed(() =>
    this.skills.filter((s) =>
      s.toLocaleLowerCase('en').includes(this.query().trim().toLocaleLowerCase('en')),
    ),
  );
  readonly launchForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.minLength(3),
        Validators.maxLength(60),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  select(id: MissionId): void {
    this.active.set(id);
    this.feedback.set('');
  }
  solve(correct: boolean): void {
    if (correct) {
      this.progress.complete('logic');
      this.feedback.set('Bug fixed! +100 XP. Each mission awards points only once.');
    } else
      this.feedback.set(
        'Almost! The counter needs to increase by one, keeping its previous value.',
      );
  }
  discover(skill: string): void {
    if (skill === 'RxJS' && this.query().trim()) {
      this.progress.complete('search');
      this.feedback.set('You found RxJS using the filter! +150 XP.');
    } else this.feedback.set('Use the search field to find and select RxJS.');
  }
  launch(): void {
    this.launchForm.markAllAsTouched();
    if (this.launchForm.invalid) {
      this.feedback.set('Check the highlighted fields before launch.');
      return;
    }
    this.progress.complete('form');
    this.feedback.set('Mission launched! +200 XP. This is a demo: no data is sent.');
    this.launchForm.reset();
  }
  reset(): void {
    this.progress.reset();
    this.feedback.set('New game started. Happy exploring!');
  }
}
