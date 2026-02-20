import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: ':slug',
        loadComponent: () => import('./page').then((c) => c.Page),
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./page').then((c) => c.Page),
      },
    ],
  },
];
