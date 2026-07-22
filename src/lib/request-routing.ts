import {
  defaultLocale,
  getPathLocale,
  type Locale,
  localeCookieName,
} from "./locales.ts";

export function isDirectContentPath(pathname: string, search = "") {
  return new URLSearchParams(search).has("__raw") || /\.[^/]+$/.test(pathname);
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
  const url = new URL(request.url);
  const locale = getPathLocale(url.pathname);
  const directContentRequest = isDirectContentPath(url.pathname, url.search);
  if (locale || directContentRequest) {
    applyLocaleToRequest(request, locale ?? defaultLocale);
  }
  return directContentRequest;
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
