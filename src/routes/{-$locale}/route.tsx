import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { defaultLocale, getUnlocalizedPath, isLocale } from "@/lib/locales";

export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: async ({ params, location }) => {
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
