import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1) Al arrancar, ve directo a med-list
  { path: '', redirectTo: 'med-list', pathMatch: 'full' },

  // 2) Componente standalone para la lista
  {
    path: 'med-list',
    loadComponent: () =>
      import('./pages/med-list/med-list.page').then(m => m.MedListPage)
  },

  // 3) Componente standalone para nuevo/editar
  {
    path: 'med-detail/:id',
    loadComponent: () =>
      import('./pages/med-detail/med-detail.page').then(m => m.MedDetailPage)
  }
];
