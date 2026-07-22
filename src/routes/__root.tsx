import dmMono300Url from "@fontsource/dm-mono/files/dm-mono-latin-300-normal.woff2?url";
import dmMono400Url from "@fontsource/dm-mono/files/dm-mono-latin-400-normal.woff2?url";
import dmMono500Url from "@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff2?url";
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
} from "gt-tanstack-start";
import type { ReactNode } from "react";
import { PageNotFound } from "@/components/not-found-page";
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
      ...[
        newsreaderUrl,
        newsreaderItalicUrl,
        dmMono300Url,
        dmMono400Url,
        dmMono500Url,
      ].map((href) => ({
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
      <PageNotFound />
    </SiteLayout>
  );
}
