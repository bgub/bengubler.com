import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  unlink,
  utimes,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test, { type TestContext } from "node:test";
import { pathToFileURL } from "node:url";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createContentBuilder } from "../src/builder.ts";
import { defineCollection, defineContent } from "../src/index.ts";

const titleSchema: StandardSchemaV1<unknown, { title: string }> = {
  "~standard": {
    version: 1,
    vendor: "test",
    validate(value) {
      const title = (value as { title?: unknown }).title;
      return typeof title === "string"
        ? { value: { title } }
        : { issues: [{ message: "title must be a string" }] };
    },
  },
};

test("builds and caches independent named collections", async (context) => {
  const root = await createFixture(context, {
    "content/pages/about.md": "About body",
    "content/posts/first.md": "---\ntitle: First\n---\n\nFirst body\n",
    "content/posts/second.md": "---\ntitle: Second\n---\n\nSecond body\n",
    "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
  });
  const configPath = path.join(root, "content.config.ts");
  const firstPath = path.join(root, "content/posts/first.md");
  const pagePath = path.join(root, "content/pages/about.md");
  let compilations = 0;

  const posts = defineCollection({
    directory: "content/posts",
    schema: titleSchema,
    compile(file) {
      compilations++;
      return {
        date: new Date("2026-01-01T00:00:00.000Z"),
        path: file.path,
        source: file.source,
        title: file.frontmatter.title,
      };
    },
    id: (document) => document.path,
    summary: ({ date, path, title }) => ({ date, path, title }),
  });
  const pages = defineCollection({
    directory: "content/pages",
    compile: (file) => file,
    id: (document) => document.path,
    summary: (document) => ({ path: document.path }),
  });
  const definition = defineContent({ collections: { pages, posts } });
  const outputDirectory = ".generated";
  const builder = createContentBuilder({
    configPath,
    definition,
    outputDirectory,
    root,
  });

  const initial = await builder.build();
  assert.equal(initial.compiled, 3);
  assert.deepEqual(initial.changedCollections, ["pages", "posts"]);
  assert.equal(initial.removed, 0);
  assert.equal(initial.reused, 0);
  assert.ok(initial.durationMs >= 0);
  assert.equal(compilations, 2);

  const cached = await builder.build();
  assert.equal(cached.compiled, 0);
  assert.deepEqual(cached.changedCollections, []);
  assert.equal(cached.reused, 3);

  const firstMetadata = await stat(firstPath);
  await utimes(
    firstPath,
    firstMetadata.atime,
    new Date(firstMetadata.mtimeMs + 1000),
  );
  const updated = await builder.build();
  assert.equal(updated.compiled, 1);
  assert.deepEqual(updated.changedCollections, ["posts"]);
  assert.equal(updated.reused, 2);

  await unlink(pagePath);
  const removed = await builder.build();
  assert.equal(removed.compiled, 0);
  assert.deepEqual(removed.changedCollections, ["pages"]);
  assert.equal(removed.removed, 1);
  assert.equal(removed.reused, 2);

  const generated = await import(
    `${pathToFileURL(path.join(root, outputDirectory, "index.js")).href}?test=${Date.now()}`
  );
  assert.equal(generated.posts.summaries.length, 2);
  assert.equal(generated.posts.summaries[0].title, "First");
  assert.ok(generated.posts.summaries[0].date instanceof Date);
  assert.equal((await generated.posts.load("first.md")).source, "First body");
  assert.equal(await generated.posts.load("missing.md"), undefined);
  assert.deepEqual(generated.pages.summaries, []);

  const dataModule = await readFile(
    path.join(root, outputDirectory, "index.js"),
    "utf8",
  );
  assert.doesNotMatch(dataModule, /First body/);

  await writeFile(
    path.join(root, outputDirectory, "state.json"),
    JSON.stringify({ entries: null, fingerprint: "invalid", version: 4 }),
  );
  const freshBuilder = createContentBuilder({
    configPath,
    definition,
    outputDirectory,
    root,
  });
  assert.equal((await freshBuilder.build()).compiled, 2);

  await writeFile(configPath, "export const marker = 2;\n");
  const changedConfigBuilder = createContentBuilder({
    configPath,
    definition,
    outputDirectory,
    root,
  });
  assert.equal((await changedConfigBuilder.build()).compiled, 2);

  await writeFile(
    path.join(root, "pnpm-lock.yaml"),
    "lockfileVersion: '9.0'\nsettings:\n  autoInstallPeers: false\n",
  );
  const changedDependenciesBuilder = createContentBuilder({
    configPath,
    definition,
    outputDirectory,
    root,
  });
  assert.equal((await changedDependenciesBuilder.build()).compiled, 2);
});

test("serializes queued builds and recovers after failure", async (context) => {
  const root = await createFixture(context, {
    "content/posts/post.md": "Post body",
  });
  let activeCompilations = 0;
  let attempts = 0;
  let maximumActiveCompilations = 0;
  const posts = defineCollection({
    directory: "content/posts",
    async compile(file) {
      activeCompilations++;
      maximumActiveCompilations = Math.max(
        maximumActiveCompilations,
        activeCompilations,
      );
      try {
        await new Promise((resolve) => setImmediate(resolve));
        if (++attempts === 1) throw new Error("intentional failure");
        return file;
      } finally {
        activeCompilations--;
      }
    },
    id: (document) => document.path,
    summary: (document) => ({ path: document.path }),
  });
  const builder = createContentBuilder({
    configPath: path.join(root, "content.config.ts"),
    definition: defineContent({ collections: { posts } }),
    outputDirectory: ".generated",
    root,
  });

  const failed = builder.build();
  const recovered = builder.build();
  await assert.rejects(failed, /Failed to compile posts\/post\.md/);
  assert.equal((await recovered).compiled, 1);
  assert.equal(maximumActiveCompilations, 1);
});

test("rejects invalid frontmatter and duplicate IDs", async (context) => {
  const root = await createFixture(context, {
    "content/posts/first.md": "---\ntitle: First\n---\nFirst",
    "content/posts/second.md": "---\ntitle: Second\n---\nSecond",
  });
  const posts = defineCollection({
    directory: "content/posts",
    schema: titleSchema,
    compile: (file) => file,
    id: () => "duplicate",
    summary: (document) => ({ path: document.path }),
  });
  const builder = createContentBuilder({
    configPath: path.join(root, "content.config.ts"),
    definition: defineContent({ collections: { posts } }),
    outputDirectory: ".generated",
    root,
  });

  await assert.rejects(
    builder.build(),
    /Duplicate content ID "duplicate" in posts: first\.md and second\.md/,
  );

  await writeFile(
    path.join(root, "content/posts/first.md"),
    "---\ntitle: 42\n---\nFirst",
  );
  await assert.rejects(builder.build(), /title must be a string/);
});

test("does not corrupt cached artifacts after a duplicate ID", async (context) => {
  const root = await createFixture(context, {
    "content/posts/first.md": "---\ntitle: first\n---\nFirst body",
    "content/posts/second.md": "---\ntitle: second\n---\nSecond body",
  });
  const secondPath = path.join(root, "content/posts/second.md");
  const posts = defineCollection({
    directory: "content/posts",
    schema: titleSchema,
    compile: (file) => ({ source: file.source, title: file.frontmatter.title }),
    id: (document) => document.title,
    summary: (document) => ({ title: document.title }),
  });
  const outputDirectory = ".generated";
  const builder = createContentBuilder({
    configPath: path.join(root, "content.config.ts"),
    definition: defineContent({ collections: { posts } }),
    outputDirectory,
    root,
  });

  await builder.build();
  await writeFile(
    secondPath,
    "---\ntitle: first\n---\nDuplicate body that has a different size",
  );
  await assert.rejects(builder.build(), /Duplicate content ID "first"/);

  await writeFile(
    secondPath,
    "---\ntitle: second-restored\n---\nRestored body",
  );
  await builder.build();

  const generated = await import(
    `${pathToFileURL(path.join(root, outputDirectory, "index.js")).href}?test=${Date.now()}`
  );
  assert.deepEqual(await generated.posts.load("first"), {
    source: "First body",
    title: "first",
  });
});

async function createFixture(
  context: TestContext,
  files: Readonly<Record<string, string>>,
): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "fig-content-"));
  context.after(() => rm(root, { force: true, recursive: true }));
  await Promise.all(
    Object.entries(files).map(async ([fileName, content]) => {
      const filePath = path.join(root, fileName);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, content);
    }),
  );
  await writeFile(
    path.join(root, "content.config.ts"),
    "export const marker = 1;\n",
  );
  return root;
}
