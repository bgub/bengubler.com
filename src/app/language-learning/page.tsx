import { msg, T, useMessages } from "gt-next";
import { getGT } from "gt-next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { getColorByIndex } from "@/lib/colors";

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();
  return {
    title: gt("Language Learning - Ben Gubler"),
    description: gt(
      "Tools and resources for learning languages, including declension practice apps and more.",
    ),
  };
}

const languageTools = [
  {
    id: "tinylingo",
    title: msg("TinyLingo"),
    description: msg(
      "AI-powered website to learn languages with personalized lessons and interactive practice sessions.",
    ),
    href: "https://tinylingo.com/",
    isExternal: true,
  },
  {
    id: "decline-app",
    title: msg("Decline App"),
    description: msg(
      "A comprehensive website for practicing Czech, Slovak, and Russian noun declensions with interactive exercises.",
    ),
    href: "https://decline.vercel.app/",
    isExternal: true,
  },
  {
    id: "czech-case-cards",
    title: msg("Czech Case Cards"),
    description: msg(
      "Printable case cards for memorizing Czech noun declension patterns quickly and effectively.",
    ),
    href: "/language-learning/czech-declensions",
    isExternal: false,
  },
  {
    id: "russian-case-cards",
    title: msg("Russian Case Cards"),
    description: msg(
      "Printable case cards for memorizing Russian noun declension patterns quickly and effectively.",
    ),
    href: "/language-learning/russian-declensions",
    isExternal: false,
  },
];

export default function LanguageLearningPage() {
  const m = useMessages();
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <T>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Language Learning
          </h1>
        </T>
        <T>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Tools and resources I've built to help with language learning.
          </p>
        </T>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {languageTools.map((tool, index) => {
          const colors = getColorByIndex(index);
          return (
            <Link
              key={tool.id}
              href={tool.href}
              target={tool.isExternal ? "_blank" : undefined}
              rel={tool.isExternal ? "noopener noreferrer" : undefined}
              className={`${colors.bg} ${colors.border} border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group block`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/90 transition-colors">
                    {m(tool.title)}
                  </h3>
                  <svg
                    className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        tool.isExternal
                          ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          : "M9 5l7 7-7 7"
                      }
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {m(tool.description)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
