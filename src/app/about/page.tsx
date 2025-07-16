import { getColorByIndex } from "@/lib/colors";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Ben Gubler",
  description:
    "Learn more about Ben Gubler, his studies in AI, languages, and his work as a web developer.",
};

export default function AboutPage() {
  const colors = getColorByIndex(0); // Use first color for consistency

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          About Me
        </h1>
      </header>

      <section className="space-y-6 text-lg text-muted-foreground leading-relaxed">
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
        <p>
          I study machine learning and (human) languages. In my free time, I
          like to build websites and open-source libraries. I'll probably post
          about all of the above from time to time.
        </p>
        <p>
          I'm currently a student at Brigham Young University in Provo, where
          I'm pursuing a major in ACME (Applied and Computational Mathematics)
          and a minor in Arabic. I'm also a research assistant in the PCCL
          (Perception, Control, and Cognition Lab) at BYU, where I study novel
          applications of artificial intelligence and Natural Language
          Processing.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Fun Facts
        </h2>
        <div
          className={`${colors.bg} ${colors.border} border rounded-lg p-6 shadow-sm transition-all duration-300 hover:shadow-lg`}
        >
          <ul className="list-disc space-y-3 pl-5 text-lg text-muted-foreground leading-relaxed">
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
        </div>
      </section>
    </div>
  );
}
