import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@bgub/fig-tanstack-start";
import { getResponseHeaders } from "@tanstack/start-server-core";
import { gtMiddleware } from "gt-fig-tanstack-start/server";
import {
  prepareDirectContentRequest,
  removeLocaleCookie,
} from "@/lib/request-routing";

const csrfMiddleware = createCsrfMiddleware({
  filter: ({ handlerType }) => handlerType === "serverFn",
});

const directContentMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const directContentRequest = prepareDirectContentRequest(request);
    const result = await next();
    if (directContentRequest) removeLocaleCookie(getResponseHeaders());
    return result;
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, directContentMiddleware, gtMiddleware],
}));
