import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
import { getResponseHeaders } from "@tanstack/react-start/server";
import { getLocale, gtMiddleware } from "gt-tanstack-start/server";
import { resolveLocale } from "@/lib/locales";
import {
  applyRouteLocaleToRequest,
  getDefaultLocaleRedirect,
  getLocaleRedirect,
  removeLocaleCookie,
} from "@/lib/request-routing";

const csrfMiddleware = createCsrfMiddleware({
  filter: ({ handlerType }) => handlerType === "serverFn",
});

const routeLocaleMiddleware = createMiddleware().server(
  async ({ request, handlerType, next }) => {
    if (handlerType !== "serverFn") {
      const redirectUrl = getDefaultLocaleRedirect(request);
      if (redirectUrl) {
        return new Response(null, {
          status: 308,
          headers: { location: redirectUrl.toString() },
        });
      }
    }

    const documentRequest = applyRouteLocaleToRequest(request);
    const result = await next();
    if (documentRequest) removeLocaleCookie(getResponseHeaders());
    return result;
  },
);

const localeRedirectMiddleware = createMiddleware().server(
  ({ request, handlerType, next }) => {
    if (handlerType === "serverFn") return next();

    const redirectUrl = getLocaleRedirect(request, resolveLocale(getLocale()));
    return redirectUrl
      ? new Response(null, {
          status: 307,
          headers: { location: redirectUrl.toString() },
        })
      : next();
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [
    csrfMiddleware,
    routeLocaleMiddleware,
    gtMiddleware,
    localeRedirectMiddleware,
  ],
}));
