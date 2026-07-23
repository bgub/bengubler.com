import type { FigNode } from "@bgub/fig";
import type {
  JsxChildren,
  JsxElement,
  Variable,
} from "@generaltranslation/format/types";

export type Translation = JsxChildren;
export type TranslationElement = JsxElement & Partial<Variable>;
export type TranslationCatalog = Record<string, Translation>;
export type TranslationSnapshot = Record<string, TranslationCatalog>;

export interface InitializeGTParams {
  defaultLocale?: string;
  loadTranslations?: (locale: string) => Promise<TranslationCatalog>;
  localeCookieName?: string;
  localeRouting?: boolean;
  locales?: string[];
  [key: string]: unknown;
}

export interface GTConfig {
  defaultLocale: string;
  loadTranslations?: (locale: string) => Promise<TranslationCatalog>;
  localeCookieName: string;
  localeRouting: boolean;
  locales: readonly string[];
}

export interface GTState {
  catalog: TranslationCatalog;
  defaultLocale: string;
  locale: string;
  locales: readonly string[];
}

export interface GTProviderProps {
  children?: FigNode;
  locale: string;
  translations: TranslationSnapshot;
}

const defaultConfig: GTConfig = {
  defaultLocale: "en",
  localeCookieName: "generaltranslation.locale",
  localeRouting: false,
  locales: ["en"],
};

let config = defaultConfig;
let clientState: GTState = {
  catalog: {},
  defaultLocale: config.defaultLocale,
  locale: config.defaultLocale,
  locales: config.locales,
};

export function configureGT(params: InitializeGTParams): void {
  const defaultLocale = params.defaultLocale ?? defaultConfig.defaultLocale;
  config = {
    defaultLocale,
    loadTranslations: params.loadTranslations,
    localeCookieName: params.localeCookieName ?? defaultConfig.localeCookieName,
    localeRouting: params.localeRouting ?? defaultConfig.localeRouting,
    locales: [...new Set([defaultLocale, ...(params.locales ?? [])])],
  };
  clientState = {
    ...clientState,
    defaultLocale,
    locale: resolveSupportedLocale(clientState.locale),
    locales: config.locales,
  };
}

export function getGTConfig(): GTConfig {
  return config;
}

export function getClientState(): GTState {
  return clientState;
}

export function setClientState(state: GTState): void {
  clientState = state;
}

export function resolveSupportedLocale(
  value: string | readonly string[] | undefined,
): string {
  const candidates = typeof value === "string" ? [value] : (value ?? []);
  for (const candidate of candidates) {
    const exact = config.locales.find(
      (locale) => locale.toLowerCase() === candidate.toLowerCase(),
    );
    if (exact) return exact;
    const language = candidate.split("-")[0]?.toLowerCase();
    const languageMatch = config.locales.find(
      (locale) => locale.split("-")[0]?.toLowerCase() === language,
    );
    if (languageMatch) return languageMatch;
  }
  return config.defaultLocale;
}

export async function loadCatalog(locale: string): Promise<TranslationCatalog> {
  if (locale === config.defaultLocale || !config.loadTranslations) return {};
  return config.loadTranslations(locale);
}
