import { msg } from "gt-next";

export type Project = {
  name: string;
  description: string;
  tech: string;
  links: {
    demo?: string;
    github?: string;
  };
};

export type ProjectSection = {
  category: string;
  projects: Project[];
};

export const projectsData: ProjectSection[] = [
  {
    category: msg("Featured"),
    projects: [
      {
        name: msg("Eta"),
        description: msg("A fast embedded JS template engine. Widely used with 1.5K+ GitHub stars and ~1M weekly downloads."),
        tech: "TypeScript, microbundle, Jest, GitHub Actions",
        links: {
          demo: "https://eta.js.org",
          github: "https://github.com/eta-dev/eta",
        },
      },
      {
        name: msg("tokka-bench"),
        description: msg("Benchmark and compare tokenizers across many languages with interactive visualizations and analysis."),
        tech: "tokenizers, streamlit",
        links: {
          demo: "https://tokka-bench.streamlit.app/",
          github: "https://github.com/bgub/tokka-bench",
        },
      },
      {
        name: msg("shade"),
        description: msg("PyTorch-like computation library for TS/JS using WebGPU (Work in Progress)."),
        tech: "Deno, WGSL",
        links: {
          github: "https://github.com/nebrelbug/shade",
        },
      },
      {
        name: msg("TinyLingo"),
        description: msg("A language learning app for improving comprehension. Listen to authentic native podcasts with AI-generated transcriptions and translations."),
        tech: "Next.js 15, Convex, Clerk, shadcn/ui, OpenRouter",
        links: {
          demo: "https://tinylingo.com",
          github: "https://github.com/nebrelbug/tinylingo",
        },
      },
    ],
  },
  {
    category: msg("AI & Machine Learning"),
    projects: [
      {
        name: msg("tokka"),
        description: msg("Toolkit for training BPE tokenizers on custom data splits with advanced configuration options."),
        tech: "tokenizers, datasets, mosaicml-streaming",
        links: {
          github: "https://github.com/bgub/tokka",
        },
      },
      {
        name: msg("hf_to_mds"),
        description: msg("Convert HuggingFace datasets to MosaicML Streaming format (MDS) for efficient cloud-based training."),
        tech: "datasets, mosaicml-streaming",
        links: {
          github: "https://github.com/bgub/hf_to_mds",
        },
      },
      {
        name: msg("mokka"),
        description: msg("Toolkit for creating Small Language Models (SLMs) easily, targeted towards researchers (Work in Progress)."),
        tech: "PyTorch, OmegaConf, WandB",
        links: {
          github: "https://github.com/bgub/mokka",
        },
      },
      {
        name: msg("GOM"),
        description: msg("Pip package with CLI tool to monitor GPU usage across Docker containers. A minimalistic alternative to 'nvidia-smi'."),
        tech: "Python, Docker, CLI",
        links: {
          demo: "https://pypi.org/project/gom/",
          github: "https://github.com/bgub/gom",
        },
      },
    ],
  },
  {
    category: msg("Open Source Tools"),
    projects: [
      {
        name: msg("bengubler.com"),
        description: msg("My personal website and blog where I write about AI, distributed training, and language learning."),
        tech: "Next.js 15, Tailwind, MDX",
        links: {
          demo: "https://bengubler.com",
          github: "https://github.com/nebrelbug/bengubler.com",
        },
      },
      {
        name: msg("Decline App"),
        description: msg("PWA for practicing Czech, Slovak, and Russian declension patterns."),
        tech: "Next.js, Tailwind, PWA",
        links: {
          demo: "https://decline.vercel.app/",
          github: "https://github.com/bgub/declension-practice",
        },
      },
      {
        name: msg("nix-macos-starter"),
        description: msg("Starter Nix config for macOS with sensible defaults and documentation."),
        tech: "nix-darwin, home-manager, homebrew, mise",
        links: {
          github: "https://github.com/nebrelbug/nix-macos-starter",
        },
      },
      {
        name: msg("npm-to-yarn"),
        description: msg("Converts between npm/Yarn/pnpm/bun CLI commands with support for all major package managers."),
        tech: "TypeScript, Jest",
        links: {
          demo: "https://www.npmjs.com/package/npm-to-yarn",
          github: "https://github.com/bgub/npm-to-yarn",
        },
      },
    ],
  },
  {
    category: msg("Legacy Projects"),
    projects: [
      {
        name: msg("Squirrelly"),
        description: msg("A lightweight JavaScript template engine with support for helpers, partials, filters, etc. The project that helped me get into open source."),
        tech: "JavaScript, Template Engine",
        links: {
          demo: "https://squirrelly.js.org",
          github: "https://github.com/squirrellyjs/squirrelly",
        },
      },
      {
        name: msg("Splashpad"),
        description: msg("A Chrome extension that turns your new tab page into a customizable dashboard."),
        tech: "JavaScript, Chrome Extension",
        links: {
          demo: "https://chrome.google.com/webstore/detail/splashpad/fainejfmhojphdbbfmpomeknplpdnndb",
        },
      },
      {
        name: msg("Esperaboard"),
        description: msg("A Chrome extension to transform characters written in the Esperanto 'x-system' into Esperanto characters while typing."),
        tech: "JavaScript, Chrome Extension",
        links: {
          demo: "https://chrome.google.com/webstore/detail/esperaboard-esperanto-x-s/nkgbomaneihlabdhjihdhpdlehahahoc",
        },
      },
      {
        name: msg("Tic-Tac-Too"),
        description: msg("AI tic-tac-toe bot built with TensorFlow.js. Built as a teenager while learning about ML."),
        tech: "JavaScript, TensorFlow.js, AI",
        links: {
          demo: "https://tictactoe.bengubler.com/",
        },
      },
    ],
  },
];