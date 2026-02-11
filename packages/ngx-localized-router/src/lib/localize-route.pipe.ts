import { inject, Pipe, PipeTransform } from '@angular/core';

import { NgxLocalizedRouterService } from './ngx-localized-router.service';

@Pipe({
  name: 'localizeRoute',
})
export class LocalizeRoutePipe implements PipeTransform {
  private _ngxLocalizedRouterService = inject(NgxLocalizedRouterService);

  transform(url: string | string[], language?: string): string {
    return this._ngxLocalizedRouterService.localizeUrl(url, language);
  }
}
