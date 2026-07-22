import assert from "node:assert/strict";
import test from "node:test";
import {
  getLocalizedPath,
  getPathLocale,
  getUnlocalizedPath,
} from "./locales.ts";
import {
  applyRouteLocaleToRequest,
  getDefaultLocaleRedirect,
  getLocaleRedirect,
  removeLocaleCookie,
} from "./request-routing.ts";

function request(path: string, headers?: HeadersInit) {
  return new Request(`https://bengubler.com${path}`, { headers });
}

test("parses and removes locale path prefixes", () => {
  assert.equal(getPathLocale("/ru/about"), "ru");
  assert.equal(getPathLocale("/about"), undefined);
  assert.equal(getUnlocalizedPath("/ru/about"), "/about");
  assert.equal(getUnlocalizedPath("/en"), "/");
});

test("replaces an existing locale path prefix", () => {
  assert.equal(getLocalizedPath("/ru/about", "cs"), "/cs/about");
  assert.equal(getLocalizedPath("/ru/about", "en"), "/about");
});

test("copies an explicit path locale into the request for GT", () => {
  const localizedRequest = request("/ru/about", {
    cookie: "session=value; generaltranslation.locale=cs",
  });
  applyRouteLocaleToRequest(localizedRequest);
  assert.equal(
    localizedRequest.headers.get("cookie"),
    "generaltranslation.locale=ru; session=value",
  );
});

test("pins unprefixed document requests to the default locale", () => {
  const documentRequest = request("/rss.xml", {
    cookie: "generaltranslation.locale=ru",
  });
  assert.equal(applyRouteLocaleToRequest(documentRequest), true);
  assert.equal(
    documentRequest.headers.get("cookie"),
    "generaltranslation.locale=en",
  );
});

test("redirects an explicit default-locale prefix", () => {
  assert.equal(
    getDefaultLocaleRedirect(request("/en/rss.xml?from=test"))?.toString(),
    "https://bengubler.com/rss.xml?from=test",
  );
  assert.equal(getDefaultLocaleRedirect(request("/ru/about")), undefined);
});

test("redirects unprefixed pages to the preferred locale", () => {
  assert.equal(
    getLocaleRedirect(request("/about?from=test"), "ru")?.toString(),
    "https://bengubler.com/ru/about?from=test",
  );
});

test("does not redirect default-locale or document requests", () => {
  assert.equal(getLocaleRedirect(request("/about"), "en"), undefined);
  assert.equal(
    getLocaleRedirect(request("/posts/example.md"), "ru"),
    undefined,
  );
});

test("removes only the GT locale cookie from document responses", () => {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    "generaltranslation.locale=en; Max-Age=31536000; Path=/; SameSite=Lax",
  );
  headers.append("Set-Cookie", "session=value; Path=/; HttpOnly");

  removeLocaleCookie(headers);
  assert.deepEqual(headers.getSetCookie(), ["session=value; Path=/; HttpOnly"]);
});
