import {
  defaultLocale,
  getLocalizedPath,
  getPathLocale,
  getUnlocalizedPath,
  type Locale,
  localeCookieName,
} from "./locales.ts";

export function isDocumentRequest(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.has("__raw") || /\.[^/]+$/.test(url.pathname);
}

export function getDefaultLocaleRedirect(request: Request) {
  const url = new URL(request.url);
  if (getPathLocale(url.pathname) !== defaultLocale) return undefined;
  url.pathname = getUnlocalizedPath(url.pathname);
  return url;
}

export function getLocaleRedirect(request: Request, locale: Locale) {
  if (isDocumentRequest(request)) return undefined;
  const url = new URL(request.url);
  if (getPathLocale(url.pathname)) return undefined;
  if (locale === defaultLocale) return undefined;
  url.pathname = getLocalizedPath(url.pathname, locale);
  return url;
}

function applyLocaleToRequest(request: Request, locale: Locale) {
  const cookies = (request.headers.get("cookie") ?? "")
    .split(";")
    .map((cookie) => cookie.trim())
    .filter((cookie) => cookie && !cookie.startsWith(`${localeCookieName}=`));
  request.headers.set(
    "Cookie",
    [`${localeCookieName}=${locale}`, ...cookies].join("; "),
  );
}

export function applyRouteLocaleToRequest(request: Request) {
  const locale = getPathLocale(new URL(request.url).pathname);
  const documentRequest = isDocumentRequest(request);
  if (locale || documentRequest) {
    applyLocaleToRequest(request, locale ?? defaultLocale);
  }
  return documentRequest;
}

type CookieHeaders = Pick<Headers, "append" | "delete" | "getSetCookie">;

export function removeLocaleCookie(headers: CookieHeaders) {
  const cookies = headers.getSetCookie();
  const localeCookiePrefix = `${localeCookieName}=`;
  if (!cookies.some((cookie) => cookie.startsWith(localeCookiePrefix))) return;

  headers.delete("Set-Cookie");
  for (const cookie of cookies) {
    if (!cookie.startsWith(localeCookiePrefix)) {
      headers.append("Set-Cookie", cookie);
    }
  }
}
