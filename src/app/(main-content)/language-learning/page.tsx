import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";
import Link from "next/link";

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
    image: "gom.png",
  },
  {
    title: "Czech Case Cards",
    href: "/language-learning/czech-case-cards",
    description: "Handy PDFs for memorizing Czech noun declension patterns.",
    image: "gom.png",
  },
];

export default function Home() {
  return (
    <>
      <h1 className="mt-8">Language Learning</h1>
      <h2>My Tools</h2>
      <p className="text-lg text-muted-foreground">
        Here are some tools I've built to help with language learning.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myTools.map((tool) => (
          <Tool key={tool.title} tool={tool} />
        ))}
      </div>
    </>
  );
}

function Tool({ tool }: { tool: (typeof myTools)[number] }) {
  return (
    <Link
      href={tool.href}
      target={tool.href.startsWith("http") ? "_blank" : "_self"}
      className="not-prose"
    >
      <Card className="hover:shadow-lg h-full border-2 border-black">
        <CardHeader className="p-0 border-b border-black bg-black rounded-t-lg">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={"/project-images/" + tool.image || ""}
              alt={tool.title}
              fill
              className="object-cover rounded-t-xl rounded-b-none"
            />
            <div className="absolute bottom-2 left-2 right-2 px-2 rounded-sm text-sm opacity-70 bg-black text-white truncate">
              {tool.href}
            </div>
          </AspectRatio>
        </CardHeader>
        <CardContent className="grow p-4">
          <CardTitle className="mb-4">{tool.title}</CardTitle>
          <p>{tool.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
