# @bgub/fig-content

Fast, typed content collections for Vite.

## Configure collections

Create `content.config.ts`:

```ts
import { defineCollection, defineContent } from "@bgub/fig-content";
import { z } from "zod";

const posts = defineCollection({
  directory: "content/posts",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
  compile: ({ frontmatter, path, source }) => ({
    ...frontmatter,
    path,
    source,
  }),
  id: (post) => post.path,
  summary: ({ source: _source, ...summary }) => summary,
});

export const content = defineContent({ collections: { posts } });
```

Schemas use Standard Schema, so compatible validators such as Zod, Valibot,
and ArkType work without an adapter. Schema output is inferred as the
`frontmatter` type passed to `compile`.

## Add the Vite plugin

```ts
import { figContent } from "@bgub/fig-content/vite";

export default defineConfig({
  plugins: [figContent()],
});
```

`figContent()` loads `content.config.ts` by default. Use
`figContent({ config: "content.ts" })` for another path.

Add the generated module to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "fig-content:data": ["./.fig-content/generated"]
    }
  },
  "include": [".fig-content/generated/**/*.ts"]
}
```

## Load content

Each configured collection becomes a named export:

```ts
import { posts } from "fig-content:data";

for (const post of posts.summaries) {
  console.log(post.title);
}

const post = await posts.load("hello-world.md");
```

Summaries are loaded eagerly; full documents remain separate lazy modules.
Build artifacts are cached independently per source file. Configuration and
transitive source imports are fingerprinted automatically, along with the
project package manifest and nearest lockfile. Use a collection's optional
`version` only when compilation depends on other external state the fingerprint
cannot observe.

## Invalidate application caches during HMR

Generated modules update automatically. Applications with router or data
caches can subscribe to collection-level updates:

```ts
import { onContentUpdate } from "@bgub/fig-content";

onContentUpdate(({ collections }) => {
  if (collections.includes("posts")) router.invalidate();
});
```
