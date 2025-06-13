"use client";

import { MobileThemeToggle } from "@/components/mobile-theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Code,
  FileText,
  FolderOpen,
  Home,
  Languages,
  Mail,
  Menu,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  {
    name: "My Stack",
    href: "/about/my-stack",
    icon: Code,
    isSubItem: true,
    parent: "About",
  },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  {
    name: "Language Learning",
    href: "/language-learning",
    icon: Languages,
    isSubItem: true,
    parent: "Projects",
  },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Contact", href: "/contact", icon: Mail },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        // Check if the click is on a dropdown menu item
        const target = event.target as Element;
        if (
          target.closest('[role="menuitem"]') ||
          target.closest("[data-radix-collection-item]")
        ) {
          return; // Don't close if clicking on dropdown items
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
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
      </Button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          id="mobile-menu-popover"
          className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border/40 bg-background p-4 shadow-lg"
        >
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/posts" && pathname.startsWith("/posts/"));
              return (
                <div key={item.name} className="relative">
                  {item.isSubItem && (
                    <div className="absolute left-2 top-0 h-1/2 w-px bg-border/70"></div>
                  )}
                  {item.isSubItem && (
                    <div className="absolute left-2 top-1/2 w-4 h-px bg-border/70"></div>
                  )}
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      item.isSubItem ? "ml-6" : ""
                    } ${
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Theme Toggle - Bottom */}
          <div className="flex justify-start pt-4 mt-4 border-t border-border/40">
            <MobileThemeToggle onThemeChange={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
