import type { TocNode } from "content-pipeline";
import { T } from "gt-tanstack-start";
import { useCallback, useState } from "react";
import { TOCLink } from "./toc-link";

interface ClientTOCProps {
  tree: TocNode;
}

function TOCNodeList({
  nodes,
  activeSection,
}: {
  nodes: TocNode[];
  activeSection: string;
}) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => (
        <li key={node.id}>
          <TOCLink node={node} activeSection={activeSection} />
          {node.children.length > 0 && (
            <div className="mt-0.5">
              <TOCNodeList
                nodes={node.children}
                activeSection={activeSection}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ClientTOC({ tree }: ClientTOCProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  const observeHeadings = useCallback(() => {
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

  return (
    <div className="space-y-2" ref={observeHeadings}>
      <T>
        <h3 className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          In this entry
        </h3>
      </T>
      <TOCNodeList nodes={tree.children} activeSection={activeSection} />
    </div>
  );
}
