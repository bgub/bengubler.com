import {
  Branch,
  createGTFunction,
  DateTime,
  GTProvider,
  msg,
  Num,
  T,
  useGT,
  useLocaleSelector,
  useMessages,
  Var,
} from "./shared.ts";
import {
  configureGT,
  getClientState,
  getGTConfig,
  type InitializeGTParams,
  resolveSupportedLocale,
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

export function initializeGT(config: InitializeGTParams): void {
  configureGT(config);
}

export function getLocale(): string {
  const config = getGTConfig();
  const pathLocale = location.pathname.split("/")[1];
  const cookieLocale = document.cookie
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([name]) => name === config.localeCookieName)?.[1];
  return resolveSupportedLocale(pathLocale || cookieLocale);
}

export async function getGT() {
  return createGTFunction(getClientState());
}

export async function getTranslationsSnapshot(
  locale: string,
): Promise<TranslationSnapshot> {
  const state = getClientState();
  return { [locale]: locale === state.locale ? state.catalog : {} };
}
