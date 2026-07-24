import { ViewTransition } from "@bgub/fig";
import { enableViewTransitions } from "@bgub/fig-dom/view-transitions";
import { createFileRoute } from "@tanstack/solid-router";
import { notFound, Outlet, redirect } from "@tanstack/solid-router";
import { SiteLayout } from "@/components/site-layout/site-layout";
import {
  defaultLocale,
  getLocalizedPath,
  getUnlocalizedPath,
  isLocale,
  resolveLocale,
} from "@/lib/locales";
import { isDirectContentPath } from "@/lib/request-routing";

enableViewTransitions();

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params, location }) => {
    if (params.locale === defaultLocale) {
      throw redirect({
        href: location.href.replace(
          location.pathname,
          getUnlocalizedPath(location.pathname),
        ),
        statusCode: 308,
      });
    }
    if (params.locale && !isLocale(params.locale)) throw notFound();
    if (
      !params.locale &&
      !isDirectContentPath(location.pathname, location.searchStr)
    ) {
      const locale = resolveLocale();
      if (locale !== defaultLocale) {
        throw redirect({
          href: location.href.replace(
            location.pathname,
            getLocalizedPath(location.pathname, locale),
          ),
          statusCode: 307,
        });
      }
    }
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  return (
    <SiteLayout>
      <ViewTransition name="route-content" update="auto">
        <Outlet />
      </ViewTransition>
    </SiteLayout>
  );
}
