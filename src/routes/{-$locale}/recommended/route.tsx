import { createFileRoute } from "@tanstack/solid-router";
import { getGT, T, useGT, useMessages } from "gt-fig-tanstack-start";
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
    <div class="space-y-12">
      <header class="space-y-3">
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
        <section key={m(section.category)} class="space-y-3">
          <div class="flex items-baseline gap-3.5">
            <h2 class="font-serif font-medium text-2xl tracking-tight text-foreground">
              {m(section.category)}
            </h2>
            <div class="flex-1 border-t border-dotted border-ink-faint mt-1.5" />
          </div>
          <div>
            {section.subsections.map((subsection) => (
              <div
                key={m(subsection.title)}
                class="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 py-2.5 border-b border-dotted border-border"
              >
                <span class="font-serif font-medium text-foreground whitespace-nowrap">
                  {m(subsection.title)}
                </span>
                <span class="font-serif text-ink-soft font-light">
                  {subsection.items.map((item, index) => (
                    <span key={m(item.name)}>
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline hover:no-underline"
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
