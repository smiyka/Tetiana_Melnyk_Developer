import { Component } from '@angular/core';
import { PROFILE } from './profile';

@Component({ selector: 'app-cv', templateUrl: './cv.html' })
export class Cv {
  readonly profile = PROFILE;
}
