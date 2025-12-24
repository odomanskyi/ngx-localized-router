import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalizeRoutePipe } from '@ngx-localized-router';

@Component({
  imports: [RouterModule, LocalizeRoutePipe],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
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

  currentLanguage = signal('en');
}
