import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import type { ReactNode } from "react";
import { Link } from "@/components/link";
import { MobileNav } from "./mobile-nav";
import { ProfileImage } from "./profile-image";
import { Sidebar } from "./sidebar";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="w-full max-w-7xl mx-auto bg-background">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 md:ms-64 flex flex-col bg-background">
            <header className="sticky top-0 z-40 md:hidden border-b border-border bg-shell/95 backdrop-blur supports-backdrop-filter:bg-shell/60">
              <div className="flex h-14 items-center justify-between px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-3">
                  <div className="relative size-9 rounded-full overflow-hidden border border-border shrink-0">
                    <ProfileImage size={36} className="object-cover" />
                  </div>
                  <span className="font-serif text-xl font-medium translate-y-px">
                    Ben Gubler
                  </span>
                </Link>
                <MobileNav />
              </div>
            </header>
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <div className="mb-16">{children}</div>
            </main>
          </div>
        </div>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
