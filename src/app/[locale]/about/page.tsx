import { T } from "gt-next";
import { getGT } from "gt-next/server";
import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/page-title";

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();

  return {
    title: gt("About Ben Gubler"),
    description: gt(
      "Learn more about Ben Gubler, his studies in AI, languages, and his work as a web developer.",
    ),
  };
}

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <header>
        <T>
          <PageTitle>About Me</PageTitle>
        </T>
      </header>

      <section className="space-y-5 font-serif text-lg text-ink-soft leading-[1.7] font-light">
        <T>
          <p>
            My name's Ben, but you might know me by my GitHub username,{" "}
            <Link
              href="https://github.com/bgub"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              @bgub
            </Link>
            .
          </p>
        </T>
        <T>
          <p>
            I study machine learning and (human) languages. In my free time, I
            like to build websites and open-source libraries. I'll probably post
            about all of the above from time to time.
          </p>
        </T>
        <T>
          <p>
            Check out{" "}
            <Link
              href="/about/my-stack"
              className="font-medium text-foreground hover:underline"
            >
              my stack
            </Link>{" "}
            of technologies and tools I use, browse my{" "}
            <Link
              href="/about/favorites"
              className="font-medium text-foreground hover:underline"
            >
              favorites
            </Link>{" "}
            including books and movies I love, or see what I've{" "}
            <Link
              href="/recommended"
              className="font-medium text-foreground hover:underline"
            >
              recommended
            </Link>{" "}
            for courses, papers, and learning resources. For my professional
            background, you can view my{" "}
            <a
              href="/ben-gubler-resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              résumé
            </a>
            .
          </p>
        </T>
        <T>
          <p>
            I'm currently a student at Brigham Young University in Provo, where
            I'm pursuing a major in ACME (Applied and Computational Mathematics)
            and a minor in Arabic. I'm also a research assistant in the PCCL
            (Perception, Control, and Cognition Lab) at BYU, where I study novel
            applications of artificial intelligence and Natural Language
            Processing.
          </p>
        </T>
      </section>

      <section className="space-y-5">
        <T>
          <h2 className="font-serif font-medium text-2xl tracking-tight text-foreground">
            Fun Facts
          </h2>
        </T>
        <div className="border border-border rounded-sm p-6 bg-card">
          <T>
            <ul className="list-disc space-y-3 pl-5 font-serif text-lg text-ink-soft leading-[1.7] font-light">
              <li>
                I'm passionate about language learning — I speak English, Czech,
                and Slovak, and am currently learning Russian and Arabic.
              </li>
              <li>
                I love spending time in the outdoors! Backpacking, fishing, and
                mountain biking are some of my favorite hobbies.
              </li>
              <li>I enjoy great literature, both contemporary and classic!</li>
            </ul>
          </T>
        </div>
      </section>
    </div>
  );
}
