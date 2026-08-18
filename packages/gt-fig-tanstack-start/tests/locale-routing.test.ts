import assert from "node:assert/strict";
import test from "node:test";
import {
  getLocaleRedirectPath,
  localizePathname,
  resolveRequestLocale,
  serializeLocaleCookie,
} from "../src/locale-routing.ts";

const config = {
  defaultLocale: "en",
  localeCookieName: "generaltranslation.locale",
  localeRouting: true,
  locales: ["en", "cs", "pt-BR"],
} as const;

test("resolves path, cookie, and accepted locales in priority order", () => {
  assert.equal(
    resolveRequestLocale(config, {
      acceptLanguage: "en",
      cookie: "generaltranslation.locale=cs",
      pathname: "/pt-BR/about",
    }),
    "pt-BR",
  );
  assert.equal(
    resolveRequestLocale(config, {
      acceptLanguage: "en",
      cookie: "generaltranslation.locale=cs",
      pathname: "/about",
    }),
    "cs",
  );
  assert.equal(
    resolveRequestLocale(config, {
      acceptLanguage: "en;q=0.8, pt;q=0.9",
      pathname: "/",
    }),
    "pt-BR",
  );
});

test("localizes paths without adding a prefix for the default locale", () => {
  assert.equal(localizePathname(config, "/cs/about", "en"), "/about");
  assert.equal(localizePathname(config, "/about", "cs"), "/cs/about");
  assert.equal(localizePathname(config, "/", "pt-BR"), "/pt-BR");
});

test("leaves paths unchanged when locale routing is disabled", () => {
  assert.equal(
    localizePathname({ ...config, localeRouting: false }, "/about", "cs"),
    "/about",
  );
});

test("redirects unprefixed document requests to the resolved locale", () => {
  assert.equal(
    getLocaleRedirectPath(config, {
      accept: "text/html,application/xhtml+xml",
      locale: "cs",
      method: "GET",
      pathname: "/about",
      search: "?from=test",
    }),
    "/cs/about?from=test",
  );
});

test("does not redirect canonical or non-document requests", () => {
  const request = {
    accept: "text/html",
    locale: "cs",
    method: "GET",
    pathname: "/about",
  };

  assert.equal(
    getLocaleRedirectPath(config, { ...request, locale: "en" }),
    undefined,
  );
  assert.equal(
    getLocaleRedirectPath(config, { ...request, pathname: "/cs/about" }),
    undefined,
  );
  assert.equal(
    getLocaleRedirectPath(config, { ...request, accept: "application/json" }),
    undefined,
  );
  assert.equal(
    getLocaleRedirectPath(config, {
      ...request,
      pathname: "/posts/example.md",
    }),
    undefined,
  );
  assert.equal(
    getLocaleRedirectPath(config, { ...request, search: "?__raw=1" }),
    undefined,
  );
  assert.equal(
    getLocaleRedirectPath(config, { ...request, method: "POST" }),
    undefined,
  );
});

test("serializes the configured locale cookie", () => {
  assert.equal(
    serializeLocaleCookie(config, "pt-BR"),
    "generaltranslation.locale=pt-BR; Max-Age=31536000; Path=/; SameSite=Lax",
  );
});
