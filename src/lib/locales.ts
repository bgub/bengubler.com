import { getLocale } from "gt-tanstack-start";

export const locales = ["en", "ar", "ru", "cs", "sk", "eo"] as const;
export const defaultLocale = "en";
export const localeCookieName = "generaltranslation.locale";

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function resolveLocale(): Locale {
  return getLocale() as Locale;
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
