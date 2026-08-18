import type { FigNode } from "@bgub/fig";
import type {
  JsxChildren,
  JsxElement,
  Variable,
} from "@generaltranslation/format/types";
import type { LocaleRoutingConfig } from "./locale-routing.ts";

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

export interface GTConfig extends LocaleRoutingConfig {
  loadTranslations?: (locale: string) => Promise<TranslationCatalog>;
}

export interface GTState {
  catalog: TranslationCatalog;
  locale: string;
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

export function configureGT(params: InitializeGTParams): void {
  const defaultLocale = params.defaultLocale ?? defaultConfig.defaultLocale;
  config = {
    defaultLocale,
    loadTranslations: params.loadTranslations,
    localeCookieName: params.localeCookieName ?? defaultConfig.localeCookieName,
    localeRouting: params.localeRouting ?? defaultConfig.localeRouting,
    locales: [...new Set([defaultLocale, ...(params.locales ?? [])])],
  };
}

export function getGTConfig(): GTConfig {
  return config;
}

export async function loadCatalog(locale: string): Promise<TranslationCatalog> {
  if (locale === config.defaultLocale || !config.loadTranslations) return {};
  return config.loadTranslations(locale);
}

export async function loadGTState(locale: string): Promise<GTState> {
  return {
    catalog: await loadCatalog(locale),
    locale,
  };
}

export async function loadTranslationsSnapshot(
  locale: string,
): Promise<TranslationSnapshot> {
  return { [locale]: await loadCatalog(locale) };
}
