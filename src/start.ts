import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
import { getResponseHeaders } from "@tanstack/react-start/server";
import { gtMiddleware } from "gt-tanstack-start/server";
import {
  applyRouteLocaleToRequest,
  removeLocaleCookie,
} from "@/lib/request-routing";

const csrfMiddleware = createCsrfMiddleware({
  filter: ({ handlerType }) => handlerType === "serverFn",
});

const routeLocaleMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const directContentRequest = applyRouteLocaleToRequest(request);
    const result = await next();
    if (directContentRequest) removeLocaleCookie(getResponseHeaders());
    return result;
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, routeLocaleMiddleware, gtMiddleware],
}));
