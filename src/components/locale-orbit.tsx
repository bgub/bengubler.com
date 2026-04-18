"use client";

import { useLocaleSelector } from "gt-next/client";
import { cn } from "@/lib/utils";

type LocaleOrbitProps = {
  className?: string;
};

export function LocaleOrbit({ className }: LocaleOrbitProps) {
  const { locale, locales, setLocale } = useLocaleSelector();

  if (!locales?.length) return null;

  return (
    <div className={cn("flex gap-1.5 w-full", className)}>
      {[...locales].sort((a, b) => (a === "en" ? -1 : b === "en" ? 1 : 0)).map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              "flex-1 font-mono text-[10px] tracking-wide py-1 rounded-sm border border-dashed transition-colors text-center",
              active
                ? "border-foreground text-foreground bg-peach"
                : "border-ink-faint text-muted-foreground hover:border-ink-mute hover:text-foreground",
            )}
            aria-pressed={active}
            aria-label={`Switch language to ${code}`}
          >
            {code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export default LocaleOrbit;
