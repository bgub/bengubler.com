import { Link as RouterLink, useParams } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { defaultLocale, getLocalizedPath, isLocale } from "@/lib/locales";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children?: ReactNode;
  href: string;
};

function isDocumentLink(href: string) {
  return /\.(?:md|pdf|xml)(?:$|\?)/.test(href);
}

export function Link({ href, children, ...props }: LinkProps) {
  const params = useParams({ strict: false });
  const routeLocale = typeof params.locale === "string" ? params.locale : "";
  const locale = isLocale(routeLocale) ? routeLocale : defaultLocale;
  const external = /^(?:[a-z]+:|#)/i.test(href);

  if (external || isDocumentLink(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  const localizedHref = getLocalizedPath(href, locale);

  return (
    <RouterLink
      to={localizedHref as never}
      activeOptions={{ exact: true, includeSearch: false }}
      {...props}
    >
      {children}
    </RouterLink>
  );
}
