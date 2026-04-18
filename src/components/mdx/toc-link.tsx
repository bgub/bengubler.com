"use client";

import { cn } from "@/lib/utils";
import type { TOCNode } from "./remark-toc";

interface TOCLinkProps {
  node: TOCNode;
  activeSection?: string;
}

export function TOCLink({ node, activeSection }: TOCLinkProps) {
  const isActive = activeSection === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!node.id) return;
    const element = document.getElementById(node.id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", `#${node.id}`);
    }
  };

  const isSubHeading = (node.depth || 2) >= 3;

  return (
    <a
      href={`#${node.id}`}
      onClick={handleClick}
      className={cn(
        "block py-0.5 font-serif text-[13px] leading-relaxed transition-colors hover:text-foreground no-underline",
        isSubHeading && "pl-2.5 text-ink-mute",
        isActive
          ? "text-foreground font-medium"
          : isSubHeading
            ? "text-ink-mute"
            : "text-ink-soft font-light",
      )}
    >
      {isSubHeading ? "— " : "§ "}
      {node.title}
    </a>
  );
}
