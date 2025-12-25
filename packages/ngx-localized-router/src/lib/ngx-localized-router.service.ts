import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

import { distinctUntilChanged, filter, map, Subject, tap } from 'rxjs';

import { NgxLocalizedRouterOptionsToken } from './ngx-localized-router-options-token';
import { ngxLocalizedRouterLangSegmentName } from './ngx-localized-router-lang-segment-name';

@Injectable()
export class NgxLocalizedRouterService {
  private _initialConfig = inject(NgxLocalizedRouterOptionsToken);
  private _router = inject(Router);

  private _initialLanguageResolved = false;

  private _defaultLanguage = signal<string>(
    this._initialConfig.defaultLanguage,
  );
  private _supportedLanguages = signal<string[]>(
    this._initialConfig.languages || [],
  );
  private _routeLanguage = signal<string>(this._defaultLanguage());

  private _routeLanguageChanged = new Subject<string>();

  readonly defaultLanguage = this._defaultLanguage.asReadonly();
  readonly supportedLanguages = this._supportedLanguages.asReadonly();
  readonly routeLanguage = this._routeLanguage.asReadonly();

  readonly routeLanguageChanged = this._routeLanguageChanged
    .asObservable()
    .pipe(distinctUntilChanged());

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
        filter(
          (event) =>
            event instanceof NavigationEnd || event instanceof NavigationStart,
        ),
        tap((event) => {
          if (
            event instanceof NavigationStart &&
            event.url === `/${this.defaultLanguage()}`
          ) {
            void this._router.navigateByUrl('/');
          }
        }),
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this._router.routerState.snapshot.root;

          while (route.firstChild) {
            route = route.firstChild;
          }
          return (
            route.paramMap.get(ngxLocalizedRouterLangSegmentName) ||
            this.defaultLanguage()
          );
        }),
        tap((language) => {
          this._routeLanguage.set(language);
          this._routeLanguageChanged.next(language);

          if (
            !this._initialLanguageResolved &&
            this._initialConfig.languageResolved
          ) {
            this._initialConfig.languageResolved(language);
            this._initialLanguageResolved = true;
          }
        }),
      )
      .subscribe();
  }
}
