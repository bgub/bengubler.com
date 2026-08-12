import assert from "node:assert/strict";
import test from "node:test";
import Markdoc from "@markdoc/markdoc";
import { lintDocumentCapitalization } from "../src/content-capitalization.ts";

test("capitalizes titles while preserving code and link text", () => {
  const ast = Markdoc.parse(
    "# using `iPhone` with [fooBar](https://example.com)",
  );

  assert.deepEqual(
    lintDocumentCapitalization(
      { ast, title: "an API example" },
      { specialCases: ["API"] },
    ),
    [
      {
        actual: "an API example",
        expected: "An API Example",
        kind: "frontmatter-title",
      },
      {
        actual: "using iPhone with fooBar",
        expected: "Using iPhone with fooBar",
        kind: "heading",
      },
    ],
  );
});
