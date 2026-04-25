import type { Metadata } from "next";
import { DM_Mono, Newsreader } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { MobileNav } from "@/components/mobile-nav";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GTProvider } from "gt-next";
import { getGT, getLocale } from "gt-next/server";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});
const dmMono = DM_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();

  return {
    title: {
      default: "Ben Gubler",
      template: "%s - Ben Gubler",
    },
    description: gt(
      "Ben Gubler's personal website. Working at General Translation, previously interned at Vercel. Studying AI and human languages at BYU. Thoughts on web development, AI, and building things that matter.",
    ),
    authors: [{ name: "Ben Gubler", url: "https://bengubler.com" }],
    metadataBase: new URL("https://bengubler.com"),
    openGraph: {
      siteName: "Ben Gubler",
    },
    twitter: {
      card: "summary_large_image",
      creator: "@bgub_",
    },
    robots: {
      googleBot: {
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gt = await getGT();
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html suppressHydrationWarning lang={locale} dir={dir}>
      <body className={`${newsreader.variable} ${dmMono.variable}`}>
        <GTProvider locale={locale}>
          <Providers>
            {/* Outermost wrapper for max-width and centering */}
            <div className="w-full max-w-screen-xl mx-auto bg-background">
              <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 md:ms-64 flex flex-col bg-background">
                  {/* Mobile Header */}
                  <header className="sticky top-0 z-40 md:hidden border-b border-border bg-paper-deep/95 backdrop-blur supports-[backdrop-filter]:bg-paper-deep/60">
                    <div className="flex h-14 items-center justify-between px-4 sm:px-6">
                      <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border shrink-0">
                          <Image
                            src="/bengubler.jpg"
                            alt={gt("Profile photo")}
                            width={36}
                            height={36}
                            className="object-cover"
                            priority
                          />
                        </div>
                        <span className="font-serif text-xl font-medium translate-y-px">
                          Ben Gubler
                        </span>
                      </Link>
                      <MobileNav />
                    </div>
                  </header>
                  {/* Page Content Wrapper */}
                  <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="mb-16">{children}</div>
                  </main>
                </div>
              </div>
            </div>
          </Providers>
        </GTProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
