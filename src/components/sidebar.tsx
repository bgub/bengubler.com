"use client";

import { useGT, useMessages } from "gt-next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocaleOrbit } from "@/components/locale-orbit";
import { Squiggle } from "@/components/squiggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { navigation } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const m = useMessages();
  const gt = useGT();

  return (
    <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-64 md:flex-col">
      <div className="flex grow flex-col overflow-y-auto bg-paper-deep border-r border-border">
        <div className="flex grow flex-col gap-y-5 px-5 py-8 md:py-10">
          {/* Profile Section */}
          <Link href="/" className="flex items-center gap-3.5 group px-1">
            <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden shrink-0 border border-border">
              <Image
                src="/bengubler.jpg"
                alt={gt("Profile photo")}
                width={52}
                height={52}
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="font-serif text-xl font-medium text-foreground leading-tight tracking-tight group-hover:text-foreground/80 transition-colors">
                Ben Gubler
              </div>
              <div className="font-mono text-[11px] text-muted-foreground mt-0">
                @bgub
              </div>
            </div>
          </Link>

          <Squiggle className="text-ink-faint" />

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-0.5">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/posts" && pathname.startsWith("/posts/")) ||
                  (item.href === "/language-learning" &&
                    pathname.startsWith("/language-learning"));
                return (
                  <li key={item.name} className="relative">
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
                    >
                      <item.icon
                        className="h-[15px] w-[15px] shrink-0 opacity-75"
                        aria-hidden="true"
                      />
                      {m(item.name)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* Theme Toggle & Locale Selector */}
        <div className="px-5 pb-5 space-y-3">
          <div className="hidden md:block">
            <LocaleOrbit className="mx-auto" />
          </div>
          <div className="border-t border-dotted border-border pt-3 flex items-center justify-between">
            <span className="font-mono text-[9.5px] text-ink-faint tracking-wider">
              &copy; Ben Gubler
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
