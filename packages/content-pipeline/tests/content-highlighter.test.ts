import assert from "node:assert/strict";
import test from "node:test";
import javascript from "highlight.js/lib/languages/javascript";
import { createHighlighter } from "../src/content-highlighter.ts";

test("uses explicit languages and aliases", () => {
  const highlight = createHighlighter({
    languages: { javascript },
    aliases: { js: "javascript" },
  });

  assert.strictEqual(
    highlight("const answer = 42;", "js"),
    highlight("const answer = 42;", "javascript"),
  );
});

test("treats unknown languages as plain text by default", () => {
  const highlight = createHighlighter({ languages: { javascript } });
  const highlighted = highlight("hello", "unknown");

  assert.deepEqual(highlighted, [
    {
      tokens: [{ content: "hello", light: "#24292e", dark: "#adbac7" }],
    },
  ]);
  assert.strictEqual(highlighted, highlight("hello", "another-unknown"));
});

test("can reject unknown languages", () => {
  const highlight = createHighlighter({
    languages: { javascript },
    unknownLanguage: "error",
  });

  assert.throws(
    () => highlight("hello", "unknown"),
    /Unknown syntax highlighting language: unknown/,
  );
});
