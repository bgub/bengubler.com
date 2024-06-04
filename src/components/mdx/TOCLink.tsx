"use client";

// see https://claritydev.net/blog/nextjs-blog-remark-interactive-table-of-contents

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import type { TOCNode } from "./remark-toc";

function useHighlighted(id: string) {
  const observer = useRef<IntersectionObserver | null>(null);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      // when a header is in the top 20% or lower 20% of the viewport
      // it's not counted as visible
      rootMargin: "-20% 0% -20% 0px",
    });

    const elements = document.querySelectorAll("h2, h3, h4, h5");
    elements.forEach((elem) =>
      (observer.current as IntersectionObserver).observe(elem)
    );
    return () => observer.current?.disconnect();
  }, []);

  return [activeId === id, setActiveId];
}

export const TOCLink = ({ node }: { node: TOCNode }) => {
  const [highlighted, setHighlighted] = useHighlighted(node.id as string);

  const href = `#${node.id}`;

  return (
    <a
      href={href}
      className={cn(
        "hover:underline block hover:accent-color py-1",
        highlighted && "font-semibold"
      )}
      onClick={(e) => {
        e.preventDefault();

        const target = document.querySelector(href);

        if (!target) return;

        target.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {node.title}
    </a>
  );
};
