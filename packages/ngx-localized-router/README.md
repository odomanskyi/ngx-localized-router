# ✨ What is ngx-localized-router?

`ngx-localized-router` is a lightweight Angular library that helps you localize your application routes by adding language segments to the URL.

Examples of supported routes:
```html
/            → default language
/en          → English
/de          → German
/about
/en/about
/de/about
```
It is built specifically for modern Angular (20+) and designed to work seamlessly with:

- ✅ Standalone APIs
- ✅ Angular Signals
- ✅ Zoneless applications
- ✅ Server-Side Rendering (SSR)

No hacks, no router monkey-patching — just clean, predictable localization.

## 🚀 Features

- 🌐 Language prefixes in URLs (/en, /de, etc.)
- 🔁 Automatic language detection from the route
- 🧠 Signal-based APIs
- 🧩 Standalone-first (no required NgModules)
- ⚡ Zoneless compatible
- 🖥️ SSR-safe (Angular Universal / Node / Edge)
- 🌳 Tree-shakable & lightweight

## 📦 Installation
```bash
npm install ngx-localized-router
```

## 🛠️ Setup
`ngx-localized-router` integrates directly with Angular’s router by patching your routes and providing a small service to track and control the active language.

### 1️⃣ Provide the localized router

Configure the library using provideNgxLocalizedRouter:
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgxLocalizedRouter, localizeRoutes } from 'ngx-localized-router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideNgxLocalizedRouter({
      defaultLanguage: 'de',
      languages: ['en', 'de'],
    }),
    provideRouter(localizeRoutes(appRoutes)),
  ],
};
```

### 2️⃣ Wrap your routes with localizeRoutes()

Your original routes stay clean and language-agnostic:

```typescript
export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];
```

After localization, the router will automatically support:

```
/
/about
/en
/en/about
```
Navigating to `/{defaultLanguage}` (e.g. `/de`) automatically redirects to `/`.

## 🧠 Accessing Router Language (Signals)

```typescript
import { inject } from '@angular/core';
import { NgxLocalizedRouterService } from 'ngx-localized-router';

export class HeaderComponent {
  private localizedRouter = inject(NgxLocalizedRouterService);

  language = this.localizedRouter.routeLanguage;
}
```
Available signals:

- routeLanguage – currently active language
- defaultLanguage
- supportedLanguages

## 🔔 Reacting to Language Changes

If you prefer an observable-style API:

```typescript
this.localizedRouter.routeLanguageChanged.subscribe((language) => {
  console.log('Language changed to:', language);
});
```

This only emits when the language actually changes.

## 🔗 Localizing URLs Programmatically

```typescript
this.localizedRouter.localizeUrl('/about', 'en');
// → /en/about

this.localizedRouter.localizeUrl('/en/about', 'de');
// → /about
```

Notes:
- Existing language prefixes are automatically removed
- The default language is never added to the URL

### 🧵 localizeRoute Pipe (Templates)
For templates, ngx-localized-router provides the localizeRoute pipe, which wraps the same logic as localizeUrl.

This is the recommended way to localize links in templates.

**Example**
```angular181html
<a [routerLink]="'/about' | localizeRoute : 'en'">
About (EN)
</a>

<a [routerLink]="'/about' | localizeRoute : 'de'">
Über uns (DE)
</a>
```


You can also pass route segments as an array:
```angular181html
<a [routerLink]="['about', 'team'] | localizeRoute : 'en'">
Team
</a>
```

#### What the pipe does

Internally, the pipe delegates to NgxLocalizedRouterService.localizeUrl():

- Removes an existing language segment (if present)
- Adds the requested language prefix
- Omits the prefix for the default language

This ensures consistent URL generation across:

- Templates
- Components
- Services

## 🌐 SSR & Hydration Friendly
`ngx-localized-router` is fully SSR-safe:

- No access to window or document
- Works with Angular Universal & hydration
- Deterministic language resolution on server & client

## ⚡ Zoneless & Signal-First

- No dependency on zone.js
- Uses Angular signals internally
- Plays nicely with zoneless change detection
- Minimal runtime overhead

## 🎯 When to Use This Library
Use ngx-localized-router if you want:

- Clean, SEO-friendly localized URLs
- No coupling to translation libraries
- Full control over language resolution
- Modern Angular patterns only
