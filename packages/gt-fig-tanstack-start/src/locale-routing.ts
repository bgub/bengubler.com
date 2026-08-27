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

interface LocaleRedirectRequest {
  accept?: string | null;
  locale: string;
  method: string;
  pathname: string;
  search?: string;
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

export function getLocaleRedirectPath(
  config: LocaleRoutingConfig,
  request: LocaleRedirectRequest,
): string | undefined {
  const isDocumentRequest = request.accept?.toLowerCase().includes("text/html");
  const isDirectContentRequest =
    new URLSearchParams(request.search).has("__raw") ||
    /\.[^/]+$/.test(request.pathname);
  const hasPathLocale = findSupportedLocale(
    config.locales,
    request.pathname.split("/")[1],
  );

  if (
    !config.localeRouting ||
    request.locale === config.defaultLocale ||
    hasPathLocale ||
    (request.method !== "GET" && request.method !== "HEAD") ||
    request.pathname.startsWith("/api/") ||
    !isDocumentRequest ||
    isDirectContentRequest
  ) {
    return;
  }

  return `${localizePathname(config, request.pathname, request.locale)}${request.search ?? ""}`;
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

function getCookieValue(
  cookieHeader: string | null | undefined,
  cookieName: string,
): string | undefined {
  const cookie = cookieHeader
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${cookieName}=`));
  if (!cookie) return;

  const value = cookie.slice(cookieName.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseAcceptLanguage(header: string | null | undefined): string[] {
  return (header?.split(",") ?? [])
    .map((entry, index) => {
      const [locale = "", ...parameters] = entry
        .split(";")
        .map((value) => value.trim());
      const quality = Number(
        parameters
          .find((parameter) => parameter.toLowerCase().startsWith("q="))
          ?.slice(2) ?? 1,
      );
      return { index, locale, quality };
    })
    .filter(
      ({ locale, quality }) =>
        locale !== "" && locale !== "*" && quality > 0 && quality <= 1,
    )
    .sort((a, b) => b.quality - a.quality || a.index - b.index)
    .map(({ locale }) => locale);
}
