import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

export function NavigationControls({ class: classValue }: { class?: string }) {
  return (
    <div
      class={cn(
        "site-navigation-controls flex items-center gap-3 pt-3 font-serif",
        classValue,
      )}
    >
      <LocaleSwitcher class="min-w-0 flex-1" />
      <ThemeToggle />
    </div>
  );
}
