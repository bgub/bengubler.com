import { createMiddleware } from "@bgub/fig-tanstack-start";
import { getResponseHeaders } from "@tanstack/start-server-core";
import { parseAcceptLanguage } from "gt-i18n/internal";
import { requestState } from "./index.server.ts";
import { getGTConfig, resolveSupportedLocale, type GTState } from "./state.ts";

export const gtMiddleware = createMiddleware().server(({ request, next }) => {
  const config = getGTConfig();
  const url = new URL(request.url);
  const pathLocale = config.localeRouting
    ? url.pathname.split("/")[1]
    : undefined;
  const cookieLocale = readCookie(
    request.headers.get("cookie"),
    config.localeCookieName,
  );
  const locale = resolveSupportedLocale([
    ...(pathLocale ? [pathLocale] : []),
    ...(cookieLocale ? [cookieLocale] : []),
    ...parseAcceptLanguage(request.headers.get("accept-language")),
  ]);
  const state: GTState = {
    catalog: {},
    defaultLocale: config.defaultLocale,
    locale,
    locales: config.locales,
  };
  return requestState.run(state, async () => {
    const result = await next();
    getResponseHeaders().append(
      "Set-Cookie",
      `${config.localeCookieName}=${encodeURIComponent(locale)}; Max-Age=31536000; Path=/; SameSite=Lax`,
    );
    return result;
  });
});

function readCookie(header: string | null, name: string): string | undefined {
  for (const cookie of (header ?? "").split(";")) {
    const [key, ...value] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return undefined;
}
