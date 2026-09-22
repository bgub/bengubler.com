import { createFileRoute } from "@tanstack/solid-router";
import { getGT, T, useGT } from "gt-fig-tanstack-start";
import { Comments } from "@/components/comments";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { getPageMetadata } from "@/lib/metadata";

export const Route = createFileRoute(
  "/{-$locale}/language-learning/czech-declensions",
)({
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: gt("Czech Case Cards - Ben Gubler"),
        description: gt("I built case cards for Czech so you don't have to."),
      }),
    };
  },
  component: CzechCaseCardsPage,
});

function CzechCaseCardsPage() {
  const gt = useGT();

  return (
    <div class="interior-wireframe case-cards-wireframe">
      <header class="page-header case-cards-header">
        <nav class="post-article-breadcrumb">
          <Link
            href="/language-learning"
            class="hover:text-foreground transition-colors no-underline"
          >
            &lsaquo; <T>Language Learning</T>
          </Link>
        </nav>
        <T>
          <PageTitle>Czech Case Cards</PageTitle>
        </T>
        <p class="case-cards-subtitle">
          {gt("I built case cards for Czech so you don't have to.")}
        </p>
        <div class="case-cards-intro">
          <T>
            <p>
              I spent many hours creating these! Print these out and you'll
              memorize the Czech declension patterns in no time.
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
                href="/language-learning/russian-declensions"
                class="text-foreground hover:underline font-medium"
              >
                Russian case cards
              </Link>
              .
            </p>
          </T>
        </div>
      </header>

      <section class="case-cards-document">
        <T>
          <h2 class="font-serif font-medium text-2xl tracking-tight text-foreground">
            Basic Case Card
          </h2>
        </T>
        <T>
          <p class="font-serif text-ink-soft font-light">
            Note: this won't display properly on mobile: go{" "}
            <Link
              href="/declensions/czech-cases-card-basic.pdf"
              class="text-foreground hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>{" "}
            to view and download the PDF in a new window.
          </p>
        </T>
        <div class="case-cards-embed">
          <embed
            src="/declensions/czech-cases-card-basic.pdf"
            width="100%"
            height="800px"
            type="application/pdf"
            class="w-full"
          />
        </div>
      </section>

      <section class="case-cards-document">
        <T>
          <h2 class="font-serif font-medium text-2xl tracking-tight text-foreground">
            Advanced Case Card
          </h2>
        </T>
        <T>
          <p class="font-serif text-ink-soft font-light">
            Note: this won't display properly on mobile: go{" "}
            <Link
              href="/declensions/czech-cases-card-advanced.pdf"
              class="text-foreground hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>{" "}
            to view and download the PDF in a new window.
          </p>
        </T>
        <div class="case-cards-embed">
          <embed
            src="/declensions/czech-cases-card-advanced.pdf"
            width="100%"
            height="800px"
            type="application/pdf"
            class="w-full"
          />
        </div>
      </section>

      <section class="case-cards-comments">
        <Comments />
      </section>
    </div>
  );
}
