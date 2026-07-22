import { useGT } from "gt-tanstack-start";
import { useRef, useState } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavigationLinks } from "@/components/navigation-links";
import { Squiggle } from "@/components/squiggle";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileNav() {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const gt = useGT();

  const closeMenu = () => {
    popoverRef.current?.hidePopover();
  };

  return (
    <>
      <button
        type="button"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-[min(var(--radius-md),10px)] border border-transparent bg-clip-padding text-sm font-medium transition-colors outline-none select-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-popover"
        aria-label={isOpen ? gt("Close menu") : gt("Open menu")}
        popoverTarget="mobile-menu-popover"
      >
        <span
          className={
            isOpen ? "icon-[lucide--x] size-5" : "icon-[lucide--menu] size-5"
          }
          aria-hidden="true"
        />
      </button>

      <div
        ref={popoverRef}
        id="mobile-menu-popover"
        className="fixed inset-auto top-16 end-4 m-0 w-72 rounded-sm border border-border bg-shell p-4 text-foreground shadow-lg"
        popover="auto"
        role="dialog"
        aria-label={gt("Navigation menu")}
        onToggle={(event) => {
          setIsOpen(event.newState === "open");
        }}
      >
        <nav>
          <NavigationLinks
            className="flex flex-col gap-y-0.5"
            onNavigate={closeMenu}
          />
        </nav>

        <Squiggle className="text-ink-faint my-3" />

        <LocaleSwitcher />

        <div className="border-t border-dotted border-border mt-3 pt-3 flex items-center justify-between">
          <span className="font-mono text-[11px] text-muted-foreground tracking-wider">
            &copy; Ben Gubler
          </span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
