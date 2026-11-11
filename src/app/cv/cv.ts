import { Component } from '@angular/core';
import { PROFILE } from '../data/profile';
import { Codewars } from '../codewars/codewars';

@Component({ selector: 'app-cv', imports: [Codewars], templateUrl: './cv.html' })
export class Cv {
  readonly profile = PROFILE;
}
