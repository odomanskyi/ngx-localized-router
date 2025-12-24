import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  localizeRoutes,
  provideNgxLocalizedRouter,
} from '@ngx-localized-router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideNgxLocalizedRouter({
      defaultLanguage: 'de',
      languages: ['en', 'de'],
    }),
    provideRouter(localizeRoutes(appRoutes)),
  ],
};
