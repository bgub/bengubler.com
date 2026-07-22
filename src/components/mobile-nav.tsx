import { Popover } from "@base-ui/react/popover";
import { useGT, useLocale, useMessages } from "gt-react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@/components/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Squiggle } from "@/components/squiggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/navigation";
import { usePathname } from "@/lib/router";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const rawPathname = usePathname();
  const locale = useLocale();
  const pathname =
    rawPathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
  const m = useMessages();
  const gt = useGT();

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={`size-9 p-0 transition-colors ${
              isOpen ? "bg-accent text-foreground" : ""
            }`}
            aria-label={isOpen ? gt("Close menu") : gt("Open menu")}
          />
        }
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner side="bottom" align="end" sideOffset={12}>
          <Popover.Popup
            id="mobile-menu-popover"
            className="z-50 w-72 rounded-sm border border-border bg-shell p-4 shadow-lg"
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
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon
                        className="size-3.75 shrink-0 opacity-75"
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
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
