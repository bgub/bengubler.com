import { createRouter } from "@bgub/fig-tanstack-router";
import { createStartDataContext } from "@bgub/fig-tanstack-start";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    ...createStartDataContext(),
    isServer: typeof document === "undefined",
    routeTree,
    defaultPreload: "intent",
    defaultViewTransition: true,
    scrollRestoration: true,
  });
}

declare module "@tanstack/router-core" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
