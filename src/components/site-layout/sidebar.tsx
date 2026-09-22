import { Link } from "@/components/link";
import { NavigationControls } from "./navigation-controls";
import { NavigationLinks } from "./navigation-links";
import { ProfileImage } from "./profile-image";

export function Sidebar() {
  return (
    <div class="site-sidebar hidden md:fixed md:inset-y-0 md:z-50 md:flex md:flex-col">
      <div class="site-sidebar-panel flex grow flex-col overflow-y-auto">
        <div class="site-sidebar-body flex grow flex-col gap-y-8 pb-10">
          {/* Profile Section */}
          <Link
            href="/"
            class="site-sidebar-profile flex items-center gap-3.5 group"
          >
            <div class="site-profile-photo relative overflow-hidden shrink-0">
              <ProfileImage size={60} class="object-cover" />
            </div>
            <div>
              <div class="site-profile-name leading-tight group-hover:text-foreground/80 transition-colors">
                Ben Gubler
              </div>
              <div class="site-profile-handle">@bgub</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav class="flex flex-1 flex-col">
            <NavigationLinks class="site-sidebar-navigation flex flex-1 flex-col" />
          </nav>
        </div>
        {/* Theme Toggle & Locale Selector */}
        <NavigationControls class="site-sidebar-footer" />
      </div>
    </div>
  );
}
