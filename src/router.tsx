import { onContentUpdate } from "@bgub/fig-content";
import { createRouter } from "@bgub/fig-tanstack-router";
import { createStartDataContext } from "@bgub/fig-tanstack-start";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    ...createStartDataContext(),
    isServer: typeof document === "undefined",
    routeTree,
    defaultPreload: "intent",
    defaultViewTransition: true,
    scrollRestoration: true,
  });

  if (!router.isServer) {
    onContentUpdate(({ collections }) => {
      if (!collections.includes("posts")) return;

      const data = router.options.context.data;
      data.invalidateDataPrefix(["post"]);
      data.invalidateDataPrefix(["posts"]);
      data.invalidateDataPrefix(["recent-posts"]);
      void router.invalidate();
    });
  }

  return router;
}

declare module "@tanstack/router-core" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
