import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { parseLocale } from "gt-tanstack-start";
import { SiteLayout } from "@/components/site-layout/site-layout";
import {
  defaultLocale,
  getLocalizedPath,
  getUnlocalizedPath,
  isLocale,
  resolveLocale,
} from "@/lib/locales";
import { isDirectContentPath } from "@/lib/request-routing";

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
      const locale = resolveLocale(parseLocale());
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
      <Outlet />
    </SiteLayout>
  );
}
