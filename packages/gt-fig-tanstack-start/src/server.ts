import { createMiddleware } from "@bgub/fig-tanstack-start";
import { getResponseHeaders } from "@tanstack/start-server-core";
import { requestLocale } from "./index.server.ts";
import {
  resolveRequestLocale,
  serializeLocaleCookie,
} from "./locale-routing.ts";
import { getGTConfig } from "./state.ts";

export const gtMiddleware = createMiddleware().server(({ request, next }) => {
  const config = getGTConfig();
  const url = new URL(request.url);
  const locale = resolveRequestLocale(config, {
    acceptLanguage: request.headers.get("accept-language"),
    cookie: request.headers.get("cookie"),
    pathname: url.pathname,
  });
  return requestLocale.run(locale, async () => {
    const result = await next();
    getResponseHeaders().append(
      "Set-Cookie",
      serializeLocaleCookie(config, locale),
    );
    return result;
  });
});
