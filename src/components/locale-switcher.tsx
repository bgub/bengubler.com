"use client";

import { useGT, useLocaleSelector } from "gt-next";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  className?: string;
};

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const { locale, locales, setLocale } = useLocaleSelector();
  const gt = useGT();

  if (!locales?.length) return null;

  return (
    <div className={cn("grid grid-cols-4 gap-1.5 w-full", className)}>
      {locales
        .toSorted((a, b) => a.localeCompare(b))
        .map((code) => {
          const active = code === locale;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={cn(
                "font-mono text-[11px] tracking-wide py-1 rounded-sm border border-dashed transition-colors text-center",
                active
                  ? "border-foreground text-foreground bg-peach"
                  : "border-ink-faint text-muted-foreground hover:border-ink-mute hover:text-foreground",
              )}
              aria-pressed={active}
              aria-label={gt("Switch language to {code}", { code })}
            >
              {code.toUpperCase()}
            </button>
          );
        })}
    </div>
  );
}
