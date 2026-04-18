"use client";

import { useGT, useMessages } from "gt-next";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LocaleOrbit } from "@/components/locale-orbit";
import { Squiggle } from "@/components/squiggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { navigation } from "@/lib/navigation";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const m = useMessages();
  const gt = useGT();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        const target = event.target as Element;
        if (
          target.closest('[role="menuitem"]') ||
          target.closest("[data-slot]")
        ) {
          return;
        }
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 w-9 p-0 transition-colors ${
          isOpen ? "bg-accent text-foreground" : ""
        }`}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-popover"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">
          {isOpen ? gt("Close menu") : gt("Open menu")}
        </span>
      </Button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          id="mobile-menu-popover"
          className="absolute end-0 top-12 z-50 w-72 rounded-sm border border-border bg-paper-deep p-4 shadow-lg"
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
                    <div className="absolute start-2 top-0 h-1/2 w-px bg-border/70" />
                  )}
                  {item.isSubItem && (
                    <div className="absolute start-2 top-1/2 w-4 h-px bg-border/70" />
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
                      className="h-[15px] w-[15px] shrink-0 opacity-75"
                      aria-hidden="true"
                    />
                    {m(item.name)}
                  </Link>
                </div>
              );
            })}
          </nav>

          <Squiggle className="text-ink-faint my-3" />

          <LocaleOrbit />

          <div className="border-t border-dotted border-border mt-3 pt-3 flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground tracking-wider">
              &copy; Ben Gubler
            </span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </div>
  );
}
