import { Link } from "@/components/link";
import { Squiggle } from "@/components/squiggle";
import { LocaleSwitcher } from "./locale-switcher";
import { NavigationLinks } from "./navigation-links";
import { ProfileImage } from "./profile-image";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  return (
    <div class="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-64 md:flex-col">
      <div class="flex grow flex-col overflow-y-auto bg-shell border-r border-border">
        <div class="flex grow flex-col gap-y-5 px-5 py-8 md:py-10">
          {/* Profile Section */}
          <Link href="/" class="flex items-center gap-3.5 group px-1">
            <div class="relative size-13 rounded-full overflow-hidden shrink-0 border border-border">
              <ProfileImage size={52} class="object-cover" />
            </div>
            <div>
              <div class="font-serif text-xl font-medium text-foreground leading-tight tracking-tight group-hover:text-foreground/80 transition-colors">
                Ben Gubler
              </div>
              <div class="font-mono text-sm text-muted-foreground mt-0">
                @bgub
              </div>
            </div>
          </Link>

          <Squiggle class="text-ink-faint" />

          {/* Navigation */}
          <nav class="flex flex-1 flex-col">
            <NavigationLinks class="flex flex-1 flex-col gap-y-0.5" />
          </nav>
        </div>
        {/* Theme Toggle & Locale Selector */}
        <div class="px-5 pb-5 space-y-3">
          <LocaleSwitcher class="mx-auto" />
          <div class="border-t border-dotted border-border pt-3 flex items-center justify-between">
            <span class="font-mono text-[11px] text-muted-foreground tracking-wider">
              &copy; Ben Gubler
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
