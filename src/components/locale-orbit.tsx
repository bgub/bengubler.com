"use client";

import { useGT } from "gt-next";
import { useDefaultLocale, useLocaleSelector } from "gt-next/client";
import { cn } from "@/lib/utils";

type LocaleOrbitProps = {
  className?: string;
};

export function LocaleOrbit({ className }: LocaleOrbitProps) {
  const defaultLocale = useDefaultLocale();
  const { locale, locales, setLocale } = useLocaleSelector();
  const gt = useGT();

  if (!locales?.length) return null;

  return (
    <div className={cn("flex gap-1.5 w-full", className)}>
      {locales
        .toSorted((a, b) =>
          a === defaultLocale ? -1 : b === defaultLocale ? 1 : 0,
        )
        .map((code) => {
          const active = code === locale;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={cn(
                "flex-1 font-mono text-[11px] tracking-wide py-1 rounded-sm border border-dashed transition-colors text-center",
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
