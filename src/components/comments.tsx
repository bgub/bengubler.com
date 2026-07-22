import Giscus from "@giscus/react";
import { ClientOnly } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";

export function Comments() {
  const { resolvedTheme } = useTheme(); // "dark" | "light"

  return (
    <div className="mt-10">
      <ClientOnly fallback={null}>
        <Giscus
          repo="bgub/bengubler.com"
          repoId="R_kgDOMDxe6w"
          category="Comments"
          categoryId="DIC_kwDOMDxe684CrcJf"
          mapping="pathname"
          strict="1"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={resolvedTheme}
          lang="en"
          loading="lazy"
        />
      </ClientOnly>
    </div>
  );
}
