import { useMemo, useReactive, useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";
import type { TocNode } from "content-pipeline";
import { T } from "gt-fig-tanstack-start";
import { cn } from "@/lib/utils";

interface ClientTOCProps {
  tree: TocNode;
  activeSection: string;
  onNavigate: (id: string) => void;
}

function TOCLink({
  node,
  activeSection,
  onNavigate,
}: {
  node: TocNode;
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  const isActive = activeSection === node.id;
  const isSubHeading = (node.depth ?? 2) >= 3;

  const scrollToHeading = (event: MouseEvent) => {
    event.preventDefault();
    if (!node.id) return;

    const element = document.getElementById(node.id);
    if (!element) return;

    onNavigate(node.id);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${node.id}`);
  };

  return (
    <a
      href={`#${node.id}`}
      aria-current={isActive ? "location" : undefined}
      mix={on("click", scrollToHeading)}
      class={cn(
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
  onNavigate,
}: {
  nodes: TocNode[];
  activeSection: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <ul class="space-y-0.5">
      {nodes.map((node) => (
        <li key={node.id}>
          <TOCLink
            node={node}
            activeSection={activeSection}
            onNavigate={onNavigate}
          />
          {node.children.length > 0 && (
            <div class="mt-0.5">
              <TOCNodeList
                nodes={node.children}
                activeSection={activeSection}
                onNavigate={onNavigate}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function getHeadingIds(nodes: TocNode[]): string[] {
  return nodes.flatMap((node) => [
    ...(node.id ? [node.id] : []),
    ...getHeadingIds(node.children),
  ]);
}

function getActiveHeadingId(
  headings: HTMLElement[],
  activationOffset: number,
  isAtDocumentEnd: boolean,
) {
  const activeHeading = isAtDocumentEnd
    ? headings.at(-1)
    : headings.findLast(
        (heading) => heading.getBoundingClientRect().top <= activationOffset,
      );

  return activeHeading?.id ?? headings[0]?.id ?? "";
}

export function useTOCScrollspy(tree: TocNode) {
  const [activeSection, setActiveSection] = useState<string>("");
  const headingIds = useMemo(() => getHeadingIds(tree.children), [tree]);

  useReactive(
    (signal) => {
      const headings = headingIds
        .map((id) => document.getElementById(id))
        .filter((heading): heading is HTMLElement => heading !== null);
      if (headings.length === 0) return;

      let animationFrame = 0;

      const updateActiveHeading = () => {
        animationFrame = 0;

        const activationOffset =
          Number.parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 0;
        const isAtDocumentEnd =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 1;

        setActiveSection(
          getActiveHeadingId(headings, activationOffset, isAtDocumentEnd),
        );
      };

      const scheduleUpdate = () => {
        if (animationFrame) return;
        animationFrame = window.requestAnimationFrame(updateActiveHeading);
      };

      updateActiveHeading();
      signal.addEventListener("abort", () => {
        window.cancelAnimationFrame(animationFrame);
      });
      window.addEventListener("scroll", scheduleUpdate, {
        passive: true,
        signal,
      });
      window.addEventListener("resize", scheduleUpdate, { signal });
      return undefined;
    },
    [headingIds],
  );

  return {
    activeSection,
    onNavigate: setActiveSection,
  };
}

export function ClientTOC({ tree, activeSection, onNavigate }: ClientTOCProps) {
  if (!tree.children.length) {
    return null;
  }

  return (
    <div class="space-y-2">
      <T>
        <h3 class="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          In this entry
        </h3>
      </T>
      <TOCNodeList
        nodes={tree.children}
        activeSection={activeSection}
        onNavigate={onNavigate}
      />
    </div>
  );
}
