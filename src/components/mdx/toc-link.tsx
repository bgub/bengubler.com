"use client";

import { cn } from "@/lib/utils";
import { TOCNode } from "./remark-toc";

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
      // Update URL without triggering navigation
      window.history.replaceState(null, "", `#${node.id}`);
    }
  };

  return (
    <a
      href={`#${node.id}`}
      onClick={handleClick}
      className={cn(
        "block py-1 text-sm transition-colors hover:text-foreground",
        isActive ? "text-foreground font-medium" : "text-muted-foreground",
        node.depth === 2 && "pl-0",
        node.depth === 3 && "pl-4",
        node.depth === 4 && "pl-8",
        node.depth === 5 && "pl-12",
        node.depth === 6 && "pl-16"
      )}
    >
      {node.title}
    </a>
  );
}
