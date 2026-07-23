import type { FigNode } from "@bgub/fig";
import type { JSX } from "@bgub/fig-dom/jsx-runtime";
import { Link as RouterLink } from "@bgub/fig-tanstack-router";
import { getLocalizedPath, resolveLocale } from "@/lib/locales";

type LinkProps = Omit<
  JSX.IntrinsicElements["a"],
  "children" | "href" | "target"
> & {
  children?: FigNode;
  href: string;
  target?: string;
};

function isDocumentLink(href: string) {
  return /\.(?:md|pdf|xml)(?:$|\?)/.test(href);
}

export function Link({ href, children, ...props }: LinkProps) {
  const external = /^(?:[a-z]+:|#)/i.test(href);

  if (external || isDocumentLink(href)) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  const localizedHref = getLocalizedPath(href, resolveLocale());

  return (
    <RouterLink
      activeOptions={{ exact: true, includeSearch: false }}
      {...props}
      to={localizedHref}
    >
      {children}
    </RouterLink>
  );
}
