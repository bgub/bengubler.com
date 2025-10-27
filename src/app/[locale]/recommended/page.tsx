import { msg, T, useMessages } from "gt-next/client";
import { getGT } from "gt-next/server";
import type { Metadata, Route } from "next";
import Link from "next/link";

type RecommendationItem = {
  name: string;
  url: Route;
};

type RecommendationSubsection = {
  title: string;
  items: RecommendationItem[];
};

type RecommendationSection = {
  category: string;
  subsections: RecommendationSubsection[];
};

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();
  return {
    title: gt("Recommended - Ben Gubler"),
    description: gt(
      "A curated collection of useful links and resources that Ben Gubler has found valuable.",
    ),
  };
}

const recommendations: RecommendationSection[] = [
  {
    category: msg("Computer Science"),
    subsections: [
      {
        title: msg("OS Development & Systems Programming"),
        items: [
          {
            name: msg("Writing an OS in Rust"),
            url: "https://os.phil-opp.com/",
          },
          {
            name: msg("Linux From Scratch"),
            url: "https://www.linuxfromscratch.org/",
          },
          {
            name: msg("Nand to Tetris"),
            url: "https://www.coursera.org/learn/build-a-computer",
          },
        ],
      },
      {
        title: msg("Programming Language Development & Algebraic Effects"),
        items: [
          {
            name: msg("Writing An Interpreter In Go"),
            url: "https://interpreterbook.com/",
          },
          {
            name: msg("Algebraic Effects for the Rest of Us"),
            url: "https://overreacted.io/algebraic-effects-for-the-rest-of-us/",
          },
          { name: msg("Effekt"), url: "https://effekt-lang.org/" },
        ],
      },
      {
        title: msg("Learning Languages"),
        items: [
          {
            name: msg("CodeCrafters: Build Your Own X in Rust"),
            url: "https://app.codecrafters.io/tracks/rust",
          },
          {
            name: msg("hecto: Build Your Own Text Editor in Rust"),
            url: "https://philippflenker.com/hecto/",
          },
          {
            name: msg("OCaml Programming: CS 3110"),
            url: "https://cs3110.github.io/textbook/cover.html",
          },
          { name: msg("SQLBolt"), url: "https://sqlbolt.com/" },
          {
            name: msg("Learn X in Y Minutes"),
            url: "https://learnxinyminutes.com/",
          },
        ],
      },
      {
        title: msg("Security"),
        items: [
          {
            name: msg("OverTheWire Wargames"),
            url: "https://overthewire.org/wargames/",
          },
        ],
      },
      {
        title: msg("Other"),
        items: [
          { name: msg("Redox OS"), url: "https://www.redox-os.org/" },
          { name: msg("Omarchy"), url: "https://omarchy.org/" },
          {
            name: msg("Cosmic Desktop Environment"),
            url: "https://system76.com/cosmic/",
          },
          { name: msg("Textual"), url: "https://www.textualize.io/" },
        ],
      },
    ],
  },
  {
    category: msg("Artificial Intelligence"),
    subsections: [
      {
        title: msg("Learning the Basics"),
        items: [
          {
            name: msg("Neural Networks: Zero to Hero"),
            url: "https://karpathy.ai/zero-to-hero.html",
          },
          {
            name: msg("From GPT-2 to GPT-OSS"),
            url: "https://magazine.sebastianraschka.com/p/from-gpt-2-to-gpt-oss-analyzing-the",
          },
        ],
      },
      {
        title: msg("GPU & High-Performance Programming"),
        items: [
          {
            name: msg("GPU and Tensor Puzzles"),
            url: "https://github.com/srush/gpu-puzzles",
          },
          { name: msg("LeetCode for GPUs"), url: "https://leetgpu.com/" },
          {
            name: msg("Your First WebGPU App"),
            url: "https://codelabs.developers.google.com/your-first-webgpu-app",
          },
        ],
      },
      {
        title: msg("Interpretability"),
        items: [
          {
            name: msg("Transformer Circuits"),
            url: "https://transformer-circuits.pub/2023/monosemantic-features/index.html",
          },
          {
            name: msg("Scaling Monosemanticity"),
            url: "https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html",
          },
          {
            name: msg("How does a blind model see the earth?"),
            url: "https://outsidetext.substack.com/p/how-does-a-blind-model-see-the-earth",
          },
        ],
      },
      {
        title: msg("Specialized Topics & Applications"),
        items: [
          {
            name: msg("Train a Reasoning Model with GRPO"),
            url: "https://docs.unsloth.ai/basics/reasoning-grpo-and-rl/tutorial-train-your-own-reasoning-model-with-grpo",
          },
          {
            name: msg("Simple GRPO Implementation"),
            url: "https://github.com/lsdefine/simple_GRPO",
          },
          {
            name: msg("COMET Framework"),
            url: "https://unbabel.github.io/COMET/html/installation.html",
          },
        ],
      },
    ],
  },
  {
    category: msg("Mathematics & Formal Methods"),
    subsections: [
      {
        title: msg("Learning Resources"),
        items: [
          {
            name: msg("An Infinitely Large Napkin"),
            url: "https://web.evanchen.cc/napkin.html",
          },
        ],
      },
      {
        title: msg("Theorem Proving"),
        items: [
          {
            name: msg("The Natural Number Game"),
            url: "https://adam.math.hhu.de/#/g/leanprover-community/nng4",
          },
        ],
      },
    ],
  },
  {
    category: msg("Linguistics"),
    subsections: [
      {
        title: msg("Conlang Design"),
        items: [
          {
            name: msg("The Language Construction Kit"),
            url: "https://www.zompist.com/",
          },
        ],
      },
      {
        title: msg("Toki Pona"),
        items: [
          {
            name: msg("Toki Pona in 18 Minutes"),
            url: "https://www.youtube.com/watch?v=5phj5Ae80h8",
          },
          {
            name: msg("Pepper & Carrot in Toki Pona"),
            url: "https://peppercarrot.com/tp/",
          },
        ],
      },
      {
        title: msg("Other"),
        items: [
          { name: msg("Shavian School"), url: "https://shavian.school" },
          {
            name: msg("Greek New Testament Study Edition"),
            url: "https://bencrowder.net/greek-new-testament-study-edition/",
          },
        ],
      },
    ],
  },
  {
    category: msg("Miscellaneous"),
    subsections: [
      {
        title: msg("Fun & Interesting"),
        items: [
          {
            name: msg("The Divergent Association Task"),
            url: "https://www.datcreativity.com/",
          },
        ],
      },
    ],
  },
];

export default function RecommendedPage() {
  const m = useMessages();
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <T>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Recommended
          </h1>
        </T>
        <T>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A curated collection of useful links and resources I've found
            valuable.
          </p>
        </T>
      </header>

      {recommendations.map((section) => (
        <section key={m(section.category)} className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {m(section.category)}
          </h2>
          <div className="space-y-2">
            {section.subsections.map((subsection) => (
              <div key={m(subsection.title)} className="space-y-1">
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">
                    {m(subsection.title)}
                  </span>
                  :{" "}
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
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
