import { T, useGT } from "gt-next";
import { getGT } from "gt-next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { Comments } from "@/components/comments";

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();

  return {
    title: gt("Czech Case Cards - Ben Gubler"),
    description: gt("I built case cards for Czech so you don't have to."),
  };
}

export default function CzechCaseCardsPage() {
  const gt = useGT();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <nav className="font-mono text-[11px] text-muted-foreground tracking-wide">
          <Link
            href="/language-learning"
            className="hover:text-foreground transition-colors no-underline"
          >
            &lsaquo; <T>Language Learning</T>
          </Link>
        </nav>
        <T>
          <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.02]">
            Czech Case Cards.
          </h1>
        </T>
        <p className="font-serif text-lg text-ink-soft font-light">
          {gt("I built case cards for Czech so you don't have to.")}
        </p>
      </header>

      <div className="space-y-5 font-serif text-lg text-ink-soft leading-[1.7] font-light">
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
              className="text-foreground hover:underline font-medium"
            >
              website for practicing Czech/Russian declensions
            </Link>{" "}
            or my{" "}
            <Link
              href="/language-learning/russian-declensions"
              className="text-foreground hover:underline font-medium"
            >
              Russian case cards
            </Link>
            .
          </p>
        </T>
      </div>

      <section className="space-y-4">
        <T>
          <h2 className="font-serif font-medium text-2xl tracking-tight text-foreground">
            Basic Case Card
          </h2>
        </T>
        <T>
          <p className="font-serif text-ink-soft font-light">
            Note: this won't display properly on mobile: go{" "}
            <a
              href="/declensions/czech-cases-card-basic.pdf"
              className="text-foreground hover:underline font-medium"
            >
              here
            </a>{" "}
            to view and download the PDF in a new window.
          </p>
        </T>
        <div className="w-full border border-border rounded-sm overflow-hidden">
          <embed
            src="/declensions/czech-cases-card-basic.pdf"
            width="100%"
            height="800px"
            type="application/pdf"
            className="w-full"
          />
        </div>
      </section>

      <section className="space-y-4">
        <T>
          <h2 className="font-serif font-medium text-2xl tracking-tight text-foreground">
            Advanced Case Card
          </h2>
        </T>
        <T>
          <p className="font-serif text-ink-soft font-light">
            Note: this won't display properly on mobile: go{" "}
            <a
              href="/declensions/czech-cases-card-advanced.pdf"
              className="text-foreground hover:underline font-medium"
            >
              here
            </a>{" "}
            to view and download the PDF in a new window.
          </p>
        </T>
        <div className="w-full border border-border rounded-sm overflow-hidden">
          <embed
            src="/declensions/czech-cases-card-advanced.pdf"
            width="100%"
            height="800px"
            type="application/pdf"
            className="w-full"
          />
        </div>
      </section>

      <Comments />
    </div>
  );
}
