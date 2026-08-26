import { getRequest, getResponseHeaders } from "@tanstack/start-server-core";
import {
  resolveRequestLocale,
  serializeLocaleCookie,
} from "./locale-routing.ts";
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

const requestLocales = new WeakMap<Request, string>();

export { configureGT as initializeGT };

export function getLocale(): string {
  const request = getRequest();
  const cachedLocale = requestLocales.get(request);
  if (cachedLocale) return cachedLocale;

  const config = getGTConfig();
  const locale = resolveRequestLocale(config, {
    acceptLanguage: request.headers.get("accept-language"),
    cookie: request.headers.get("cookie"),
    pathname: new URL(request.url).pathname,
  });
  getResponseHeaders().append(
    "Set-Cookie",
    serializeLocaleCookie(config, locale),
  );
  requestLocales.set(request, locale);
  return locale;
}

export async function getGT() {
  return createGTFunction(await loadGTState(getLocale()));
}

export { loadCatalog as getTranslations } from "./state.ts";
