import assert from "node:assert/strict";
import test from "node:test";
import { type ContentElement, createContentCompiler } from "content-pipeline";

const compiler = createContentCompiler();

test("compiles portable content, navigation, and highlighted code", async () => {
  const compiled = await compiler.compile({
    source: [
      "## Build `fast`",
      "",
      "See https://example.com.",
      "",
      "```typescript",
      "const answer = 42;",
      "```",
      "",
      '{% tweet id="123" /%}',
    ].join("\n"),
    title: "Example Post",
    filePath: "post.md",
  });

  assert.deepEqual(compiled.toc.children, [
    {
      type: "heading",
      depth: 2,
      title: "Build fast",
      id: "build-fast",
      children: [],
    },
  ]);
  assert.equal(compiled.readingTime, "1 min read");

  const serialized = JSON.stringify(compiled.body);
  assert.doesNotMatch(serialized, /\$\$mdtype|highlightedHtml/);
  assert.doesNotMatch(serialized, /"offset"|"fontStyle":0/);
  assert.match(serialized, /highlightedLines/);
  assert.match(serialized, /ContentLink/);
  assert.match(serialized, /Tweet/);

  const root = compiled.body[0] as ContentElement;
  const heading = root.children[0] as ContentElement;
  assert.equal(heading.attributes.id, "build-fast");
});

test("deduplicates heading IDs", async () => {
  const compiled = await compiler.compile({
    source: "## Same\n\n## Same",
    title: "Example Post",
    filePath: "post.md",
  });
  assert.deepEqual(
    compiled.toc.children.map(({ id }) => id),
    ["same", "same-1"],
  );
});

test("reports invalid component attributes with their source file", async () => {
  await assert.rejects(
    compiler.compile({
      source: "{% tweet /%}",
      title: "Example Post",
      filePath: "post.md",
    }),
    /Invalid content:\npost\.md.*id/i,
  );
});

test("validates configured capitalization", async () => {
  const validatingCompiler = createContentCompiler({
    lintCapitalization: {
      specialCases: ["AI"],
      shouldLint: ({ filePath }) => filePath.startsWith("en/"),
    },
  });

  await assert.rejects(
    validatingCompiler.compile({
      source: "## building with AI",
      title: "an example post",
      filePath: "en/post.md",
    }),
    /Frontmatter title should use title case[\s\S]*Heading should use title case/,
  );

  await assert.doesNotReject(
    validatingCompiler.compile({
      source: "## minuskulový nadpis",
      title: "preložený príspevok",
      filePath: "sk/post.md",
    }),
  );
});
