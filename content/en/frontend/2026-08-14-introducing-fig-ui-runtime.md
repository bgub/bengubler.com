---
title: "Introducing Fig"
description: "A small TypeScript UI runtime based on React Fiber."
date: "2026-08-14"
tags: [frontend, open-source]
---

## Quick Intro

[Fig](https://github.com/bgub/fig) is a TypeScript UI runtime based on React. Quick pitch:

- Roughly 50% the bundle size of React
- Full fiber/concurrent rendering support
- Built-in keyed data resources with Suspense, streaming SSR/hydration, stale-while-refresh
- Server components, but easy-to-understand
  - Inspired by TanStack, we treat server components as just data that can be streamed and rendered. When you refresh the key, the boundary re-renders. You can even change the wire format.
- Effects, events, DOM bindings, transitions, actions, and data loaders all take `AbortSignal`
- (Slightly) faster rendering performance
- Adapters for TanStack Router and TanStack Start
- Nice features meant for framework creators (easy ways to granularly declare component dependencies on CSS or other assets)

My personal website (<https://bengubler.com>) is built using Fig TanStack Start. Feel free to take a look at the [source](https://github.com/bgub/bengubler.com) or **ask your agent what it thinks**!

There are some minor syntax differences from React, but migrating your site (if you use a Vite-based framework) should be trivial thanks to LLMs!

## Fig's Philosophy

It's become a bit fashionable to hate on React, but that's because it **clearly won**. React is a beautiful and elegant way to express view as a function of state. Fiber/concurrent rendering are brilliant (article coming soon). Server components can help eliminate network waterfalls and trim down client bundle size. Performance, contra what you see online, is easily good enough for any practical use case if you write good code. Signal-based frameworks sound really nice in theory, but in practice often have complicated tradeoffs around things like SSR, server components, and dev HMR.

With the passage of time, frameworks become slightly larger, get locked into old decisions, and have to maintain backwards compatibility. Fig is an attempt to reimplement the beautiful core ideas of React in a slightly smaller package with some different API decisions. In general I try to steer Fig towards using platform semantics (`AbortSignal`s instead of React's cleanup functions) and a high-level API that's easy to use without a metaframework.

In most cases, API methods with the same name as React will also share the same signature! When they're meaningfully different, Fig usually uses a different name.

## Components

```tsx
import { createMixin } from "@bgub/fig";

const externalLink = createMixin((_context, label: string) => ({
  target: "_blank",
  rel: "noopener noreferrer",
  "aria-label": `${label} (opens in a new tab)`,
}));

function Greeting() {
  return (
    <>
      <h1 class="greeting">Hello from Fig!</h1>
      <a
        href="https://github.com/bgub/fig"
        mix={externalLink("View the source")}
      >
        View the source
      </a>
    </>
  );
}
```

In Fig, there are **only function components**, no class components. If you need to catch an error, Fig has a built-in `ErrorBoundary` you can use or wrap rather than defining your own using a class component.

Inspired by Remix V3, we also support mixins that let you create reusable utilities for props! The example above is a bit contrived but mixins are really useful for accessibility (especially when you pair them with event handlers, see further down the page).

One other important thing to note: Fig uses **native attribute names**, like `class` instead of `className` and `autocomplete` instead of `autoComplete`. This lets us share the same types with native HTML.

Oh, also we renamed `dangerouslySetInnerHTML` to `unsafeHTML`.

## Hooks and Transitions

```tsx
function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<string[]>([]);
  const [isPending, startSearchTransition] = useTransition();

  useReactive(() => {
    startSearchTransition(async (signal) => {
      const url = `/api/search?q=${encodeURIComponent(query)}`
      const response = await fetch(url, { signal });
      setResults(await response.json());
    });
  }, [query]);

  return <p>{isPending ? "Searching…" : results.join(", ")}</p>;
}
```

`useState` is just the same as React. `useReactive` is Fig's version of `useEffect`; just like in React, it runs after a component mounts and then after every committed render when its (optional) dependencies have changed. A transition groups state updates within its scope into lower-priority work that can be pre-empted.

Unlike React effects, Fig effects take an `AbortSignal` instead of returning a cleanup function. This makes auto-cancelling superseded network calls easy!

We renamed lifecycle hooks from their React equivalents 1) for clarity and 2) so neither you nor agents get mixed up. Quick cheatsheet:

| React                    | Fig                   |
| ------------------------ | ----------------------|
| `useEffect`              | `useReactive`         |
| `useLayoutEffect`        | `useBeforePaint`      |
| `useInsertionEffect`     | `useBeforeLayout`     |
| `useEffectEvent`         | `useStableEvent`      |

## Event Handlers

```tsx
import { useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";

function Counter() {
  const [count, setCount] = useState(0);
  const onClick = on("click", () => setCount((count) => count + 1));

  return <button mix={onClick}>Count: {count}</button>;
}
```

Event handlers use mixins too! This makes it really easy to create accessibility utilities like `button` without adding wrapper elements.

Event handlers receive an `AbortSignal` which aborts on re-entry and listener removal. They use native browser events under the hood, instead of synthetic like React.

## DOM Binding

```tsx
function SearchInput() {
  return (
    <input
      type="search"
      bind={(input) => {
        input.focus();
        input.select();
      }}
    />
  );
}
```

Fig uses `bind` for DOM access instead of refs, `forwardRef`, and `.current`. If you want persistent access to an HTML element, you can just do something like this:

```tsx
const ref = useMemo(() => ({ current: null }), [])
return <input bind={(node) => (input.current = node)} />
```

## Suspense

```tsx
import { readPromise, Suspense } from "@bgub/fig";

function Greeting({ name }: { name: Promise<string> }) {
  return <h1>Hello, {readPromise(name)}!</h1>;
}

function App({ name }: { name: Promise<string> }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Greeting name={name} />
    </Suspense>
  );
}
```

In Fig, React's `use` is split into `readPromise`, `readContext`, and `readData` (see below). `readPromise` and `readData` can trigger Suspense by throwing a pending promise; `readContext` is always synchronous.

The promise has to have stable identity (pass it in or memoize it instead of creating it every render).

## Context

```tsx
import { createContext, readContext } from "@bgub/fig";

const Theme = createContext("light");

function App() {
  return (
    <Theme value="dark">
      <Toolbar />
    </Theme>
  );
}

function Toolbar() {
  const theme = readContext(Theme);
  return <div class={`toolbar toolbar-${theme}`}>Toolbar</div>;
}
```

Contexts are their own providers, so you don't need `.Provider` or `.Consumer`.

`readContext` replaces `useContext(ctx)` and `use(ctx)` in React. It doesn't consume a hook slot, so you can call it conditionally (like `use`, unlike `useContext`).

## Data Resources

```tsx
import { dataResource, readData, refreshData } from "@bgub/fig";
import { on } from "@bgub/fig-dom";

const userResource = dataResource({
  key: (id: string) => ["user", id],
  load: (id, { signal }) => fetchUser(id, signal),
});

function Profile({ id }: { id: string }) {
  const user = readData(userResource, id);

  return (
    <section>
      <h1>{user.name}</h1>
      <button mix={on("click", () => void refreshData(userResource, id))}>
        Refresh
      </button>
    </section>
  );
}
```

This feature is particularly helpful for library and framework authors! `readData()` keys the data, suspends during loading, and subscribes the component that called it. When you call `refreshData`, the existing value stays visible until its replacement arrives.

## Server Components (Without a Metaframework)

```tsx
// server.tsx
import { renderToPayloadStream } from "@bgub/fig-server/payload";
import { getUser } from "./database.server.ts";

async function Profile({ id }: { id: string }) {
  const user = await getUser(id);
  return <h1>Hello, {user.name}!</h1>;
}

export function renderProfile(id: string): Response {
  const payload = renderToPayloadStream(<Profile id={id} />);

  return new Response(payload.stream, {
    headers: { "content-type": payload.contentType },
  });
}

// client.tsx
import { refreshData, Suspense } from "@bgub/fig";
import { createPayloadComponent, on } from "@bgub/fig-dom";

const ProfilePage = createPayloadComponent<{ id: number }>({
  key: ["profile"],
  load: ({ id }, { signal }) => fetch(`/profile/${id}`, { signal }),
});

function App() {
  const id = 42;
  const refreshOnClick = on("click", () => void refreshData(ProfilePage, { id }));

  return (
    <>
      <Suspense fallback={<p>Loading profile…</p>}>
        <ProfilePage id={id} />
      </Suspense>
      <button mix={refreshOnClick}>Refresh profile</button>
    </>
  );
}
```

Server components are one of the **most powerful parts of Fig**, and you can use them even without a metaframework.

They're just regular components that we render and serialize to JSON. We use the term "Payload" to differentiate from RSCs and because we use our own wire format. When you refresh the payload stream, the old version stays visible while its replacement streams in.

## Server Components (With a Metaframework)

```tsx
import { refreshData, Suspense } from "@bgub/fig";
import { createPayloadComponent, on } from "@bgub/fig-dom";
import { serverPayload } from "@bgub/fig-tanstack-start/payload";
import { getUser } from "./database.server.ts";

// this component only runs on the server!
// any refresh streams the new serialized payload to the browser
const ProfilePage = createPayloadComponent<{ id: number }>({
  key: ["profile"],
  load: serverPayload(async ({ id }) => {
    const user = await getUser(id);
    return <h1>Hello, {user.name}!</h1>;
  }),
});

function App() {
  const id = 42;
  const refreshOnClick = on("click", () => void refreshData(ProfilePage, { id }));

  return (
    <>
      <Suspense fallback={<p>Loading profile…</p>}>
        <ProfilePage id={id} />
      </Suspense>
      <button mix={refreshOnClick}>Refresh profile</button>
    </>
  );
}
```

Here, TanStack turns `serverPayload()` into a private server-only function (it turns the `load` into a function which calls a tiny generated API route).

## Asset Resources

```tsx
import { assets, preconnect, stylesheet } from "@bgub/fig";

function Map() {
  return assets(
    [
      stylesheet("/map.css", { precedence: "components" }),
      preconnect("https://tiles.example.com"),
    ],
    <div class="map">...</div>,
  );
}
```

Fig is meant to be really good at building metaframeworks. These assets are only discovered if/when `Map` renders. Fig handles deduplicating, hoisting, and makes sure blocking stylesheets load before revealing the dependent content.

## View Transitions

```tsx
import { transition, useState, ViewTransition } from "@bgub/fig";
import { on } from "@bgub/fig-dom";
import { enableViewTransitions } from "@bgub/fig-dom/view-transitions";

enableViewTransitions();

function Counter() {
  const [count, setCount] = useState(0);
  const incrementOnClick = on("click", () => transition(() => setCount((c) => c + 1)))

  return (
    <>
      <button mix={incrementOnClick}>Increment</button>
      <ViewTransition name="count">
        <p>Count: {count}</p>
      </ViewTransition>
    </>
  );
}
```

Fig has native support for view transitions! For the sake of limiting bundle size, you have to explicitly enable them. You can see some cool examples on my website.

## Other

The following APIs are mostly the same as React: `useState`, `useMemo`, `useCallback`, `useId`, `useDeferredValue`, `useSyncExternalStore`, `createElement`, `isValidElement`, `Fragment`, `createPortal`, `flushSync`, `Suspense`, `Activity`, `createRoot`, `hydrateRoot`, root `.render()` and `.unmount()`.

## Try It

I've been working on Fig for the last few months. I can't promise stability, but it has been fairly well-tested. Give your agent this prompt:

```
Rewrite my site using Fig TanStack Start. Use https://github.com/bgub/bengubler.com as a reference.

Compare bundle size and performance before and after.
```

Check out the source and documentation on [GitHub](https://github.com/bgub/fig)!
