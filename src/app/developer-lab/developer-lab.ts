import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExampleId, LabProgress } from '../services/progress';
import { PROFILE } from '../data/profile';

type Fix = 'assign' | 'increment' | 'decrement';
const EXAMPLES = [
  { id: 'logic', title: 'Debug a counter', topic: 'TypeScript logic', duration: '1 minute', goal: 'Choose a fix, then run the counter twice. Two clicks should produce a value of 2.', why: 'The += operator adds to the current value. Assigning 1 overwrites it, while -= moves the counter in the wrong direction.' },
  { id: 'search', title: 'Filter a skill catalog', topic: 'Reactive state', duration: '1 minute', goal: 'Type rx into the search field, then select RxJS from the filtered results.', why: 'The query is a signal. A computed value derives the visible list from that query, so results stay in sync without maintaining a second list by hand.' },
  { id: 'form', title: 'Validate a project brief', topic: 'Accessible forms', duration: '2 minutes', goal: 'Try submitting an empty form. Then enter a project name and a valid demo email to pass validation.', why: 'Reactive Forms keep validation rules together. Errors are connected to their fields with aria-describedby, and invalid controls expose their state to assistive technology.' },
] as const;

@Component({ selector: 'app-developer-lab', imports: [ReactiveFormsModule], templateUrl: './developer-lab.html', styleUrl: './developer-lab.scss' })
export class DeveloperLab {
  readonly examples = EXAMPLES;
  readonly progress = inject(LabProgress);
  readonly active = signal<ExampleId>('logic');
  readonly index = computed(() => EXAMPLES.findIndex(example => example.id === this.active()));
  readonly example = computed(() => EXAMPLES[this.index()]);
  readonly completed = computed(() => this.progress.completed().includes(this.active()));
  readonly feedback = signal('');
  readonly feedbackError = signal(false);
  readonly heading = viewChild<ElementRef<HTMLElement>>('exampleHeading');
  readonly fix = signal<Fix | null>(null);
  readonly counter = signal(0);
  readonly runs = signal(0);
  readonly counterPassed = computed(() => this.runs() >= 2 && this.counter() === this.runs());
  readonly query = signal('');
  readonly skills = [...new Set(PROFILE.skillGroups.flatMap(group => [...group.skills]))];
  readonly filteredSkills = computed(() => this.skills.filter(skill => skill.toLowerCase().includes(this.query().trim().toLowerCase())));
  readonly foundSkill = signal(false);
  readonly formValidated = signal(false);
  readonly launchForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/), Validators.minLength(3), Validators.maxLength(60)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });

  select(id: ExampleId): void {
    this.active.set(id);
    this.feedback.set('');
    this.feedbackError.set(false);
    queueMicrotask(() => this.heading()?.nativeElement.focus());
  }

  next(): void { if (this.index() < EXAMPLES.length - 1) this.select(EXAMPLES[this.index() + 1].id); }

  chooseFix(fix: Fix): void {
    this.fix.set(fix);
    this.resetCounter();
  }

  resetCounter(): void { this.counter.set(0); this.runs.set(0); this.feedback.set(''); this.feedbackError.set(false); }

  runCounter(): void {
    if (!this.fix()) return;
    this.counter.update(value => this.fix() === 'increment' ? value + 1 : this.fix() === 'decrement' ? value - 1 : 1);
    this.runs.update(value => value + 1);
    if (this.runs() < 2) { this.feedback.set('One click done. Run it once more to check that the value keeps increasing.'); return; }
    if (this.counterPassed()) {
      this.progress.complete('logic');
      this.feedbackError.set(false);
      this.feedback.set(`Test passed: ${this.runs()} clicks produced ${this.counter()}. The counter keeps its previous value and adds one.`);
    } else {
      this.feedbackError.set(true);
      this.feedback.set(`Test failed: ${this.runs()} clicks should produce ${this.runs()}, but the value is ${this.counter()}. Choose another fix and try again.`);
    }
  }

  discover(skill: string): void {
    if (skill === 'RxJS' && this.query().trim()) {
      this.progress.complete('search'); this.foundSkill.set(true); this.feedbackError.set(false);
      this.feedback.set('RxJS found. Changing the query updates the visible results immediately.');
    } else {
      this.feedbackError.set(true); this.feedback.set('Type rx in the search field, then select the RxJS result.');
    }
  }

  clearFormResult(): void { this.formValidated.set(false); this.feedback.set(''); this.feedbackError.set(false); }

  launch(): void {
    this.launchForm.markAllAsTouched();
    if (this.launchForm.invalid) {
      this.formValidated.set(false); this.feedbackError.set(true);
      this.feedback.set('Check the messages under the fields. Use a name with 3–60 characters and a valid demo email.');
      return;
    }
    this.progress.complete('form'); this.formValidated.set(true); this.feedbackError.set(false);
    this.feedback.set('Validation passed. The project name and email meet the rules. No information has been sent or saved.');
  }

  reset(): void {
    this.progress.reset(); this.fix.set(null); this.resetCounter(); this.query.set('');
    this.foundSkill.set(false); this.formValidated.set(false); this.launchForm.reset();
    this.select('logic');
  }
}
