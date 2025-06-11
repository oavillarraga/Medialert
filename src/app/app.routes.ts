

import { Routes } from '@angular/router';

export const routes: Routes = [
  // Al iniciar la app, ve directo a la lista de medicamentos
  { path: '', redirectTo: 'med-list', pathMatch: 'full' },

  // (Opcional): Ruta de Login, accesible vía /login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },

  // Lista de medicamentos
  {
    path: 'med-list',
    loadComponent: () =>
      import('./pages/med-list/med-list.page').then(m => m.MedListPage)
  },

  // Detalle / creación de medicamento
  {
    path: 'med-detail/:id',
    loadComponent: () =>
      import('./pages/med-detail/med-detail.page').then(m => m.MedDetailPage)
  },

  // Otras páginas de tu app
  {
    path: 'recordatorios',
    loadComponent: () =>
      import('./pages/recordatorios/recordatorios.page').then(m => m.RecordatoriosPage)
  },
  {
    path: 'tratamientos',
    loadComponent: () =>
      import('./pages/tratamientos/tratamientos.page').then(m => m.TratamientosPage)
  },
  {
    path: 'registro-dosis',
    loadComponent: () =>
      import('./pages/registro-dosis/registro-dosis.page').then(m => m.RegistroDosisPage)
  },
  {
    path: 'medicamentos',
    loadComponent: () =>
      import('./pages/medicamentos/medicamentos.page').then(m => m.MedicamentosPage)
  },
  {
    path: 'informes',
    loadComponent: () =>
      import('./pages/informes/informes.page').then(m => m.InformesPage)
  },

  // Ruta comodín: si entran a algo desconocido, redirige a la lista
  { path: '**', redirectTo: 'med-list', pathMatch: 'full' }
];
