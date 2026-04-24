"use client";

import { useDefaultLocale, useLocaleSelector } from "gt-next/client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type LocaleOrbitProps = {
  className?: string;
};

const GT_LOCALE_COOKIE = "generaltranslation.locale";
const GT_RESET_COOKIE = "generaltranslation.locale-reset";

function setCookie(name: string, value: string) {
  // biome-ignore lint/suspicious/noDocumentCookie: GT middleware reads these cookies during locale redirects.
  document.cookie = `${name}=${value};path=/`;
}

function withoutLocalePrefix(pathname: string, locales: string[]) {
  const [, firstSegment] = pathname.split("/");

  if (!firstSegment || !locales.includes(firstSegment)) {
    return pathname;
  }

  return pathname.slice(firstSegment.length + 1) || "/";
}

export function LocaleOrbit({ className }: LocaleOrbitProps) {
  const pathname = usePathname();
  const defaultLocale = useDefaultLocale();
  const { locale, locales } = useLocaleSelector();

  if (!locales?.length) return null;

  const switchLocale = (nextLocale: string) => {
    if (nextLocale === locale) return;

    const sharedPathname = withoutLocalePrefix(pathname, locales);
    const nextPathname =
      nextLocale === defaultLocale
        ? sharedPathname
        : `/${nextLocale}${sharedPathname === "/" ? "" : sharedPathname}`;

    const nextUrl = new URL(window.location.href);
    nextUrl.pathname = nextPathname;

    setCookie(GT_LOCALE_COOKIE, nextLocale);
    setCookie(GT_RESET_COOKIE, "true");
    window.location.assign(nextUrl);
  };

  return (
    <div className={cn("flex gap-1.5 w-full", className)}>
      {[...locales]
        .sort((a, b) =>
          a === defaultLocale ? -1 : b === defaultLocale ? 1 : 0,
        )
        .map((code) => {
          const active = code === locale;
          return (
            <button
              key={code}
              type="button"
              onClick={() => switchLocale(code)}
              className={cn(
                "flex-1 font-mono text-[11px] tracking-wide py-1 rounded-sm border border-dashed transition-colors text-center",
                active
                  ? "border-foreground text-foreground bg-peach"
                  : "border-ink-faint text-muted-foreground hover:border-ink-mute hover:text-foreground",
              )}
              aria-pressed={active}
              aria-label={`Switch language to ${code}`}
            >
              {code.toUpperCase()}
            </button>
          );
        })}
    </div>
  );
}

export default LocaleOrbit;
