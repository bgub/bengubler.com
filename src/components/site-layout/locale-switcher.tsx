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
    <div class={cn("site-locale-switcher flex items-center", classValue)}>
      {locales
        .toSorted((a, b) => a.localeCompare(b))
        .map((code, index) => {
          const active = code === locale;
          return (
            <span key={code} class="inline-flex items-center gap-1">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  class="text-xs text-muted-foreground/50"
                >
                  /
                </span>
              )}
              <button
                type="button"
                mix={on("click", () => setLocale(code))}
                class="site-locale-option"
                aria-pressed={active}
                aria-label={gt("Switch language to {code}", { code })}
              >
                {code.toUpperCase()}
              </button>
            </span>
          );
        })}
    </div>
  );
}
