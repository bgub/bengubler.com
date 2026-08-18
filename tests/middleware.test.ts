import assert from "node:assert/strict";
import test from "node:test";
import { localeMiddleware } from "../middleware.ts";

const localeCookieName = "generaltranslation.locale";
const documentHeaders = { Accept: "text/html" };

test("redirects an unprefixed page using the saved locale", () => {
  const response = localeMiddleware(
    new Request("https://www.bengubler.com/about?from=test", {
      headers: {
        ...documentHeaders,
        Cookie: `${localeCookieName}=cs`,
      },
    }),
  );

  assert.equal(response?.status, 307);
  assert.equal(response?.headers.get("location"), "/cs/about?from=test");
  assert.match(
    response?.headers.get("set-cookie") ?? "",
    /generaltranslation\.locale=cs/,
  );
});

test("uses Accept-Language when there is no saved locale", () => {
  const response = localeMiddleware(
    new Request("https://www.bengubler.com/", {
      headers: {
        ...documentHeaders,
        "Accept-Language": "en;q=0.8, cs-CZ;q=0.9",
      },
    }),
  );

  assert.equal(response?.headers.get("location"), "/cs");
});

test("the saved locale takes precedence over Accept-Language", () => {
  const response = localeMiddleware(
    new Request("https://www.bengubler.com/", {
      headers: {
        ...documentHeaders,
        "Accept-Language": "cs-CZ,cs;q=0.9",
        Cookie: `${localeCookieName}=en`,
      },
    }),
  );

  assert.equal(response, undefined);
});

test("leaves direct content requests unchanged", () => {
  const markdownResponse = localeMiddleware(
    new Request("https://www.bengubler.com/posts/example.md", {
      headers: {
        ...documentHeaders,
        Cookie: `${localeCookieName}=cs`,
      },
    }),
  );
  const rawResponse = localeMiddleware(
    new Request("https://www.bengubler.com/posts/example?__raw=1", {
      headers: {
        ...documentHeaders,
        Cookie: `${localeCookieName}=cs`,
      },
    }),
  );

  assert.equal(markdownResponse, undefined);
  assert.equal(rawResponse, undefined);
});
