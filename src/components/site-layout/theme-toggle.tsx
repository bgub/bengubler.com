import { useGT } from "gt-tanstack-start";
import { isTheme, useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const gt = useGT();

  return (
    <div className="relative inline-flex size-9 shrink-0 items-center justify-center rounded-[min(var(--radius-md),10px)] border border-transparent bg-clip-padding transition-colors hover:bg-muted hover:text-foreground focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <span
        className="icon-[lucide--sun] pointer-events-none size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        aria-hidden="true"
      />
      <span
        className="icon-[lucide--moon] pointer-events-none absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        aria-hidden="true"
      />
      <select
        className="absolute inset-0 size-full cursor-pointer appearance-none opacity-0"
        aria-label={gt("Theme")}
        value={theme}
        onChange={(event) => {
          if (isTheme(event.target.value)) setTheme(event.target.value);
        }}
      >
        <option value="light">{gt("Light")}</option>
        <option value="dark">{gt("Dark")}</option>
        <option value="system">{gt("System")}</option>
      </select>
    </div>
  );
}
