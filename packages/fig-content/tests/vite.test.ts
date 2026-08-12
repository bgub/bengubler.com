import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createServer } from "vite";
import { contentUpdateEvent } from "../src/hmr.ts";
import { figContent } from "../src/vite.ts";

test("updates named collections over HMR without reloading", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "fig-content-hmr-"));
  const contentDirectory = path.join(root, "content");
  const contentPath = path.join(contentDirectory, "post.md");
  await mkdir(contentDirectory);
  await writeFile(contentPath, "---\ntitle: Initial\n---\nBody\n");
  await writeFile(
    path.join(root, "content.config.ts"),
    `export const content = {
  collections: {
    posts: {
      directory: "content",
      compile: (file) => ({
        path: file.path,
        title: String(file.frontmatter.title),
      }),
      id: (document) => document.path,
      summary: (document) => document,
    },
  },
};
`,
  );
  const server = await createServer({
    configFile: false,
    logLevel: "silent",
    plugins: [figContent()],
    root,
    server: { middlewareMode: true },
  });
  const messages: unknown[][] = [];
  server.hot.send = ((...message: unknown[]) => {
    messages.push(message);
  }) as typeof server.hot.send;

  try {
    const initial = await server.ssrLoadModule("fig-content:data");
    assert.equal(initial.posts.summaries[0].title, "Initial");
    await waitFor(() =>
      Object.values(server.watcher.getWatched()).some((files) =>
        files.includes("post.md"),
      ),
    );

    await writeFile(contentPath, "---\ntitle: Updated\n---\nBody\n");
    await waitFor(() =>
      messages.some(([event]) => event === contentUpdateEvent),
    );
    await new Promise((resolve) => setTimeout(resolve, 50));

    const updated = await server.ssrLoadModule("fig-content:data");
    assert.equal(updated.posts.summaries[0].title, "Updated");
    assert.deepEqual(
      messages.find(([event]) => event === contentUpdateEvent),
      [contentUpdateEvent, { collections: ["posts"] }],
    );
    assert.equal(
      messages.some(
        ([payload]) =>
          typeof payload === "object" &&
          payload !== null &&
          "type" in payload &&
          payload.type === "full-reload",
      ),
      false,
    );
  } finally {
    await server.close();
    await rm(root, { force: true, recursive: true });
  }
});

async function waitFor(predicate: () => boolean): Promise<void> {
  const timeoutAt = Date.now() + 3000;
  while (!predicate()) {
    if (Date.now() >= timeoutAt) throw new Error("Timed out waiting for HMR");
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}
