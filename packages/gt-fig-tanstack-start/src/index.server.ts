import { AsyncLocalStorage } from "node:async_hooks";
import {
  createGTFunction,
  GTProvider,
  useGT,
  useLocaleSelector,
  useMessages,
  T,
  Var,
  Num,
  DateTime,
  Branch,
  msg,
} from "./shared.ts";
import {
  configureGT,
  getGTConfig,
  loadCatalog,
  type GTState,
  type InitializeGTParams,
  type TranslationSnapshot,
} from "./state.ts";

export {
  Branch,
  DateTime,
  GTProvider,
  msg,
  Num,
  T,
  useGT,
  useLocaleSelector,
  useMessages,
  Var,
};
export type { InitializeGTParams };

export const requestState = new AsyncLocalStorage<GTState>();

export function initializeGT(config: InitializeGTParams): void {
  configureGT(config);
}

export function getLocale(): string {
  return requestState.getStore()?.locale ?? getGTConfig().defaultLocale;
}

export async function getGT() {
  const locale = getLocale();
  const config = getGTConfig();
  return createGTFunction({
    catalog: await loadCatalog(locale),
    defaultLocale: config.defaultLocale,
    locale,
    locales: config.locales,
  });
}

export async function getTranslationsSnapshot(
  locale: string,
): Promise<TranslationSnapshot> {
  return { [locale]: await loadCatalog(locale) };
}
