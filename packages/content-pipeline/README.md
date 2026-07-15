# content-pipeline

Framework-neutral compilation for bengubler.com content.

```ts
import { createContentCompiler } from "content-pipeline";

const compiler = createContentCompiler({
  lintCapitalization: {
    specialCases: ["AI", "TypeScript"],
  },
});

const { body, toc, readingTime } = await compiler.compile({
  source,
  title,
  filePath,
});
```

The package owns parsing, validation, heading IDs, table-of-contents generation,
reading time, and build-time syntax highlighting. `body` is a JSON-safe content
tree that can be rendered by Next, Fig, RSS, or another adapter without loading
Markdoc or Shiki at runtime.
