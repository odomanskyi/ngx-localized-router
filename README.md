# ngx-localized-router

tbd...

## Usage
In your app config:

```typescript
    provideNgxLocalizedRouter({
      defaultLanguage: 'de',
      languages: ['en', 'de'],
      languageResolved: (language: string) => {
        // Load translations, set app language etc...
      },
    }),
    provideRouter(localizeRoutes(appRoutes)),
```