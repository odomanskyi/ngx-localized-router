import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NgxLocalizedRouterOptions } from './ngx-localized-router-options';
import { NgxLocalizedRouterService } from './ngx-localized-router.service';
import { NgxLocalizedRouterOptionsToken } from './ngx-localized-router-options-token';

export const provideNgxLocalizedRouter = (
  options: NgxLocalizedRouterOptions,
): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: NgxLocalizedRouterOptionsToken,
      useValue: options,
    },
    NgxLocalizedRouterService,
  ]);
