import {
  getLocaleRedirectPath,
  resolveRequestLocale,
  serializeLocaleCookie,
} from "./packages/gt-fig-tanstack-start/src/locale-routing.ts";
import {
  defaultLocale,
  localeCookieName,
  localeRouting,
  locales,
} from "./src/lib/locale-config.ts";

const routingConfig = {
  defaultLocale,
  localeCookieName,
  localeRouting,
  locales,
};

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
  const locale = resolveRequestLocale(routingConfig, {
    acceptLanguage: request.headers.get("accept-language"),
    cookie: request.headers.get("cookie"),
    pathname: url.pathname,
  });
  const location = getLocaleRedirectPath(routingConfig, {
    accept: request.headers.get("accept"),
    locale,
    method: request.method,
    pathname: url.pathname,
    search: url.search,
  });
  if (!location) return;

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
