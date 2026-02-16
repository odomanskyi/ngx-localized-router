import { Routes } from '@angular/router';

import { localizedRouteMatcher } from './localized-route-matcher';
import { ngxLocalizedRouterLangSegmentName } from './ngx-localized-router-lang-segment-name';

const patchRoutes = (routes: Routes, depth = 0): Routes =>
  routes
    .map((route) => {
      const children = route.children?.length
        ? { children: patchRoutes(route.children || [], depth + 1) }
        : {};

      const canMatch = !Object.hasOwn(route, 'redirectTo')
        ? { canMatch: [localizedRouteMatcher, ...(route.canMatch || [])] }
        : {};

      const patchedRoutes = [
        {
          ...route,
          ...children,
          ...canMatch,
        },
      ];

      if (!depth) {
        patchedRoutes.unshift({
          ...route,
          ...children,
          ...canMatch,
          path: [`:${ngxLocalizedRouterLangSegmentName}`, route.path]
            .filter(Boolean)
            .join('/'),
        });
      }

      return patchedRoutes;
    })
    .flat();

export const localizeRoutes = (routes: Routes): Routes => patchRoutes(routes);
