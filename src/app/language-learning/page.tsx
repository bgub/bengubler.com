import { msg, T, useMessages } from "gt-next";
import { getGT } from "gt-next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/page-title";
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
    title: msg("tinylingo.com"),
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
] as const;

export default function LanguageLearningPage() {
  const m = useMessages();
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <T>
          <PageTitle
            subtitle="Tools and resources I've built to help with language learning."
          >
            Language Learning
          </PageTitle>
        </T>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {languageTools.map((tool, index) => {
          const colors = getColorByIndex(index);
          return (
            <Link
              key={tool.id}
              href={tool.href}
              target={tool.isExternal ? "_blank" : undefined}
              rel={tool.isExternal ? "noopener noreferrer" : undefined}
              className="bg-card border border-border rounded-sm relative overflow-hidden transition-all duration-200 hover:shadow-md group block no-underline"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${colors.stripe}`} />
              <div className="p-4 pt-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                    {m(tool.title)}
                  </h3>
                  {tool.isExternal ? (
                    <svg className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
                <p className="font-serif text-[14.5px] leading-relaxed text-ink-soft font-light">
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
