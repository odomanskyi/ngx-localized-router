import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, map } from 'rxjs';

import { NgxLocalizedRouterOptionsToken } from './ngx-localized-router-options-token';
import { ngxLocalizedRouterLangSegmentName } from './ngx-localized-router-lang-segment-name';

@Injectable()
export class NgxLocalizedRouterService {
  private _initialConfig = inject(NgxLocalizedRouterOptionsToken);
  private _router = inject(Router);

  private _defaultLanguage = signal<string>(
    this._initialConfig.defaultLanguage,
  );
  private _supportedLanguages = signal<string[]>(
    this._initialConfig.languages || [],
  );
  private _routeLanguage = signal<string>(this._defaultLanguage());

  readonly defaultLanguage = this._defaultLanguage.asReadonly();
  readonly supportedLanguages = this._supportedLanguages.asReadonly();
  readonly routeLanguage = this._routeLanguage.asReadonly();

  constructor() {
    this._handleNavigation();
  }

  setLanguages(languages: string[]): void {
    this._supportedLanguages.set(Array.from(new Set(languages)));
  }

  addLanguages(languages: string): void {
    this.setLanguages(
      Array.from(new Set([...this._supportedLanguages(), ...languages])),
    );
  }

  localizeUrl(url: string | string[], language: string): string {
    let path = Array.isArray(url) ? url.join('/') : url;

    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    const segments = path.split('/').filter(Boolean);

    if (segments.length && this.supportedLanguages().includes(segments[0])) {
      segments.shift();
    }

    if (language !== this.defaultLanguage()) {
      segments.unshift(language);
    }

    return '/' + segments.join('/');
  }

  private _handleNavigation(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this._router.routerState.snapshot.root;

          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.paramMap.get(ngxLocalizedRouterLangSegmentName);
        }),
      )
      .subscribe((lang) =>
        this._routeLanguage.set(lang || this.defaultLanguage()),
      );
  }
}
