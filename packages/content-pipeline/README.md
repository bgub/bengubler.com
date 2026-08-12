# content-pipeline

Fast, framework-neutral Markdoc compilation into a JSON-safe content tree.

```ts
import { createContentCompiler } from "content-pipeline";
import { createHighlighter, githubTheme } from "content-pipeline/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";

const highlight = createHighlighter({
  languages: { javascript, typescript },
  aliases: {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
  },
  theme: githubTheme,
});

const compile = createContentCompiler({
  highlight,
  markdoc: {
    tags: {
      callout: {
        render: "Callout",
        attributes: {
          type: { type: String, default: "note" },
        },
      },
    },
  },
  readingTime: { wordsPerMinute: 200 },
});

const { body, toc, readingTime } = compile({ source, filePath });
```

The package handles parsing, Markdoc validation, heading IDs, table-of-contents
generation, reading time, and optional build-time syntax highlighting. It ships
no languages implicitly: applications import and register exactly what they
need. Unknown languages render as plain text by default or can be rejected with
`unknownLanguage: "error"`.

The built-in content elements have stable names: `Blockquote`, `CodeBlock`,
`Heading`, `InlineCode`, and `Link`. Custom Markdoc tags keep their configured
render name. `body` can be rendered by any framework without loading Markdoc or
Highlight.js at runtime.

Application-specific lint rules can use the single `validate` callback. The
optional `content-pipeline/title-case` entry point exposes the title-case helper
used by bengubler.com without coupling that policy to the compiler.
