import { Routes } from '@angular/router';

import { localizedRouteMatcher } from './localized-route-matcher';
import { ngxLocalizedRouterLangSegmentName } from './ngx-localized-router-lang-segment-name';

const patchRoutes = (routes: Routes, depth = 0): Routes =>
  routes
    .map((route) => {
      const patchedRoutes = [
        {
          ...route,
          canMatch: [localizedRouteMatcher, ...(route.canMatch || [])],
          children: patchRoutes(route.children || [], depth + 1),
        },
      ];

      if (!depth) {
        patchedRoutes.push({
          ...route,
          path: [`:${ngxLocalizedRouterLangSegmentName}`, route.path]
            .filter(Boolean)
            .join('/'),
          canMatch: [localizedRouteMatcher, ...(route.canMatch || [])],
          children: patchRoutes(route.children || [], depth + 1),
        });
      }

      return patchedRoutes;
    })
    .flat();

export const localizeRoutes = (routes: Routes): Routes => patchRoutes(routes);
