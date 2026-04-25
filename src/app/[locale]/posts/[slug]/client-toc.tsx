"use client";

import { T } from "gt-next";
import { useEffect, useState } from "react";
import type { TOCNode } from "@/components/mdx/remark-toc";
import { TOCLink } from "@/components/mdx/toc-link";

interface ClientTOCProps {
  tree: TOCNode;
}

export function ClientTOC({ tree }: ClientTOCProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      },
    );

    const headings = document.querySelectorAll(
      "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
    );
    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, []);

  if (!tree.children.length) {
    return null;
  }

  const renderTOCNodes = (nodes: TOCNode[], depth = 0) => {
    return (
      <ul className="space-y-0.5">
        {nodes.map((node) => (
          <li key={node.id}>
            <TOCLink node={node} activeSection={activeSection} />
            {node.children.length > 0 && (
              <div className="mt-0.5">
                {renderTOCNodes(node.children, depth + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-2">
      <T>
        <h3 className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          In this entry
        </h3>
      </T>
      {renderTOCNodes(tree.children)}
    </div>
  );
}
