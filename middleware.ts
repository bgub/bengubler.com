import {
  localizePathname,
  resolveRequestLocale,
  serializeLocaleCookie,
} from "gt-fig-tanstack-start/routing";
import gtConfig from "./gt.config.json" with { type: "json" };

const localeCookieName = "generaltranslation.locale";
const routingConfig = { ...gtConfig, localeCookieName };

export const config = {
  matcher: [
    "/",
    "/about/:path*",
    "/contact",
    "/lds-heatmap",
    "/language-learning/:path*",
    "/posts/:path*",
    "/projects",
    "/recommended",
  ],
};

export function localeMiddleware(request: Request): Response | undefined {
  const url = new URL(request.url);
  if (url.searchParams.has("__raw") || /\.[^/]+$/.test(url.pathname)) return;

  const locale = resolveRequestLocale(routingConfig, {
    acceptLanguage: request.headers.get("accept-language"),
    cookie: request.headers.get("cookie"),
    pathname: url.pathname,
  });
  if (locale === routingConfig.defaultLocale) return;

  const location = `${localizePathname(routingConfig, url.pathname, locale)}${url.search}`;
  return new Response(null, {
    status: 307,
    headers: {
      Location: location,
      "Set-Cookie": serializeLocaleCookie(routingConfig, locale),
    },
  });
}

// Vercel requires Routing Middleware to be exposed as a default export.
export { localeMiddleware as default };
