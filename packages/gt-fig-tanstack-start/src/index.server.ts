import { AsyncLocalStorage } from "node:async_hooks";
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

export const requestLocale = new AsyncLocalStorage<string>();
export { configureGT as initializeGT };

export function getLocale(): string {
  return requestLocale.getStore() ?? getGTConfig().defaultLocale;
}

export async function getGT() {
  return createGTFunction(await loadGTState(getLocale()));
}

export { loadTranslationsSnapshot as getTranslationsSnapshot } from "./state.ts";
