---
title: "Introducing helm"
description: "A typed TypeScript framework for AI agents. Replace dozens of tools with two — search and execute — and sandbox LLM-generated code with granular permissions."
date: "2026-02-25"
tags: [ml/ai, open-source, frontend]
---

# Introducing helm

helm is a typed TypeScript framework for AI agents. Instead of shelling out and parsing strings, agents call typed functions with structured inputs and outputs:

```ts
import { createHelm, git, fs, grep } from "@bgub/helm";

const agent = createHelm({
  permissions: {
    "fs.read": "allow",
    "fs.write": "ask",
    "fs.remove": "deny",
    "git.status": "allow",
    "git.*": "ask",
  },
  onPermissionRequest: async (operation, args) => {
    return confirm(`Allow ${operation}?`);
  },
})
  .use(fs())
  .use(git())
  .use(grep());

const { staged, unstaged, branch } = await agent.git.status();
const { content } = await agent.fs.read("./package.json");
```

You register "skills" — groups of related operations — with a builder pattern. TypeScript infers the full type at each step. Every operation has a permission level: `allow` (runs immediately), `ask` (pauses for approval), or `deny` (throws `PermissionDeniedError`). Permissions resolve by precedence: exact match → wildcard → skill author default → global default.

helm ships with built-in skills for the things agents do every day: `fs`, `git`, `grep`, `edit`, `shell`, `http`. You can define custom skills and they get types, search, and permissions for free.

## The demo

I built a chatbot where the agent has exactly two tools: `search` and `execute`.

`search` does keyword lookup over all registered helm operations — the agent calls it to discover what's available and learn the function signatures:

```ts
agent.search("file read");
// → [{ qualifiedName: "fs.read",
//      description: "Read a file and return its content as a string",
//      signature: "(path: string) => Promise<{ content: string }>", ... }]
```

`execute` takes arbitrary JavaScript code and runs it against the helm agent API. The LLM writes code like:

```js
const { staged, unstaged, branch } = await agent.git.status();
return { branch, staged: staged.length, unstaged: unstaged.length };
```

Two tools in context, regardless of how many skills are registered. The agent discovers what it needs on demand and writes code to use it.

![The helm demo app listing files in the current directory](/blog-images/helm-demo-app-list-files.png)

### Sandboxing untrusted code

The `execute` tool runs whatever JavaScript the LLM writes. To make that safe, the demo sandboxes it using [SES (Secure ECMAScript)](https://github.com/endojs/endo/tree/master/packages/ses) in a child process.

SES `lockdown()` freezes every JavaScript intrinsic — `Object`, `Array`, `Promise`, `Function`, all of it. The code runs inside a `Compartment`, an isolated global scope with access to exactly two things: an `agent` proxy and a stubbed `console`. `fetch`, `require`, `import`, `process`, `fs` — none of it exists in the compartment. The only way to do anything interesting is through the agent proxy.

The `agent` inside the sandbox isn't the real helm agent — it's a recursive `Proxy` that intercepts property access and function calls. When the code calls `agent.git.status()`, the proxy sends an IPC message to the parent process. The parent calls the real method on the real helm agent, runs the full permission check, and sends the result back. If the operation is set to `"ask"`, the parent pauses for user approval before responding. If it's `"deny"`, the error propagates back through IPC.

The sandboxed code has no idea any of this is happening. It just sees its `await` resolve with a value. The only way to interact with the outside world is through helm's permission-gated operations.

### The permission UI

The chat UI has a sidebar listing every registered skill and operation, each with an allow/ask/deny toggle. Changing a permission takes effect on the next message.

![The tools panel with per-operation permission controls](/blog-images/helm-demo-app.png)

When the LLM hits an operation set to `"ask"`, the server streams an approval request to the frontend. The tool call shows an inline banner with Allow and Deny buttons. The server blocks on a `Promise<boolean>` until the user clicks one.

![An execute tool call awaiting user approval with Allow and Deny buttons](/blog-images/helm-demo-app-sandbox-feature.png)

If the user denies, `PermissionDeniedError` propagates all the way back and the LLM sees it in the tool result. It can explain why it needs the permission, try a different approach, or give up.

## Inspiration

This architecture — giving the agent a code execution tool instead of dozens of individual tools — was inspired by Cloudflare's [code mode](https://blog.cloudflare.com/code-mode-mcp/) for their MCP server, where they reduced token usage by 99.9% by replacing 2,500+ API endpoint tools with `search` + `execute`. [Rhys Sullivan's similar idea](https://x.com/RhysSullivan/status/2019819177473933404) crystalized the idea for me: the combination of code execution, discoverability, and a granular permission model means the agent can do anything but can't go off the rails.

## Try it

```bash
npm install @bgub/helm
```

The source is on [GitHub](https://github.com/bgub/helm). The demo app is in `apps/demo`.
