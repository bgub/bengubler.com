import type { TocNode } from "content-pipeline";
import { T } from "gt-tanstack-start";
import { type MouseEvent, useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface ClientTOCProps {
  tree: TocNode;
}

function TOCLink({
  node,
  activeSection,
}: {
  node: TocNode;
  activeSection: string;
}) {
  const isActive = activeSection === node.id;
  const isSubHeading = (node.depth ?? 2) >= 3;

  const scrollToHeading = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (!node.id) return;

    const element = document.getElementById(node.id);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${node.id}`);
  };

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
