import { type FigNode, useMemo, useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";
import { useGT } from "gt-fig-tanstack-start";
import { Squiggle } from "@/components/squiggle";
import { LocaleSwitcher } from "./locale-switcher";
import { NavigationLinks } from "./navigation-links";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav(): FigNode {
  const popoverRef = useMemo<{ current: HTMLDivElement | null }>(
    () => ({ current: null }),
    [],
  );
  const [isOpen, setIsOpen] = useState(false);
  const gt = useGT();

  const closeMenu = () => {
    popoverRef.current?.hidePopover();
  };

  return (
    <>
      <button
        type="button"
        class="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium transition-colors outline-none select-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-popover"
        aria-label={isOpen ? gt("Close menu") : gt("Open menu")}
        popovertarget="mobile-menu-popover"
      >
        <span
          class={
            isOpen ? "icon-[lucide--x] size-5" : "icon-[lucide--menu] size-5"
          }
          aria-hidden="true"
        />
      </button>

      <div
        bind={(element) => {
          popoverRef.current = element;
          return undefined;
        }}
        id="mobile-menu-popover"
        class="fixed inset-auto top-16 end-4 m-0 w-72 rounded-sm border border-border bg-shell p-4 text-foreground shadow-lg"
        popover="auto"
        role="dialog"
        aria-label={gt("Navigation menu")}
        mix={on("toggle", (event) => {
          setIsOpen(event.newState === "open");
        })}
      >
        <nav>
          <NavigationLinks
            class="flex flex-col gap-y-0.5"
            onNavigate={closeMenu}
          />
        </nav>

        <Squiggle class="text-ink-faint my-3" />

        <LocaleSwitcher />

        <div class="border-t border-dotted border-border mt-3 pt-3 flex items-center justify-between">
          <span class="font-mono text-[11px] text-muted-foreground tracking-wider">
            &copy; Ben Gubler
          </span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
