import { type FigNode, useCallback } from "@bgub/fig";
import { ClientOnly } from "@/components/client-only";
import { useTheme } from "@/components/theme-provider";
import { mountGiscus } from "@/lib/giscus";

export function Comments(): FigNode {
  const { resolvedTheme } = useTheme(); // "dark" | "light"

  return (
    <div class="mt-10">
      <ClientOnly fallback={null}>
        <Giscus theme={resolvedTheme} />
      </ClientOnly>
    </div>
  );
}

function Giscus({ theme }: { theme: "dark" | "light" }): FigNode {
  const bindGiscus = useCallback(
    (element: HTMLDivElement, signal: AbortSignal) => {
      mountGiscus(element, theme, signal);
      return undefined;
    },
    [theme],
  );

  return <div bind={bindGiscus} />;
}
