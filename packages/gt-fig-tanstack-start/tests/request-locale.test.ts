import assert from "node:assert/strict";
import test from "node:test";
import { requestHandler } from "@tanstack/start-server-core";
import { getLocale, initializeGT } from "../src/index.server.ts";

initializeGT({
  defaultLocale: "en",
  localeCookieName: "generaltranslation.locale",
  localeRouting: true,
  locales: ["en", "cs", "sk"],
});

test("requires an active TanStack request", () => {
  assert.throws(() => getLocale(), /No StartEvent found in AsyncLocalStorage/);
});

test("resolves and memoizes the current request locale", async () => {
  const handleRequest = requestHandler(() => {
    const first = getLocale();
    const second = getLocale();
    return new Response(JSON.stringify({ first, second }));
  });

  const response = await handleRequest(
    new Request("https://example.com/cs/about", {
      headers: {
        "Accept-Language": "sk",
        Cookie: "generaltranslation.locale=en",
      },
    }),
    {},
  );

  assert.deepEqual(await response.json(), { first: "cs", second: "cs" });
  assert.deepEqual(response.headers.getSetCookie(), [
    "generaltranslation.locale=cs; Max-Age=31536000; Path=/; SameSite=Lax",
  ]);
});

test("isolates locales between requests", async () => {
  const handleRequest = requestHandler(() => new Response(getLocale()));

  const [czechResponse, slovakResponse] = await Promise.all([
    handleRequest(
      new Request("https://example.com/", {
        headers: { Cookie: "generaltranslation.locale=cs" },
      }),
      {},
    ),
    handleRequest(
      new Request("https://example.com/", {
        headers: { Cookie: "generaltranslation.locale=sk" },
      }),
      {},
    ),
  ]);

  assert.equal(await czechResponse.text(), "cs");
  assert.equal(await slovakResponse.text(), "sk");
});
