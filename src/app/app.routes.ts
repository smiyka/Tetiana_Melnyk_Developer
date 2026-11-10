import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Tetiana Melnyk — Developer Portfolio', loadComponent: () => import('./home').then(m => m.Home) },
  { path: 'cv', title: 'CV | Tetiana Melnyk', loadComponent: () => import('./cv').then(m => m.Cv) },
  { path: 'games', title: 'Games | Tetiana Melnyk', loadComponent: () => import('./games').then(m => m.Games) },
  { path: 'games/bug-snake', title: 'Bug Snake | Tetiana Melnyk', loadComponent: () => import('./bug-snake').then(m => m.BugSnake) },
  { path: 'games/bug-blaster', title: 'Bug Blaster | Tetiana Melnyk', loadComponent: () => import('./blaster-page').then(m => m.BlasterPage) },
  { path: 'games/tic-tac-toe', title: 'Bug Tac Toe | Tetiana Melnyk', loadComponent: () => import('./tic-tac-toe').then(m => m.TicTacToe) },
  { path: 'lab', title: 'Developer Lab | Tetiana Melnyk', loadComponent: () => import('./developer-lab').then(m => m.DeveloperLab) },
  { path: 'missions', redirectTo: 'lab', pathMatch: 'full' },
  { path: 'bug-blaster', redirectTo: 'games/bug-blaster', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
