import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', title: 'Tetiana Melnyk — Developer Portfolio', loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'cv', title: 'CV | Tetiana Melnyk', loadComponent: () => import('./cv/cv').then(m => m.Cv) },
  { path: 'games', title: 'Games | Tetiana Melnyk', loadComponent: () => import('./games/games').then(m => m.Games) },
  { path: 'games/bug-memory', title: 'Bug Memory | Tetiana Melnyk', loadComponent: () => import('./bug-memory/bug-memory').then(m => m.BugMemory) },
  { path: 'games/bug-merge', title: 'Bug Merge | Tetiana Melnyk', loadComponent: () => import('./bug-merge/bug-merge').then(m => m.BugMerge) },
  { path: 'games/bug-defense', title: 'Bug Tower Defense | Tetiana Melnyk', loadComponent: () => import('./bug-defense/bug-defense').then(m => m.BugDefense) },
  { path: 'games/bug-snake', title: 'Bug Snake | Tetiana Melnyk', loadComponent: () => import('./bug-snake/bug-snake').then(m => m.BugSnake) },
  { path: 'games/bug-blaster', title: 'Bug Blaster | Tetiana Melnyk', loadComponent: () => import('./blaster-page/blaster-page').then(m => m.BlasterPage) },
  { path: 'games/tic-tac-toe', title: 'Bug Tac Toe | Tetiana Melnyk', loadComponent: () => import('./tic-tac-toe/tic-tac-toe').then(m => m.TicTacToe) },
  { path: 'lab', title: 'Developer Lab | Tetiana Melnyk', loadComponent: () => import('./developer-lab/developer-lab').then(m => m.DeveloperLab) },
  { path: 'missions', redirectTo: 'lab', pathMatch: 'full' },
  { path: 'bug-blaster', redirectTo: 'games/bug-blaster', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
