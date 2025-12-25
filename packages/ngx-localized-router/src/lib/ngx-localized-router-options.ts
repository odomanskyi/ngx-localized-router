export interface NgxLocalizedRouterOptions {
  defaultLanguage: string;
  languages: string[];
  languageResolved?: (language: string) => void;
}
