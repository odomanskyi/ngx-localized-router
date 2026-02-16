import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import {
  localizeRoutes,
  provideNgxLocalizedRouter,
} from '@ngx-localized-router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEffects(),
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      localizeRoutes(appRoutes),
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
    provideStore({
      router: routerReducer,
    }),
    provideRouterStore(),
    provideNgxLocalizedRouter({
      defaultLanguage: 'de',
      languages: ['en', 'de'],
    }),
  ],
};
