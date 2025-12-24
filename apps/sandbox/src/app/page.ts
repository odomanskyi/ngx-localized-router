import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NgxLocalizedRouterService } from '@ngx-localized-router';

@Component({
  selector: 'app-page',
  template: `
    Route language: {{ localizedRouter.routeLanguage() }}<br />
    Slug: {{ slug() }}
  `,
})
export class Page {
  private _activatedRoute = inject(ActivatedRoute);

  localizedRouter = inject(NgxLocalizedRouterService);

  slug = toSignal(
    this._activatedRoute.params.pipe(map((params) => params?.['slug'])),
  );
}
