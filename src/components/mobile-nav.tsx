import { useGT, useMessages } from "gt-tanstack-start";
import { useRef, useState } from "react";
import { Link } from "@/components/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Squiggle } from "@/components/squiggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { getUnlocalizedPath } from "@/lib/locales";
import { navigation } from "@/lib/navigation";
import { usePathname } from "@/lib/router";

export function MobileNav() {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const rawPathname = usePathname();
  const pathname = getUnlocalizedPath(rawPathname);
  const m = useMessages();
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
        <nav className="flex flex-col gap-y-0.5">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/posts" && pathname.startsWith("/posts/")) ||
              (item.href === "/language-learning" &&
                pathname.startsWith("/language-learning"));
            return (
              <div key={item.name} className="relative">
                {item.isSubItem && (
                  <div className="absolute inset-s-2 top-0 h-1/2 w-px bg-border/70" />
                )}
                {item.isSubItem && (
                  <div className="absolute inset-s-2 top-1/2 w-4 h-px bg-border/70" />
                )}
                <Link
                  href={item.href}
                  className={`group flex items-center gap-x-2.5 rounded-sm px-2.5 py-2 text-sm font-sans leading-tight transition-all duration-100 ${
                    item.isSubItem ? "ms-4" : ""
                  } ${
                    isActive
                      ? "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                      : "text-ink-soft hover:bg-rule-soft"
                  }`}
                  onClick={closeMenu}
                >
                  <span
                    className={`${item.icon} size-3.75 shrink-0 opacity-75`}
                    aria-hidden="true"
                  />
                  {m(item.name)}
                </Link>
              </div>
            );
          })}
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
