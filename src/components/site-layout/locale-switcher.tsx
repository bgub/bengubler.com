import { on } from "@bgub/fig-dom";
import { useGT, useLocaleSelector } from "gt-fig-tanstack-start";
import { cn } from "@/lib/utils";

type LocaleSwitcherProps = {
  class?: string;
};

export function LocaleSwitcher({ class: classValue }: LocaleSwitcherProps) {
  const { locale, locales, setLocale } = useLocaleSelector();
  const gt = useGT();

  return (
    <div class={cn("grid grid-cols-4 gap-1.5 w-full", classValue)}>
      {locales
        .toSorted((a, b) => a.localeCompare(b))
        .map((code) => {
          const active = code === locale;
          return (
            <button
              key={code}
              type="button"
              mix={on("click", () => setLocale(code))}
              class={cn(
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
