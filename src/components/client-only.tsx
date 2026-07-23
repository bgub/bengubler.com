import { type FigNode, useSyncExternalStore } from "@bgub/fig";

export function ClientOnly(props: {
  children?: FigNode | (() => FigNode);
  fallback?: FigNode;
}): FigNode {
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  if (!hydrated) return props.fallback ?? null;
  return typeof props.children === "function"
    ? props.children()
    : props.children;
}
