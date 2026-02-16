import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';

import { NgxLocalizedRouterService } from './ngx-localized-router.service';
import { ngxLocalizedRouterLangSegmentName } from './ngx-localized-router-lang-segment-name';

export const localizedRouteMatcher: CanMatchFn = (
  route: Route,
  segments: UrlSegment[],
): boolean => {
  const ngxLocalizedRouterService = inject(NgxLocalizedRouterService);

  if (
    (route.path || '').startsWith(`:${ngxLocalizedRouterLangSegmentName}`) &&
    !ngxLocalizedRouterService.supportedLanguages().includes(segments[0]?.path)
  ) {
    return false;
  }

  if (
    ngxLocalizedRouterService
      .supportedLanguages()
      .includes(segments[0]?.path) &&
    route.path !== `:${ngxLocalizedRouterLangSegmentName}`
  ) {
    return false;
  }

  return true;
};
