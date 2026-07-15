---
title: "Introducing Eta v4"
description: "Making Eta ESM-only, changing package scope, and improving CI/CD."
date: "2025-09-17T11:30:00-06:00"
tags: [open-source]
---

I released Eta for the first time five years ago! Since then, it's grown to be depended on by hundreds of packages and downloaded 1M+ times per week.

I consider Eta to be mostly "a completed work" since v3, which was released in June 2023. But I wasn't satisfied with the bundling, testing, linting, and CI/CD aspects of the project so I rewrote it! (Then extracted my changes, after the fact, into a [new TS library template called ts-base](https://www.bengubler.com/posts/2025-09-17-ts-base-typescript-library-template)).

There are a few more changes to be aware of:

- Eta is now ESM-only by default. It's 2025 and this is the right choice!
- I transferred the repository (and other associated repositories) to my personal GitHub account, [bgub](https://github.com/bgub). Since I'm the primary contributor, I think this will simplify maintenance and reduce confusion.
- Eta will continue to be published on https://deno.land/x/, but I recommend that users use https://jsr.io/@bgub/eta instead.
- To use the browser-compatible version of Eta, you must import from `eta/core`, since we're now using much cleaner `"exports"` in our `package.json`.
