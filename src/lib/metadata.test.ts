import assert from "node:assert/strict";
import test from "node:test";
import { getPageMetadata, getPostMetadata } from "./metadata.ts";

function findByProperty(
  metadata: ReturnType<typeof getPageMetadata>,
  property: string,
) {
  return metadata.find(
    (entry) => "property" in entry && entry.property === property,
  );
}

test("emits social-card and crawler metadata", () => {
  const metadata = getPageMetadata({
    title: "Projects - Ben Gubler",
    description: "Project description",
    locale: "ru",
  });

  assert.equal(
    findByProperty(metadata, "og:image")?.content,
    "https://bengubler.com/ru/og?title=Projects+-+Ben+Gubler&description=Project+description",
  );
  assert.ok(
    metadata.some(
      (entry) =>
        "name" in entry &&
        entry.name === "twitter:card" &&
        entry.content === "summary_large_image",
    ),
  );
  assert.ok(
    metadata.some((entry) => "name" in entry && entry.name === "googlebot"),
  );
});

test("keeps the document suffix while preserving the post social title", () => {
  const metadata = getPostMetadata({
    title: "Introducing Eta v4",
    description: "Post description",
    locale: "en",
    date: new Date("2025-09-17T00:00:00.000Z"),
    tags: ["eta", "javascript"],
  });

  assert.ok(
    metadata.some(
      (entry) =>
        "title" in entry && entry.title === "Introducing Eta v4 - Ben Gubler",
    ),
  );
  assert.equal(
    findByProperty(metadata as ReturnType<typeof getPageMetadata>, "og:title")
      ?.content,
    "Introducing Eta v4",
  );
  const structuredData = metadata.find((entry) => "script:ld+json" in entry) as
    | { "script:ld+json": { keywords: string[] } }
    | undefined;
  assert.deepEqual(structuredData?.["script:ld+json"].keywords, [
    "eta",
    "javascript",
  ]);
  assert.deepEqual(
    metadata
      .filter(
        (entry) => "property" in entry && entry.property === "article:tag",
      )
      .map((entry) => ("content" in entry ? entry.content : undefined)),
    ["eta", "javascript"],
  );
});
