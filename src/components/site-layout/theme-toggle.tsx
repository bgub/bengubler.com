import { on } from "@bgub/fig-dom";
import { msg, useGT, useMessages } from "gt-fig-tanstack-start";
import { type Theme, useTheme } from "@/components/theme-provider";

const themeOptions: Array<{
  icon: string;
  label: ReturnType<typeof msg>;
  value: Theme;
}> = [
  { value: "light", label: msg("Light"), icon: "icon-[lucide--sun]" },
  { value: "dark", label: msg("Dark"), icon: "icon-[lucide--moon]" },
  { value: "system", label: msg("System"), icon: "icon-[lucide--monitor]" },
];

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const gt = useGT();
  const m = useMessages();

  return (
    <details class="theme-picker relative shrink-0">
      <summary
        class="theme-picker-trigger inline-flex size-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-muted"
        aria-label={gt("Theme")}
      >
        <span
          class={`${themeOptions.find((option) => option.value === theme)?.icon ?? "icon-[lucide--monitor]"} size-[1.05rem]`}
          aria-hidden="true"
        />
      </summary>

      <div class="theme-picker-menu absolute end-0 bottom-11 z-50 w-36 border border-border bg-background p-1 text-foreground shadow-lg">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            class={`theme-picker-option flex w-full items-center gap-2 px-2.5 py-2 text-start font-serif text-xs transition-colors ${theme === option.value ? "theme-picker-option-active" : ""}`}
            aria-pressed={theme === option.value}
            mix={on("click", (event) => {
              setTheme(option.value);
              const details = event.currentTarget.closest("details");
              if (details) details.open = false;
            })}
          >
            <span class={`${option.icon} size-3.5`} aria-hidden="true" />
            {m(option.label)}
          </button>
        ))}
      </div>
    </details>
  );
}
