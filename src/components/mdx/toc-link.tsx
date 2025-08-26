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

  const getHeadingStyles = (depth: number) => {
    switch (depth) {
      case 1:
        return {
          padding: "pl-0",
          text: "text-base font-semibold",
        };
      case 2:
        return {
          padding: "pl-0",
          text: "text-sm font-medium",
        };
      case 3:
        return {
          padding: "pl-4",
          text: "text-sm",
        };
      case 4:
        return {
          padding: "pl-8",
          text: "text-xs",
        };
      case 5:
        return {
          padding: "pl-12",
          text: "text-xs opacity-80",
        };
      case 6:
        return {
          padding: "pl-16",
          text: "text-xs opacity-60",
        };
      default:
        return {
          padding: "pl-0",
          text: "text-sm",
        };
    }
  };

  const styles = getHeadingStyles(node.depth || 2);

  return (
    <a
      href={`#${node.id}`}
      onClick={handleClick}
      className={cn(
        "block py-1 transition-colors hover:text-foreground leading-relaxed",
        isActive ? "text-foreground font-medium" : "text-muted-foreground",
        styles.padding,
        styles.text
      )}
    >
      {node.title}
    </a>
  );
}
