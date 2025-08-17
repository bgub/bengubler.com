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
    category: "Featured",
    projects: [
      {
        name: "Eta",
        description: "A fast embedded JS template engine. Widely used with 1.5K+ GitHub stars and ~1M weekly downloads.",
        tech: "TypeScript, microbundle, Jest, GitHub Actions",
        links: {
          demo: "https://eta.js.org",
          github: "https://github.com/eta-dev/eta",
        },
      },
      {
        name: "tokka-bench",
        description: "Benchmark and compare tokenizers across many languages with interactive visualizations and analysis.",
        tech: "tokenizers, streamlit",
        links: {
          demo: "https://tokka-bench.streamlit.app/",
          github: "https://github.com/bgub/tokka-bench",
        },
      },
      {
        name: "shade",
        description: "PyTorch-like computation library for TS/JS using WebGPU (Work in Progress).",
        tech: "Deno, WGSL",
        links: {
          github: "https://github.com/nebrelbug/shade",
        },
      },
      {
        name: "TinyLingo",
        description: "A language learning app for improving comprehension. Listen to authentic native podcasts with AI-generated transcriptions and translations.",
        tech: "Next.js 15, Convex, Clerk, shadcn/ui, OpenRouter",
        links: {
          demo: "https://tinylingo.com",
          github: "https://github.com/nebrelbug/tinylingo",
        },
      },
    ],
  },
  {
    category: "AI & Machine Learning",
    projects: [
      {
        name: "tokka",
        description: "Toolkit for training BPE tokenizers on custom data splits with advanced configuration options.",
        tech: "tokenizers, datasets, mosaicml-streaming",
        links: {
          github: "https://github.com/bgub/tokka",
        },
      },
      {
        name: "hf_to_mds",
        description: "Convert HuggingFace datasets to MosaicML Streaming format (MDS) for efficient cloud-based training.",
        tech: "datasets, mosaicml-streaming",
        links: {
          github: "https://github.com/bgub/hf_to_mds",
        },
      },
      {
        name: "mokka",
        description: "Toolkit for creating Small Language Models (SLMs) easily, targeted towards researchers (Work in Progress).",
        tech: "PyTorch, OmegaConf, WandB",
        links: {
          github: "https://github.com/bgub/mokka",
        },
      },
      {
        name: "GOM",
        description: "Pip package with CLI tool to monitor GPU usage across Docker containers. A minimalistic alternative to 'nvidia-smi'.",
        tech: "Python, Docker, CLI",
        links: {
          demo: "https://pypi.org/project/gom/",
          github: "https://github.com/bgub/gom",
        },
      },
    ],
  },
  {
    category: "Open Source Tools",
    projects: [
      {
        name: "bengubler.com",
        description: "My personal website and blog where I write about AI, distributed training, and language learning.",
        tech: "Next.js 15, Tailwind, MDX",
        links: {
          demo: "https://bengubler.com",
          github: "https://github.com/nebrelbug/bengubler.com",
        },
      },
      {
        name: "Decline App",
        description: "PWA for practicing Czech, Slovak, and Russian declension patterns.",
        tech: "Next.js, Tailwind, PWA",
        links: {
          demo: "https://decline.vercel.app/",
          github: "https://github.com/bgub/declension-practice",
        },
      },
      {
        name: "nix-macos-starter",
        description: "Starter Nix config for macOS with sensible defaults and documentation.",
        tech: "nix-darwin, home-manager, homebrew, mise",
        links: {
          github: "https://github.com/nebrelbug/nix-macos-starter",
        },
      },
      {
        name: "npm-to-yarn",
        description: "Converts between npm/Yarn/pnpm/bun CLI commands with support for all major package managers.",
        tech: "TypeScript, Jest",
        links: {
          demo: "https://www.npmjs.com/package/npm-to-yarn",
          github: "https://github.com/bgub/npm-to-yarn",
        },
      },
    ],
  },
  {
    category: "Legacy Projects",
    projects: [
      {
        name: "Squirrelly",
        description: "A lightweight JavaScript template engine with support for helpers, partials, filters, etc. The project that helped me get into open source.",
        tech: "JavaScript, Template Engine",
        links: {
          demo: "https://squirrelly.js.org",
          github: "https://github.com/squirrellyjs/squirrelly",
        },
      },
      {
        name: "Splashpad",
        description: "A Chrome extension that turns your new tab page into a customizable dashboard.",
        tech: "JavaScript, Chrome Extension",
        links: {
          demo: "https://chrome.google.com/webstore/detail/splashpad/fainejfmhojphdbbfmpomeknplpdnndb",
        },
      },
      {
        name: "Esperaboard",
        description: "A Chrome extension to transform characters written in the Esperanto 'x-system' into Esperanto characters while typing.",
        tech: "JavaScript, Chrome Extension",
        links: {
          demo: "https://chrome.google.com/webstore/detail/esperaboard-esperanto-x-s/nkgbomaneihlabdhjihdhpdlehahahoc",
        },
      },
      {
        name: "Tic-Tac-Too",
        description: "AI tic-tac-toe bot built with TensorFlow.js. Built as a teenager while learning about ML.",
        tech: "JavaScript, TensorFlow.js, AI",
        links: {
          demo: "https://tictactoe.bengubler.com/",
        },
      },
    ],
  },
];