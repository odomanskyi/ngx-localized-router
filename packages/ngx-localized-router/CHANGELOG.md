# Changelog

## v1.1.7
- Fix localizing urls that start from default locale (/en-ca, /en-ca?query=123) if default - en

## v1.1.6
- Fix localizing urls that start from locale (/en, /en?query=123)

## v1.1.5
- Prevent removing default language segment from URL if it is explicitly defined in the app router config (e.g. /en when en is the default language).