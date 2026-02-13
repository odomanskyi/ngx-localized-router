import { computed, inject, Injectable, signal } from '@angular/core';
import { distinctUntilChanged, filter, Subject, tap } from 'rxjs';

import { NgxLocalizedRouterOptionsToken } from './ngx-localized-router-options-token';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class NgxLocalizedRouterService {
  private _initialConfig = inject(NgxLocalizedRouterOptionsToken);
  private _router = inject(Router);
  private _location = inject(Location);

  private _currentUrl = signal<string>(this._location.path());
  private _defaultLanguage = signal<string>(
    this._initialConfig.defaultLanguage,
  );
  private _supportedLanguages = signal<string[]>(
    this._initialConfig.languages || [],
  );

  private _routeLanguageChanged = new Subject<string>();

  readonly defaultLanguage = this._defaultLanguage.asReadonly();
  readonly supportedLanguages = this._supportedLanguages.asReadonly();

  readonly routeLanguage = computed<string>(() =>
    this._getLanguageFromUrl(this._currentUrl(), this._defaultLanguage()),
  );

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

  localizeUrl(
    url: string | string[],
    language: string = this.routeLanguage(),
  ): string {
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
        tap((event) => this._currentUrl.set(event.url)),
      )
      .subscribe();
  }

  private _getLanguageFromUrl(url: string, fallbackLanguage: string): string {
    const firstSegment = url.split('/')[1] || '';

    if (this._supportedLanguages().includes(firstSegment)) {
      return firstSegment;
    }

    return fallbackLanguage;
  }
}
