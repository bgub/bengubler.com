"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const Giscus = dynamic(() => import("@giscus/react"), { ssr: false });

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
