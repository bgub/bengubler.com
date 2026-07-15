---
title: "Summer 2025 in Review"
description: Things I learned and projects I made.
date: "2025-09-19"
tags: [random]
---

Originally I had planned to write about both my internship at Vercel and my personal projects/learning experiences, but I decided to split the topics into two posts. Expect to hear more about my internship soon!

In the meantime, here's a brief overview of the non-work-related events of my summer. This will function as a cross between a journal entry, blog post, and "brag list" that potential employers can see ;), so apologies in advance if it seems like I'm tooting my own horn.

## AI Projects

I finally learned how to write GPU kernels using a [few](https://developer.nvidia.com/blog/even-easier-introduction-cuda/) [cool](https://codelabs.developers.google.com/your-first-webgpu-app) [resources](https://leetgpu.com/)! In conjunction with this, I made a (very much WIP) PyTorch-like library for WebGPU-accelerated computation in JavaScript. I'm calling it [shade](https://github.com/bgub/shade) (get it, like _shaders_?) I have yet to add backpropagation, though.

I also released a few projects related to tokenization, a field which I've been very interested in: [tokka-bench](./2025-08-25-tokka-bench-evaluate-tokenizers-multilingual), a toolkit for evaluating/benchmarking tokenizers across multiple languages, and [tokka](http://github.com/bgub/tokka), a toolkit for easily training tokenizers on custom mixes of data.

Since working with large amounts of data using just HuggingFace Datasets is difficult, I wrote [hf_to_mds](https://github.com/bgub/hf_to_mds) — a script for easily converting datasets to MosaicML Streaming format and uploading them to the HuggingFace Hub! I made an [MDS version of the Wikipedia dataset](https://huggingface.co/datasets/bgub/wikipedia-mds) and would like to convert more, but am still waiting to hear back about getting my storage limits raised.

Finally, I wrote a [LessWrong article](https://www.lesswrong.com/posts/yRoXmjBKJFbc6zSFq/dialects-for-humans-sounding-distinct-from-llms?utm_campaign=post_share&utm_source=link) about how humans are changing their speech patterns to sound distinct from LLMs. It was featured on the frontpage, which is pretty neat!

## Random Stuff

- After years of procrastination, I finally learned the Vim keybindings! It's been surprisingly useful. I switched to LazyVim for a while, and now I'm on Zed.
- Speaking of Zed, I'm working on a LazyVim-inspired config with leader-key keyboard shortcuts. Hope to release it soon! I also merged a PR to [let users hide the title bar](https://github.com/zed-industries/zed/pull/37428).
- I finally bit the bullet and rebranded from `@nebrelbug` to `@bgub` on GitHub! I'm `@bgub_` on X... lmk if you know how I can get `@bgub`!
- This website looks significantly better after I updated the UI with styling help from v0. And I added a cool "Explain Like I'm 5" button for streaming AI-powered post summaries!
- Over the summer I used macOS long-term for the first time. I liked it less than I expected (auto-tiling is much worse than on Linux) so I am still daily-driving Linux on my personal machine. I used Omarchy for a few weeks, then switched back to Fedora with COSMIC desktop, which I [may have helped inspire](https://www.reddit.com/r/pop_os/comments/1empjaw/5_years_ago_i_suggested_that_system76_write_a/) (but realistically probably didn't.)
- Trying out so many different OS options made me tired of setting up my computer over and over, so I learned how to use Nix! I made a config with home-manager for my work MacBook, and an associated [public template](https://github.com/bgub/nix-macos-starter). My setup also works with Linux machines, but I haven't upstreamed those changes to the template.
- At Vercel, I wrote a 7-chapter tutorial explaining how to build a React framework from scratch. I haven't published it yet but hope to soon!

Finally, a few updates from the last few weeks (it's not technically summer anymore but I'm too tired to write more posts).

- I released a [template for TS libraries](2025-09-17-ts-base-typescript-library-template) using modern tooling like release-please, Vitest, tsdown, and Biome.
- I released a new, ESM-only version of [eta](2025-09-17-introducing-eta-v4) using said tooling.
- I updated [eta.js.org](https://eta.js.org/) and [squirrelly.js.org](https://squirrelly.js.org/) to use FumaDocs instead of Docusaurus, support better versioning, etc.
