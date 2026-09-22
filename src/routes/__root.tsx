import { dataResource, type FigNode, readData } from "@bgub/fig";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouter,
} from "@bgub/fig-tanstack-router";
import { StartScripts, type StartDataContext } from "@bgub/fig-tanstack-start";
import piazzollaCyrillicUrl from "@fontsource-variable/piazzolla/files/piazzolla-cyrillic-wght-normal.woff2?url";
import piazzollaLatinExtUrl from "@fontsource-variable/piazzolla/files/piazzolla-latin-ext-wght-normal.woff2?url";
import piazzollaLatinUrl from "@fontsource-variable/piazzolla/files/piazzolla-latin-wght-normal.woff2?url";
import notoNaskhArabicUrl from "@fontsource/noto-naskh-arabic/files/noto-naskh-arabic-arabic-400-normal.woff2?url";
import {
  GTProvider,
  getTranslations,
  initializeGT,
  T,
} from "gt-fig-tanstack-start";
import { Link } from "@/components/link";
import { NotFoundPanel } from "@/components/not-found-panel";
import { SiteLayout } from "@/components/site-layout/site-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, getPathLocale, localeCookieName } from "@/lib/locales";
import type { Locale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";
import { loadTranslations } from "@/loadTranslations";
import gtConfig from "../../gt.config.json";
import appCss from "@/styles/globals.css?url";

initializeGT({
  ...gtConfig,
  loadTranslations,
  localeCookieName,
});

const translationsResource = dataResource({
  key: (locale: Locale) => ["translations", locale],
  load: (locale: Locale) => getTranslations(locale),
});

export const Route = createRootRouteWithContext<StartDataContext>()({
  beforeLoad: ({ location }) => ({
    locale: getPathLocale(location.pathname) ?? defaultLocale,
  }),
  loader: async ({ context }) => {
    await context.data.ensureData(translationsResource, context.locale);
  },
  head: ({ match }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      ...getPageMetadata({
        title: "Page Not Found - Ben Gubler",
        description: "The page you're looking for doesn't exist.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preload",
        href: getPrimaryFontUrl(match.context.locale),
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous" as const,
      },
      { rel: "icon", href: "/icon.png", type: "image/png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function getPrimaryFontUrl(locale: Locale | undefined): string {
  if (locale === "ar") return notoNaskhArabicUrl;
  if (locale === "ru") return piazzollaCyrillicUrl;
  if (locale && locale !== defaultLocale) return piazzollaLatinExtUrl;
  return piazzollaLatinUrl;
}

function RootComponent(): FigNode {
  const { locale } = Route.useRouteContext();
  const router = useRouter();
  const translations = readData(translationsResource, locale);

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
          navigate={(href) => router.navigate({ href })}
        >
          <ThemeProvider>
            <Outlet />
          </ThemeProvider>
        </GTProvider>
        <StartScripts />
      </body>
    </html>
  );
}

function NotFound(): FigNode {
  return (
    <SiteLayout>
      <NotFoundPanel
        title={<T>Page Not Found</T>}
        description={
          <T>
            Sorry, the page you're looking for doesn't exist or has been moved.
          </T>
        }
      >
        <T>
          <Link
            href="/"
            class="border-b border-border pb-px text-ink-soft no-underline transition-colors hover:border-ink-mute hover:text-foreground"
          >
            Go Home
          </Link>
        </T>
        <span class="text-ink-faint">&middot;</span>
        <T>
          <Link
            href="/posts"
            class="border-b border-border pb-px text-ink-soft no-underline transition-colors hover:border-ink-mute hover:text-foreground"
          >
            View Posts
          </Link>
        </T>
      </NotFoundPanel>
    </SiteLayout>
  );
}
