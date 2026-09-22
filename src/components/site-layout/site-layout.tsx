import { type FigNode, useReactive } from "@bgub/fig";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { Link } from "@/components/link";
import { MobileNav } from "./mobile-nav";
import { ProfileImage } from "./profile-image";
import { Sidebar } from "./sidebar";

export function SiteLayout({ children }: { children: FigNode }): FigNode {
  return (
    <>
      <div class="site-frame w-full max-w-7xl mx-auto bg-background">
        <div class="flex min-h-screen">
          <Sidebar />
          <div class="site-content flex-1 flex flex-col bg-background">
            <header class="site-mobile-header sticky top-0 z-40 md:hidden backdrop-blur">
              <div class="flex h-14 items-center justify-between px-4 sm:px-6">
                <Link
                  href="/"
                  class="site-mobile-profile flex items-center gap-3"
                >
                  <div class="site-mobile-photo relative size-9 overflow-hidden shrink-0">
                    <ProfileImage size={36} class="object-cover" />
                  </div>
                  <span class="site-mobile-name translate-y-px">
                    Ben Gubler
                  </span>
                </Link>
                <MobileNav />
              </div>
            </header>
            <main class="site-main flex-1 w-full px-4 sm:px-6 lg:px-8 py-10">
              <div class="mb-16">{children}</div>
            </main>
          </div>
        </div>
      </div>
      <Telemetry />
    </>
  );
}

function Telemetry(): null {
  useReactive(() => {
    inject();
    injectSpeedInsights();
    return undefined;
  }, []);
  return null;
}
