import { getCookieValue, parseAcceptLanguage } from "gt-i18n/internal";

export interface LocaleRoutingConfig {
  defaultLocale: string;
  localeCookieName: string;
  localeRouting: boolean;
  locales: readonly string[];
}

interface LocaleRequest {
  acceptLanguage?: string | null;
  cookie?: string | null;
  pathname: string;
}

export function resolveRequestLocale(
  config: LocaleRoutingConfig,
  request: LocaleRequest,
): string {
  const pathLocale = config.localeRouting
    ? request.pathname.split("/")[1]
    : undefined;
  return resolveSupportedLocale(config, [
    pathLocale,
    getCookieValue(request.cookie, config.localeCookieName),
    ...parseAcceptLanguage(request.acceptLanguage),
  ]);
}

export function resolveSupportedLocale(
  config: LocaleRoutingConfig,
  candidates: string | readonly (string | undefined)[] | undefined,
): string {
  const values = typeof candidates === "string" ? [candidates] : candidates;
  for (const candidate of values ?? []) {
    if (!candidate) continue;
    const locale = findSupportedLocale(config.locales, candidate);
    if (locale) return locale;
  }
  return config.defaultLocale;
}

export function localizePathname(
  config: LocaleRoutingConfig,
  pathname: string,
  locale: string,
): string {
  if (!config.localeRouting) return pathname;

  const segments = pathname.split("/");
  if (findSupportedLocale(config.locales, segments[1])) segments.splice(1, 1);
  const unlocalizedPath = segments.join("/") || "/";
  return locale === config.defaultLocale
    ? unlocalizedPath
    : `/${locale}${unlocalizedPath === "/" ? "" : unlocalizedPath}`;
}

export function serializeLocaleCookie(
  config: LocaleRoutingConfig,
  locale: string,
): string {
  return `${config.localeCookieName}=${encodeURIComponent(locale)}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function findSupportedLocale(
  locales: readonly string[],
  candidate: string | undefined,
): string | undefined {
  if (!candidate) return undefined;
  const normalizedCandidate = candidate.toLowerCase();
  const exact = locales.find(
    (locale) => locale.toLowerCase() === normalizedCandidate,
  );
  if (exact) return exact;

  const language = normalizedCandidate.split("-")[0];
  return locales.find(
    (locale) => locale.split("-")[0]?.toLowerCase() === language,
  );
}
