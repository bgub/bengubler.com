import dmMono400Url from "@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2?url";
import newsreaderItalicUrl from "@fontsource-variable/newsreader/files/newsreader-latin-wght-italic.woff2?url";
import newsreaderUrl from "@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2?url";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import {
  GTProvider,
  getTranslationsSnapshot,
  initializeGT,
  parseLocale,
  T,
} from "gt-tanstack-start";
import type { ReactNode } from "react";
import { Link } from "@/components/link";
import { Providers } from "@/components/providers";
import { SiteLayout } from "@/components/site-layout";
import {
  defaultLocale,
  getLocalizedPath,
  localeCookieName,
  resolveLocale,
} from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";
import { loadTranslations } from "@/loadTranslations";
import appCss from "@/styles/globals.css?url";
import gtConfig from "../../gt.config.json";

initializeGT({ ...gtConfig, loadTranslations, localeCookieName });

export const Route = createRootRoute({
  loader: async () => {
    const locale = resolveLocale(parseLocale());
    return {
      locale,
      translations: await getTranslationsSnapshot(locale),
    };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...getPageMetadata({
        title: "Page Not Found - Ben Gubler",
        description: "The page you're looking for doesn't exist.",
        locale: defaultLocale,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      ...[newsreaderUrl, newsreaderItalicUrl, dmMono400Url].map((href) => ({
        rel: "preload",
        href,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      })),
      { rel: "icon", href: "/icon.png", type: "image/png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  const { locale, translations } = Route.useLoaderData();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body>
        <GTProvider
          locale={locale}
          translations={translations}
          _reload={({ locale: nextLocale }) => {
            const path = getLocalizedPath(
              window.location.pathname,
              resolveLocale(nextLocale),
            );
            window.location.assign(
              `${path}${window.location.search}${window.location.hash}`,
            );
          }}
        >
          <Providers>{children}</Providers>
        </GTProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <SiteLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-y-6 text-center">
        <div className="space-y-4">
          <T>
            <h1 className="font-serif text-6xl font-medium text-muted-foreground">
              404
            </h1>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
              Page Not Found
            </h2>
            <p className="mx-auto max-w-md font-serif text-lg font-light leading-relaxed text-ink-soft">
              Sorry, the page you're looking for doesn't exist or has been
              moved.
            </p>
          </T>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11.5px]">
          <T>
            <Link
              href="/"
              className="border-b border-border pb-px text-ink-soft no-underline transition-colors hover:border-ink-mute hover:text-foreground"
            >
              Go Home
            </Link>
          </T>
          <span className="text-ink-faint">&middot;</span>
          <T>
            <Link
              href="/posts"
              className="border-b border-border pb-px text-ink-soft no-underline transition-colors hover:border-ink-mute hover:text-foreground"
            >
              View Posts
            </Link>
          </T>
        </div>
      </div>
    </SiteLayout>
  );
}
