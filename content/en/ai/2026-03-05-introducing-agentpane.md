---
title: "Introducing agentpane"
description: "A local web UI for AI coding agents. Multi-pane, multi-session, streaming — run Claude Code and Codex side by side from your browser."
date: "2026-03-05"
tags: [ml/ai, open-source, frontend]
---

# Introducing agentpane

agentpane is a local web UI for AI coding agents. You run `npx agentpane`, it opens in your browser, and you can talk to Claude Code, Codex, or any agent that speaks [ACP (Agent Client Protocol)](https://github.com/anthropics/agent-protocol) — all from a multi-pane interface with streaming, persistence, and session management:

```bash
npx agentpane
# → http://localhost:6767
```

Pick an agent, pick a working directory, and start a session. The agent runs as a subprocess on your machine. No cloud, no deployment, no accounts.

![The agentpane setup screen with agent and directory selection](/blog-images/agentpane-setup.png)

## Multi-pane, multi-agent

The main thing I wanted was the ability to run multiple agents at once and see them side by side. agentpane gives you up to four resizable panes with tabs. You can drag sessions from the sidebar into any pane, or drag a tab to split into a new one. Layout persists across refreshes.

This means you can have Claude Code working on your backend in one pane and Codex refactoring your frontend in another — same screen, same app.

![Two sessions running side by side — Codex on the left, Claude Code on the right](/blog-images/agentpane-hero.png)

## Architecture

The app is two processes:

- **API server** (Hono, port 3456) — spawns agents, manages sessions, handles persistence
- **Web frontend** (Next.js, port 6767) — the UI, with `/api` calls rewritten to the backend

The backend is built with [Effect.ts](https://effect.website/) and uses dependency injection through composable service layers:

```
SessionRepo (DB)
  → ConnectionManager (agent subprocess lifecycle)
  → PromptEngine (turn orchestration)
  → EventHub / EventBroadcaster (SSE)
  → WriteQueue (batched DB writes)
```

Agents communicate over ACP — JSON-RPC 2.0 over stdio. When you send a prompt, the `PromptEngine` creates turn records, passes the message to the agent subprocess via ACP, and streams results back through Server-Sent Events.

### Streaming with reconnection safety

The frontend subscribes to an SSE endpoint per session. Each event gets a monotonic ID. The `EventBroadcaster` keeps a ring buffer (512KB / 1000 events) so that if your browser disconnects and reconnects, it replays missed events using the `Last-Event-ID` header. No gaps in the conversation, no manual refresh needed.

### Crash-safe persistence

All state goes to a local SQLite database at `~/.agentpane/agentpane.db`. But writes don't happen inline — the `WriteQueue` accumulates operations and flushes them in a batch every 50ms. Before flushing, ops are persisted to a recovery table. If the server crashes mid-flush, it picks up where it left off on restart. No message loss.

```sql
-- The recovery table
CREATE TABLE write_queue_ops (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  op_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## What agents see

agentpane doesn't care what model powers the agent — it talks ACP. When you connect to a session, the `ConnectionManager`:

1. Resolves the agent binary (walks `node_modules/.bin/` for npm compatibility)
2. Spawns it as a child process with stdio pipes
3. Negotiates ACP capabilities (auth, config, modes, commands)
4. Attempts session resumption if reconnecting to a previous session

The UI adapts to whatever the agent supports. If the agent exposes configuration options, they show up as dropdowns. If it supports slash commands, you get autocomplete. If it streams thought blocks, they render as collapsible sections.

## The frontend

The web app is Next.js 16 with React 19 and the React Compiler — no manual `useMemo` or `useCallback` anywhere. State is split into two context layers:

- **SessionProvider** — active session, health checks, session CRUD
- **LayoutProvider** — pane configuration, tab ordering, drag-and-drop

Server state (sessions, conversations, token usage) is managed with TanStack React Query, invalidated on SSE events. Markdown renders as it streams in using [Streamdown](https://github.com/anthropics/streamdown) with Shiki syntax highlighting.

## Try it

```bash
npx agentpane
```

The source is on [GitHub](https://github.com/bgub/agentpane). Docs are at `apps/docs`.
