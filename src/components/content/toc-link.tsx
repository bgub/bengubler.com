"use client";

import type { TocNode } from "content-pipeline";
import { cn } from "@/lib/utils";

interface TOCLinkProps {
  node: TocNode;
  activeSection?: string;
}

export function TOCLink({ node, activeSection }: TOCLinkProps) {
  const isActive = activeSection === node.id;

  const scrollToHeading = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!node.id) return;

    const element = document.getElementById(node.id);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${node.id}`);
  };

  const isSubHeading = (node.depth ?? 2) >= 3;

  return (
    <a
      href={`#${node.id}`}
      onClick={scrollToHeading}
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
      {isSubHeading ? "\u203a " : "§ "}
      {node.title}
    </a>
  );
}
