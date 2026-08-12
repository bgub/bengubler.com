import assert from "node:assert/strict";
import test from "node:test";
import typescript from "highlight.js/lib/languages/typescript";
import { createHighlighter } from "../src/content-highlighter.ts";
import {
  createContentCompiler,
  type ContentElement,
  type ContentNode,
  type HighlightedLine,
} from "../src/content-pipeline.ts";

test("compiles configured Markdoc and syntax highlighting", async () => {
  const highlight = createHighlighter({
    languages: { typescript },
    aliases: { ts: "typescript" },
  });
  const compile = createContentCompiler({
    highlight,
    markdoc: {
      tags: {
        callout: {
          render: "Callout",
          attributes: { title: { type: String } },
        },
      },
    },
  });
  const input = {
    filePath: "example.md",
    source: [
      "# Example",
      "",
      "## Child heading",
      "",
      '{% callout title="Note" %}Hello{% /callout %}',
      "",
      "```ts",
      "const answer: number = 42;",
      "```",
    ].join("\n"),
  };

  const [first, second] = await Promise.all([compile(input), compile(input)]);
  const firstBlock = findElement(first.body, "CodeBlock");
  const secondBlock = findElement(second.body, "CodeBlock");
  assert.ok(firstBlock);
  assert.ok(secondBlock);
  const highlightedLines = firstBlock.attributes
    .highlightedLines as HighlightedLine[];

  assert.strictEqual(
    firstBlock.attributes.highlightedLines,
    secondBlock.attributes.highlightedLines,
  );
  assert.equal(
    highlightedLines
      .map((line) => line.tokens.map((token) => token.content).join(""))
      .join("\n"),
    firstBlock.attributes.content,
  );
  assert.ok(
    highlightedLines.some((line) =>
      line.tokens.some(
        (token) => token.light !== "#24292e" || token.dark !== "#adbac7",
      ),
    ),
  );
  assert.ok(findElement(first.body, "Callout"));
  assert.equal(first.toc.children[0]?.id, "example");
  assert.equal(first.toc.children[0]?.children[0]?.id, "child-heading");
  assert.ok(first.readingTime.words > 0);
});

test("reports custom validation diagnostics", () => {
  const compile = createContentCompiler<{ title: string }>({
    validate: ({ input }) =>
      input.metadata?.title === "Expected"
        ? []
        : [{ message: "Title must be Expected" }],
  });

  assert.throws(
    () =>
      compile({
        filePath: "example.md",
        metadata: { title: "Actual" },
        source: "Hello",
      }),
    /example\.md Title must be Expected/,
  );
});

function findElement(
  nodes: ContentNode[],
  name: string,
): ContentElement | undefined {
  for (const node of nodes) {
    if (typeof node !== "object") continue;
    if (node.name === name) return node;

    const nested = findElement(node.children, name);
    if (nested) return nested;
  }

  return undefined;
}
