import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MISSIONS, MissionId, Progress } from './progress';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly progress = inject(Progress);
  readonly missions = MISSIONS;
  readonly active = signal<MissionId>('logic');
  readonly feedback = signal('');
  readonly query = signal('');
  readonly skills = ['Angular', 'TypeScript', 'Accessibilità', 'CSS', 'Testing', 'RxJS'];
  readonly filteredSkills = computed(() =>
    this.skills.filter((s) =>
      s.toLocaleLowerCase('it').includes(this.query().trim().toLocaleLowerCase('it')),
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
      this.feedback.set('Bug risolto! +100 XP. Ogni missione assegna punti una sola volta.');
    } else
      this.feedback.set(
        'Quasi! Il contatore deve aumentare di uno, conservando il valore precedente.',
      );
  }
  discover(skill: string): void {
    if (skill === 'RxJS' && this.query().trim()) {
      this.progress.complete('search');
      this.feedback.set('RxJS trovato con il filtro! +150 XP.');
    } else this.feedback.set('Usa il campo di ricerca per trovare e selezionare RxJS.');
  }
  launch(): void {
    this.launchForm.markAllAsTouched();
    if (this.launchForm.invalid) {
      this.feedback.set('Controlla i campi evidenziati prima del lancio.');
      return;
    }
    this.progress.complete('form');
    this.feedback.set('Missione lanciata! +200 XP. Questa è una demo: nessun dato viene inviato.');
    this.launchForm.reset();
  }
  reset(): void {
    this.progress.reset();
    this.feedback.set('Nuova partita iniziata. Buona esplorazione!');
  }
}
