import assert from "node:assert/strict";
import test from "node:test";
import {
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

test("serializes the configured locale cookie", () => {
  assert.equal(
    serializeLocaleCookie(config, "pt-BR"),
    "generaltranslation.locale=pt-BR; Max-Age=31536000; Path=/; SameSite=Lax",
  );
});
