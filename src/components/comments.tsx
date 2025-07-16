"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function Comments() {
  const { resolvedTheme } = useTheme(); // "dark" | "light"

  return (
    <div className="mt-10">
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
    </div>
  );
}
