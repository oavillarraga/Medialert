import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'recordatorios',
    loadComponent: () => import('./recordatorios/recordatorios.page').then((m) => m.RecordatoriosPage),
  },
  {
    path: 'tratamientos',
    loadComponent: () => import('./tratamientos/tratamientos.page').then((m) => m.TratamientosPage),
  },
  {
    path: 'registro-dosis',
    loadComponent: () => import('./registro-dosis/registro-dosis.page').then((m) => m.RegistroDosisPage),
  },
  {
    path: 'medicamentos',
    loadComponent: () => import('./medicamentos/medicamentos.page').then((m) => m.MedicamentosPage),
  },
  {
    path: 'informes',
    loadComponent: () => import('./informes/informes.page').then((m) => m.InformesPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
