import { msg } from "gt-fig-tanstack-start";

export const projectsData = [
  {
    id: "featured",
    category: msg("Featured"),
    projects: [
      {
        name: msg("fig"),
        description: msg(
          "small TypeScript UI runtime for apps and metaframeworks",
        ),
        links: {
          github: "https://github.com/bgub/fig",
        },
      },
      {
        name: msg("helm"),
        description: msg('AI "code mode" toolkit for TypeScript'),
        links: {
          github: "https://github.com/bgub/helm",
        },
      },
      {
        name: msg("jikei"),
        description: msg("RISC-V microkernel built from scratch in Rust"),
        links: {
          demo: "https://jikei.vercel.app",
          github: "https://github.com/bgub/jikei",
        },
      },
      {
        name: msg("eta"),
        description: msg(
          "fast embedded JS template engine, ~1.7k stars, ~6m downloads/week",
        ),
        links: {
          demo: "https://eta.js.org",
          github: "https://github.com/eta-dev/eta",
        },
      },
      {
        name: msg("tokka-bench"),
        description: msg("compare tokenizers across languages"),
        links: {
          demo: "https://tokka-bench.streamlit.app/",
          github: "https://github.com/bgub/tokka-bench",
        },
      },
      {
        name: msg("tinylingo.com"),
        description: msg(
          "language learning with native podcasts and AI transcripts",
        ),
        links: {
          demo: "https://tinylingo.com",
        },
      },
    ],
  },
  {
    id: "ai-machine-learning",
    category: msg("AI & Machine Learning"),
    projects: [
      {
        name: msg("tokka"),
        description: msg("train BPE tokenizers on custom data mixes"),
        links: {
          github: "https://github.com/bgub/tokka",
        },
      },
      {
        name: msg("hf_to_mds"),
        description: msg(
          "convert Hugging Face datasets to MosaicML Streaming format",
        ),
        links: {
          github: "https://github.com/bgub/hf_to_mds",
        },
      },
      {
        name: msg("mokka"),
        description: msg("toolkit for building small language models"),
        links: {
          github: "https://github.com/bgub/mokka",
        },
      },
      {
        name: msg("agentpane"),
        description: msg("web interface for AI coding agents"),
        links: {
          github: "https://github.com/bgub/agentpane",
        },
      },
      {
        name: msg("gom"),
        description: msg("minimal GPU monitor for Docker containers"),
        links: {
          demo: "https://pypi.org/project/gom/",
          github: "https://github.com/bgub/gom",
        },
      },
    ],
  },
  {
    id: "open-source-tools",
    category: msg("Open Source Tools"),
    projects: [
      {
        name: msg("bengubler.com"),
        description: msg("personal website and blog"),
        links: {
          demo: "https://bengubler.com",
          github: "https://github.com/nebrelbug/bengubler.com",
        },
      },
      {
        name: msg("Decline App"),
        description: msg("practice Czech, Slovak, and Russian declensions"),
        links: {
          demo: "https://decline.vercel.app/",
          github: "https://github.com/bgub/declension-practice",
        },
      },
      {
        name: msg("nix-macos-starter"),
        description: msg("starter Nix config for macOS"),
        links: {
          github: "https://github.com/nebrelbug/nix-macos-starter",
        },
      },
      {
        name: msg("shade"),
        description: msg("PyTorch-like WebGPU library for TypeScript"),
        links: {
          github: "https://github.com/bgub/shade",
        },
      },
      {
        name: msg("npm-to-yarn"),
        description: msg("convert commands between npm, Yarn, pnpm, and Bun"),
        links: {
          demo: "https://www.npmjs.com/package/npm-to-yarn",
          github: "https://github.com/bgub/npm-to-yarn",
        },
      },
    ],
  },
  {
    id: "legacy-projects",
    category: msg("Legacy Projects"),
    projects: [
      {
        name: msg("squirrelly"),
        description: msg("lightweight JavaScript template engine"),
        links: {
          demo: "https://squirrelly.js.org",
          github: "https://github.com/squirrellyjs/squirrelly",
        },
      },
      {
        name: msg("Splashpad"),
        description: msg("customizable new-tab dashboard for Chrome"),
        links: {
          demo: "https://chrome.google.com/webstore/detail/splashpad/fainejfmhojphdbbfmpomeknplpdnndb",
        },
      },
      {
        name: msg("Esperaboard"),
        description: msg("type Esperanto characters with the x-system"),
        links: {
          demo: "https://chrome.google.com/webstore/detail/esperaboard-esperanto-x-s/nkgbomaneihlabdhjihdhpdlehahahoc",
        },
      },
      {
        name: msg("Tic-Tac-Too"),
        description: msg("TensorFlow.js tic-tac-toe bot"),
        links: {
          demo: "https://tictactoe.bengubler.com/",
        },
      },
    ],
  },
];

export type Project = (typeof projectsData)[number]["projects"][number];
