// src/main.ts

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // Mantener la estrategia de reutilización de rutas de Ionic
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // Proveedores de Ionic (equivalente a IonicModule.forRoot())
    provideIonicAngular(),

    // Enrutamiento con precarga de módulos
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
});
