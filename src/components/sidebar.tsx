import { Link } from "@/components/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavigationLinks } from "@/components/navigation-links";
import { ProfileImage } from "@/components/profile-image";
import { Squiggle } from "@/components/squiggle";
import { ThemeToggle } from "@/components/theme-toggle";

export function Sidebar() {
  return (
    <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-64 md:flex-col">
      <div className="flex grow flex-col overflow-y-auto bg-shell border-r border-border">
        <div className="flex grow flex-col gap-y-5 px-5 py-8 md:py-10">
          {/* Profile Section */}
          <Link href="/" className="flex items-center gap-3.5 group px-1">
            <div className="relative size-13 rounded-full overflow-hidden shrink-0 border border-border">
              <ProfileImage size={52} className="object-cover" priority />
            </div>
            <div>
              <div className="font-serif text-xl font-medium text-foreground leading-tight tracking-tight group-hover:text-foreground/80 transition-colors">
                Ben Gubler
              </div>
              <div className="font-mono text-sm text-muted-foreground mt-0">
                @bgub
              </div>
            </div>
          </Link>

          <Squiggle className="text-ink-faint" />

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <NavigationLinks className="flex flex-1 flex-col gap-y-0.5" />
          </nav>
        </div>
        {/* Theme Toggle & Locale Selector */}
        <div className="px-5 pb-5 space-y-3">
          <div className="hidden md:block">
            <LocaleSwitcher className="mx-auto" />
          </div>
          <div className="border-t border-dotted border-border pt-3 flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground tracking-wider">
              &copy; Ben Gubler
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
