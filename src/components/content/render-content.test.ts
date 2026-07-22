import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { type ContentComponents, ContentRenderer } from "./render-content.ts";

const components = {
  Blockquote: "blockquote",
  ContentLink: "a",
  Fence: "pre",
  Heading: "h2",
  InlineCode: "code",
  Tweet: "div",
} satisfies ContentComponents;

test("renders unmapped intrinsic elements", () => {
  const body = JSON.stringify([
    {
      type: "element",
      name: "p",
      attributes: {},
      children: ["Hello"],
    },
  ]);

  assert.equal(
    renderToStaticMarkup(createElement(ContentRenderer, { body, components })),
    "<p>Hello</p>",
  );
});

test("rejects custom elements without an adapter", () => {
  const body = JSON.stringify([
    {
      type: "element",
      name: "MissingWidget",
      attributes: {},
      children: [],
    },
  ]);

  assert.throws(
    () =>
      renderToStaticMarkup(
        createElement(ContentRenderer, { body, components }),
      ),
    /Missing content component adapter for "MissingWidget"/,
  );
});
