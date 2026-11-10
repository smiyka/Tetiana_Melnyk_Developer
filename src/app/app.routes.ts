import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'SkillQuest — Code & Play', loadComponent: () => import('./home').then(m => m.Home) },
  { path: 'cv', title: 'Tetiana Melnyk — CV | SkillQuest', loadComponent: () => import('./cv').then(m => m.Cv) },
  { path: 'games', title: 'Games | SkillQuest', loadComponent: () => import('./games').then(m => m.Games) },
  { path: 'games/bug-blaster', title: 'Bug Blaster | SkillQuest', loadComponent: () => import('./blaster-page').then(m => m.BlasterPage) },
  { path: 'games/tic-tac-toe', title: 'Bug Tac Toe | SkillQuest', loadComponent: () => import('./tic-tac-toe').then(m => m.TicTacToe) },
  { path: 'missions', title: 'Missions | SkillQuest', loadComponent: () => import('./missions').then(m => m.Missions) },
  { path: 'bug-blaster', redirectTo: 'games/bug-blaster', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
