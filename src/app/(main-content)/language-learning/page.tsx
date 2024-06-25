import { CardGrid, ProjectCard } from "@/components/CardGrid";

export const metadata = {
  title: "Language Learning",
  description: "Tools for learning languages.",
};

export default function Home() {
  return (
    <>
      <h1 className="mt-8">{metadata.title}</h1>
      <h2>My Tools</h2>
      <p className="text-lg text-muted-foreground">
        Here are some tools I&apos;ve built to help with language learning.
      </p>
      <CardGrid>
        {myTools.map((tool) => (
          <ProjectCard
            key={tool.title}
            project={{
              ...tool,
              image: "/language-learning-images/" + tool.image,
            }}
          />
        ))}
      </CardGrid>
    </>
  );
}

const myTools = [
  {
    title: "Decline App",
    href: "https://decline.vercel.app/",
    description:
      "A website for practicing Czech, Slovak, and Russian noun declensions.",
    image: "decline.png",
  },
  {
    title: "Russian Case Cards",
    href: "/language-learning/russian-case-cards",
    description: "Handy PDFs for memorizing Russian noun declension patterns.",
    image: "russian-cases.png",
  },
  {
    title: "Czech Case Cards",
    href: "/language-learning/czech-case-cards",
    description: "Handy PDFs for memorizing Czech noun declension patterns.",
    image: "czech-cases.png",
  },
];
