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
    <div class={cn("site-locale-switcher grid grid-cols-6 w-full", classValue)}>
      {locales
        .toSorted((a, b) => a.localeCompare(b))
        .map((code) => {
          const active = code === locale;
          return (
            <button
              key={code}
              type="button"
              mix={on("click", () => setLocale(code))}
              class="site-locale-option"
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
