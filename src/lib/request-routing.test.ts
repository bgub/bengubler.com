import assert from "node:assert/strict";
import test from "node:test";
import {
  getLocalizedPath,
  getPathLocale,
  getUnlocalizedPath,
} from "./locales.ts";
import {
  isDirectContentPath,
  prepareDirectContentRequest,
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

test("leaves page locale resolution to GT", () => {
  const localizedRequest = request("/ru/about", {
    cookie: "session=value; generaltranslation.locale=cs",
  });
  assert.equal(prepareDirectContentRequest(localizedRequest), false);
  assert.equal(
    localizedRequest.headers.get("cookie"),
    "session=value; generaltranslation.locale=cs",
  );
});

test("pins unprefixed document requests to the default locale", () => {
  const documentRequest = request("/rss.xml", {
    cookie: "generaltranslation.locale=ru",
  });
  assert.equal(prepareDirectContentRequest(documentRequest), true);
  assert.equal(
    documentRequest.headers.get("cookie"),
    "generaltranslation.locale=en",
  );
});

test("leaves prefixed document locales to GT", () => {
  const documentRequest = request("/ru/rss.xml", {
    cookie: "generaltranslation.locale=cs",
  });
  assert.equal(prepareDirectContentRequest(documentRequest), true);
  assert.equal(
    documentRequest.headers.get("cookie"),
    "generaltranslation.locale=cs",
  );
});

test("identifies direct content paths", () => {
  assert.equal(isDirectContentPath("/rss.xml"), true);
  assert.equal(isDirectContentPath("/posts/example", "?__raw"), true);
  assert.equal(isDirectContentPath("/about"), false);
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
