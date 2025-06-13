import { getColorByIndex } from "./colors";

const featuredProjectsData = [
  {
    id: "1",
    title: "Eta",
    description: "A super-fast embedded JS template engine that supports Deno.",
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
];

export const featuredProjects = featuredProjectsData.map((project, index) => {
  const colors = getColorByIndex(index);
  return {
    ...project,
    borderColor: colors.border,
  };
});
