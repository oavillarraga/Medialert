import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'recordatorios',
    loadComponent: () => import('./recordatorios/recordatorios.page').then((m) => m.RecordatoriosPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
