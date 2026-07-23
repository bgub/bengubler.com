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
      <div class="w-full max-w-7xl mx-auto bg-background">
        <div class="flex min-h-screen">
          <Sidebar />
          <div class="flex-1 md:ms-64 flex flex-col bg-background">
            <header class="sticky top-0 z-40 md:hidden border-b border-border bg-shell/95 backdrop-blur supports-backdrop-filter:bg-shell/60">
              <div class="flex h-14 items-center justify-between px-4 sm:px-6">
                <Link href="/" class="flex items-center gap-3">
                  <div class="relative size-9 rounded-full overflow-hidden border border-border shrink-0">
                    <ProfileImage size={36} class="object-cover" />
                  </div>
                  <span class="font-serif text-xl font-medium translate-y-px">
                    Ben Gubler
                  </span>
                </Link>
                <MobileNav />
              </div>
            </header>
            <main class="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
