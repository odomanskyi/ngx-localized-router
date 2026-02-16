import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { getRouterSelectors } from '@ngrx/router-store';
import {
  LocalizeRoutePipe,
  NgxLocalizedRouterService,
} from '@ngx-localized-router';

@Component({
  imports: [RouterModule, LocalizeRoutePipe],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  navItems = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'Home en',
      url: '/en',
    },
    {
      label: 'Page default',
      url: '/page',
    },
    {
      label: 'Page de',
      url: '/de/page',
    },
    {
      label: 'Page lang not exists',
      url: '/ss/page',
    },
  ];

  routerSelectors = getRouterSelectors();

  currentLanguage = signal('en');

  routeLanguage = inject(NgxLocalizedRouterService).routeLanguage;

  ngxLocalizedRouterService = inject(
    NgxLocalizedRouterService,
  ).routeLanguageChanged.subscribe((lang) => this.currentLanguage.set(lang));

  store = inject(Store);

  ngOnInit(): void {
    this.store.select(this.routerSelectors.selectUrl).subscribe(console.log);
  }
}
