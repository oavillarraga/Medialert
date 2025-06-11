import { Routes } from '@angular/router';

export const routes: Routes = [
  // Al iniciar la app, va directo al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta de Login
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.page').then(m => m.LoginPage)
  },

  // Página principal (Home)
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },

  // Recordatorios
  {
    path: 'recordatorios',
    loadComponent: () =>
      import('./recordatorios/recordatorios.page').then(m => m.RecordatoriosPage)
  },

  // Tratamientos
  {
    path: 'tratamientos',
    loadComponent: () =>
      import('./tratamientos/tratamientos.page').then(m => m.TratamientosPage)
  },

  // Medicamentos
  {
    path: 'medicamentos',
    loadComponent: () =>
      import('./medicamentos/medicamentos.page').then(m => m.MedicamentosPage)
  },

  // Registro de Dosis
  {
    path: 'registro-dosis',
    loadComponent: () =>
      import('./registro-dosis/registro-dosis.page').then(m => m.RegistroDosisPage)
  },

  // Informes
  {
    path: 'informes',
    loadComponent: () =>
      import('./informes/informes.page').then(m => m.InformesPage)
  },

  // Ruta comodín: si entran a algo desconocido, redirige al login
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
