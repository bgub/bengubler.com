import { ProjectCard } from "@/components/project-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Ben Gubler",
  description:
    "A collection of Ben Gubler's projects, from featured work to experimental builds.",
};

const projectsData = [
  {
    category: "Featured",
    items: [
      {
        id: "1",
        title: "Eta",
        description:
          "A super-fast embedded JS template engine that supports Deno.",
        tech: ["JavaScript", "TypeScript", "Template Engine"],
        links: {
          demo: "https://eta.js.org",
          github: "https://github.com/eta-dev/eta",
        },
        image: "eta.png",
      },
      {
        id: "2",
        title: "Decline App",
        description:
          "A website for practicing Czech, Slovak, and Russian noun declensions.",
        tech: ["Next.js", "React", "TypeScript"],
        links: {
          demo: "https://decline.vercel.app/",
          github: "https://github.com/nebrelbug/declension-practice",
        },
        image: "decline.png",
      },
      {
        id: "3",
        title: "GOM",
        description:
          "Pip package with CLI tool to monitor GPU usage across Docker containers. A minimalistic alternative to 'nvidia-smi'.",
        tech: ["Python", "Docker", "CLI"],
        links: {
          demo: "https://pypi.org/project/gom/",
          github: "https://github.com/nebrelbug/gom",
        },
        image: "gom.png",
      },
    ],
  },
  {
    category: "Other",
    items: [
      {
        id: "4",
        title: "npm-to-yarn",
        description:
          "An npm package for converting CLI commands between npm, Yarn, and pnpm.",
        tech: ["JavaScript", "Node.js", "CLI"],
        links: {
          github: "https://github.com/nebrelbug/npm-to-yarn",
        },
        image: "npm-to-yarn.png",
      },
      {
        id: "5",
        title: "Squirrelly",
        description:
          "A lightweight JavaScript template engine with support for helpers, partials, filters, etc. I'm not actively developing it, but this is the project that helped me get into open source.",
        tech: ["JavaScript", "Template Engine"],
        links: {
          demo: "https://squirrelly.js.org",
          github: "https://github.com/squirrellyjs/squirrelly",
        },
        image: "squirrelly.png",
      },
    ],
  },
  {
    category: "Old",
    items: [
      {
        id: "6",
        title: "Splashpad",
        description:
          "A Chrome extension that turns your new tab page into a customizable dashboard.",
        tech: ["JavaScript", "Chrome Extension"],
        links: {
          demo: "https://chrome.google.com/webstore/detail/splashpad/fainejfmhojphdbbfmpomeknplpdnndb",
        },
        image: "splashpad.png",
      },
      {
        id: "7",
        title: "Esperaboard",
        description:
          "A Chrome extension to transform characters written in the Esperanto 'x-system' into Esperanto characters while typing.",
        tech: ["JavaScript", "Chrome Extension"],
        links: {
          demo: "https://chrome.google.com/webstore/detail/esperaboard-esperanto-x-s/nkgbomaneihlabdhjihdhpdlehahahoc",
        },
        image: "esperaboard.png",
      },
      {
        id: "8",
        title: "Tic-Tac-Too",
        description:
          "AI tic-tac-toe bot built with TensorFlow.js. I built this as a teenager, while just starting to learn about ML, so it's definitely not the best code. But it was a great learning experience.",
        tech: ["JavaScript", "TensorFlow.js", "AI"],
        links: {
          demo: "https://tictactoe.bengubler.com/",
        },
        image: "tic-tac-too.png",
      },
    ],
  },
];

const borderColors = [
  "border-sky-500/30 hover:border-sky-500/60 dark:border-sky-500/20 dark:hover:border-sky-500/40",
  "border-emerald-500/30 hover:border-emerald-500/60 dark:border-emerald-500/20 dark:hover:border-emerald-500/40",
  "border-amber-500/30 hover:border-amber-500/60 dark:border-amber-500/20 dark:hover:border-amber-500/40",
  "border-purple-500/30 hover:border-purple-500/60 dark:border-purple-500/20 dark:hover:border-purple-500/40",
  "border-pink-500/30 hover:border-pink-500/60 dark:border-pink-500/20 dark:hover:border-pink-500/40",
  "border-orange-500/30 hover:border-orange-500/60 dark:border-orange-500/20 dark:hover:border-orange-500/40",
];

const projects = projectsData.map((section) => ({
  ...section,
  items: section.items.map((project, index) => ({
    ...project,
    borderColor: borderColors[index % borderColors.length],
  })),
}));

export default function ProjectsPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Projects
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A collection of things I've built over the years, from open-source
          libraries to web applications and browser extensions.
        </p>
      </header>

      {projects.map((section) => (
        <section key={section.category} className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {section.category}
          </h2>
          <div className="@container">
            <div className="grid gap-8 @lg:grid-cols-2 @2xl:grid-cols-3">
              {section.items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
