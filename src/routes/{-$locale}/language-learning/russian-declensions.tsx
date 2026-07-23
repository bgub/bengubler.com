import { createFileRoute } from "@tanstack/solid-router";
import { getGT, T, useGT } from "gt-fig-tanstack-start";
import { Comments } from "@/components/comments";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { getPageMetadata } from "@/lib/metadata";

export const Route = createFileRoute(
  "/{-$locale}/language-learning/russian-declensions",
)({
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: gt("Russian Case Cards - Ben Gubler"),
        description: gt("I built case cards for Russian so you don't have to."),
      }),
    };
  },
  component: RussianCaseCardsPage,
});

function RussianCaseCardsPage() {
  const gt = useGT();

  return (
    <div class="space-y-8">
      <header class="space-y-3">
        <nav class="font-mono text-[11px] text-muted-foreground tracking-wide">
          <Link
            href="/language-learning"
            class="hover:text-foreground transition-colors no-underline"
          >
            &lsaquo; <T>Language Learning</T>
          </Link>
        </nav>
        <T>
          <PageTitle>Russian Case Cards</PageTitle>
        </T>
        <p class="font-serif text-lg text-ink-soft font-light">
          {gt("I built case cards for Russian so you don't have to.")}
        </p>
      </header>

      <div class="space-y-5 font-serif text-lg text-ink-soft leading-[1.7] font-light">
        <T>
          <p>
            I spent many hours creating this! Print it out and you'll memorize
            the Russian declension patterns in no time.
          </p>
        </T>

        <T>
          <p>
            You may also be interested in my{" "}
            <Link
              href="https://decline.vercel.app/"
              class="text-foreground hover:underline font-medium"
            >
              website for practicing Czech/Russian declensions
            </Link>{" "}
            or my{" "}
            <Link
              href="/language-learning/czech-declensions"
              class="text-foreground hover:underline font-medium"
            >
              Czech case cards
            </Link>
            .
          </p>
        </T>
      </div>

      <section class="space-y-4">
        <T>
          <h2 class="font-serif font-medium text-2xl tracking-tight text-foreground">
            Case Card
          </h2>
        </T>
        <T>
          <p class="font-serif text-ink-soft font-light">
            Note: this won't display properly on mobile: go{" "}
            <Link
              href="/declensions/russian-cases-card.pdf"
              class="text-foreground hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>{" "}
            to view and download the PDF in a new window.
          </p>
        </T>
        <div class="w-full border border-border rounded-sm overflow-hidden">
          <embed
            src="/declensions/russian-cases-card.pdf"
            width="100%"
            height="800px"
            type="application/pdf"
            class="w-full"
          />
        </div>
      </section>

      <Comments />
    </div>
  );
}
