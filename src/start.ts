import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
import { getResponseHeaders } from "@tanstack/react-start/server";
import { gtMiddleware } from "gt-tanstack-start/server";
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
