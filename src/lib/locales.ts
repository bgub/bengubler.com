import { getLocale } from "gt-fig-tanstack-start";
import { defaultLocale, localeCookieName, locales } from "./locale-config.ts";

export { defaultLocale, localeCookieName, locales };

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function resolveLocale(): Locale {
  const locale = getLocale();
  return isLocale(locale) ? locale : defaultLocale;
}

export function getPathLocale(pathname: string) {
  const segment = pathname.split("/")[1];
  return segment && isLocale(segment) ? segment : undefined;
}

export function getUnlocalizedPath(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const locale = getPathLocale(normalizedPath);
  if (!locale) return normalizedPath;
  return normalizedPath.slice(locale.length + 1) || "/";
}

export function getLocalizedPath(path: string, locale: Locale) {
  const unlocalizedPath = getUnlocalizedPath(path);
  if (locale === defaultLocale) return unlocalizedPath;
  return `/${locale}${unlocalizedPath === "/" ? "" : unlocalizedPath}`;
}
