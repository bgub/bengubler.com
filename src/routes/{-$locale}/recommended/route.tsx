import { createFileRoute } from "@tanstack/react-router";
import { getGT, T, useGT, useMessages } from "gt-tanstack-start";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { getPageMetadata } from "@/lib/metadata";
import { recommendations } from "./-data";

export const Route = createFileRoute("/{-$locale}/recommended")({
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: gt("Recommended - Ben Gubler"),
        description: gt(
          "A curated collection of useful links and resources that Ben Gubler has found valuable.",
        ),
      }),
    };
  },
  component: RecommendedPage,
});

function RecommendedPage() {
  const m = useMessages();
  const gt = useGT();
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <T>
          <PageTitle
            subtitle={gt(
              "A curated collection of useful links and resources I've found valuable.",
            )}
          >
            Recommended
          </PageTitle>
        </T>
      </header>

      {recommendations.map((section) => (
        <section key={m(section.category)} className="space-y-3">
          <div className="flex items-baseline gap-3.5">
            <h2 className="font-serif font-medium text-2xl tracking-tight text-foreground">
              {m(section.category)}
            </h2>
            <div className="flex-1 border-t border-dotted border-ink-faint mt-1.5" />
          </div>
          <div>
            {section.subsections.map((subsection) => (
              <div
                key={m(subsection.title)}
                className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 py-2.5 border-b border-dotted border-border"
              >
                <span className="font-serif font-medium text-foreground whitespace-nowrap">
                  {m(subsection.title)}
                </span>
                <span className="font-serif text-ink-soft font-light">
                  {subsection.items.map((item, index) => (
                    <span key={m(item.name)}>
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                      >
                        {m(item.name)}
                      </Link>
                      {index < subsection.items.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
