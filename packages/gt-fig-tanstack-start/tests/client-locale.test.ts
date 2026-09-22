import assert from "node:assert/strict";
import test from "node:test";
import { getLocale, initializeGT } from "../src/index.client.ts";

test("client navigation follows the URL despite a previously saved locale", () => {
  const originalLocation = Object.getOwnPropertyDescriptor(
    globalThis,
    "location",
  );
  const originalDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    "document",
  );
  const location = { pathname: "/cs/about" };
  Object.defineProperty(globalThis, "location", {
    configurable: true,
    value: location,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { cookie: "generaltranslation.locale=ar" },
  });
  try {
    initializeGT({ localeRouting: true, locales: ["en", "cs", "ar"] });
    assert.equal(getLocale(), "cs");
    location.pathname = "/about";
    assert.equal(getLocale(), "en");
    location.pathname = "/ar/about";
    assert.equal(getLocale(), "ar");
    initializeGT({ localeRouting: false, locales: ["en", "cs", "ar"] });
    location.pathname = "/about";
    assert.equal(getLocale(), "ar");
  } finally {
    if (originalLocation)
      Object.defineProperty(globalThis, "location", originalLocation);
    else Reflect.deleteProperty(globalThis, "location");
    if (originalDocument)
      Object.defineProperty(globalThis, "document", originalDocument);
    else Reflect.deleteProperty(globalThis, "document");
  }
});
