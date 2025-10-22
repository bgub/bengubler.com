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
      <header className="space-y-4">
        <nav className="text-sm text-muted-foreground">
          <Link
            href="/language-learning"
            className="hover:text-foreground transition-colors"
          >
            <T>Language Learning</T>
          </Link>
          <span className="mx-2">›</span>
          <T>
            <span>Czech Case Cards</span>
          </T>
        </nav>
        <T>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Czech Case Cards
          </h1>
        </T>
        <p className="text-lg text-muted-foreground">
          {gt("I built case cards for Czech so you don't have to.")}
        </p>
      </header>

      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
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

      <section className="space-y-6">
        <T>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Basic Case Card
          </h2>
        </T>
        <T>
          <p className="text-muted-foreground">
            Note: this won't display properly on mobile: go{" "}
            <Link
              href="/declensions/czech-cases-card-basic.pdf"
              className="text-foreground hover:underline font-medium"
            >
              here
            </Link>{" "}
            to view and download the PDF in a new window.
          </p>
        </T>
        <div className="w-full border border-[hsl(var(--border))] rounded-lg overflow-hidden">
          <embed
            src="/declensions/czech-cases-card-basic.pdf"
            width="100%"
            height="800px"
            type="application/pdf"
            className="w-full"
          />
        </div>
      </section>

      <section className="space-y-6">
        <T>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Advanced Case Card
          </h2>
        </T>
        <T>
          <p className="text-muted-foreground">
            Note: this won't display properly on mobile: go{" "}
            <Link
              href="/declensions/czech-cases-card-advanced.pdf"
              className="text-foreground hover:underline font-medium"
            >
              here
            </Link>{" "}
            to view and download the PDF in a new window.
          </p>
        </T>
        <div className="w-full border border-[hsl(var(--border))] rounded-lg overflow-hidden">
          <embed
            src="/declensions/czech-cases-card-advanced.pdf"
            width="100%"
            height="800px"
            type="application/pdf"
            className="w-full"
          />
        </div>
      </section>

      {/* Comments Section */}
      <Comments />
    </div>
  );
}
