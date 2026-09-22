import { createFileRoute } from "@tanstack/solid-router";
import { getGT, msg, T, useGT, useMessages } from "gt-fig-tanstack-start";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { getPageMetadata } from "@/lib/metadata";

export const Route = createFileRoute("/{-$locale}/language-learning/")({
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: gt("Language Learning - Ben Gubler"),
        description: gt(
          "Tools and resources for learning languages, including declension practice apps and more.",
        ),
      }),
    };
  },
  component: LanguageLearningPage,
});

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
];

function LanguageLearningPage() {
  const m = useMessages();
  const gt = useGT();
  return (
    <div class="interior-wireframe language-wireframe">
      <header class="page-header">
        <T>
          <PageTitle
            subtitle={gt(
              "Tools and resources I've built to help with language learning.",
            )}
          >
            Language Learning
          </PageTitle>
        </T>
      </header>

      <div class="language-tools-grid">
        {languageTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            target={tool.isExternal ? "_blank" : undefined}
            rel={tool.isExternal ? "noopener noreferrer" : undefined}
            class="language-tool-card group"
          >
            <div class="language-tool-head">
              <h2>{m(tool.title)}</h2>
              {tool.isExternal ? (
                <span
                  class="language-tool-icon icon-[lucide--external-link]"
                  aria-hidden="true"
                />
              ) : (
                <span
                  class="language-tool-icon language-tool-icon-internal icon-[lucide--chevron-right]"
                  aria-hidden="true"
                />
              )}
            </div>
            <p>{m(tool.description)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
