import { resolveRequestLocale } from "./locale-routing.ts";
import { createGTFunction } from "./shared.ts";
import {
  configureGT,
  getGTConfig,
  type InitializeGTParams,
  loadGTState,
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
} from "./shared.ts";
export type { InitializeGTParams };

export { configureGT as initializeGT };

export function getLocale(): string {
  const config = getGTConfig();
  return resolveRequestLocale(config, {
    cookie: document.cookie,
    pathname: location.pathname,
  });
}

export async function getGT() {
  return createGTFunction(await loadGTState(getLocale()));
}

export { loadTranslationsSnapshot as getTranslationsSnapshot } from "./state.ts";
