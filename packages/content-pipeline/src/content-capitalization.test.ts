import assert from "node:assert/strict";
import test from "node:test";
import Markdoc from "@markdoc/markdoc";
import { lintDocumentCapitalization } from "./content-capitalization.ts";

const specialCases = ["AI", "ts-base", "v3"];
const tokenizer = new Markdoc.Tokenizer();

function document(title: string, body: string) {
  return {
    ast: Markdoc.parse(tokenizer.tokenize(body)),
    title,
  };
}

test("reports frontmatter titles and Markdown headings", () => {
  const issues = lintDocumentCapitalization(
    document("an example post", "## checking job status"),
    { specialCases },
  );

  assert.deepEqual(issues, [
    {
      actual: "an example post",
      expected: "An Example Post",
      kind: "frontmatter-title",
    },
    {
      actual: "checking job status",
      expected: "Checking Job Status",
      kind: "heading",
    },
  ]);
});

test("preserves configured brands, inline code, and link text", () => {
  const issues = lintDocumentCapitalization(
    document(
      "Introducing ts-base v3",
      "## Training AI with `fast mode` and [the docs](https://example.com)",
    ),
    { specialCases },
  );

  assert.deepEqual(issues, []);
});

test("does not replace short special cases inside other words", () => {
  const issues = lintDocumentCapitalization(
    document("Pretraining AI Models", "## Pretraining AI Models"),
    { specialCases },
  );

  assert.deepEqual(issues, []);
});

test("checks every heading in the Markdoc AST", () => {
  const issues = lintDocumentCapitalization(
    document("Example Post", "## Already Correct\n\n## needs work"),
    { specialCases },
  );

  assert.deepEqual(issues, [
    {
      actual: "needs work",
      expected: "Needs Work",
      kind: "heading",
    },
  ]);
});
