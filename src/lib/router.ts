import { useRouterState } from "@bgub/fig-tanstack-router";

export function usePathname() {
  return useRouterState({ select: (state) => state.location.pathname });
}
