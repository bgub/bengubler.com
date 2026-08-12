import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const startedAt = performance.now();
const outputDirectory = await mkdtemp(
  path.join(tmpdir(), "fig-content-benchmark-"),
);

try {
  const [{ content }, { createContentBuilder }] = await Promise.all([
    import("../content.ts"),
    import("../packages/fig-content/src/builder.ts"),
  ]);
  const builder = createContentBuilder({
    configPath: "content.ts",
    definition: content,
    outputDirectory,
    root: process.cwd(),
  });
  const result = await builder.build();
  const elapsedMs = performance.now() - startedAt;
  const budgetMs = Number(process.env.FIG_CONTENT_BUDGET_MS ?? 300);

  console.log(
    JSON.stringify(
      {
        budgetMs,
        elapsedMs: Math.round(elapsedMs * 10) / 10,
        ...result,
      },
      null,
      2,
    ),
  );

  if (elapsedMs > budgetMs) {
    throw new Error(
      `Cold content build took ${elapsedMs.toFixed(1)}ms (budget: ${budgetMs}ms)`,
    );
  }
} finally {
  await rm(outputDirectory, { force: true, recursive: true });
}
