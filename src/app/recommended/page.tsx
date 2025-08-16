import type { Metadata } from "next";
import Link from "next/link";

type RecommendationItem = {
  name: string;
  url: string;
};

type RecommendationSubsection = {
  title: string;
  items: RecommendationItem[];
};

type RecommendationSection = {
  category: string;
  subsections: RecommendationSubsection[];
};

export const metadata: Metadata = {
  title: "Recommended - Ben Gubler",
  description:
    "A curated collection of useful links and resources that Ben Gubler has found valuable.",
};

const recommendations: RecommendationSection[] = [
  {
    category: "Computer Science",
    subsections: [
      {
        title: "OS Development & Systems Programming",
        items: [
          { name: "Writing an OS in Rust", url: "https://os.phil-opp.com/" },
          {
            name: "Linux From Scratch",
            url: "https://www.linuxfromscratch.org/",
          },
          {
            name: "Nand to Tetris",
            url: "https://www.coursera.org/learn/build-a-computer",
          },
        ],
      },
      {
        title: "Programming Language Development & Algebraic Effects",
        items: [
          {
            name: "Writing An Interpreter In Go",
            url: "https://interpreterbook.com/",
          },
          {
            name: "Algebraic Effects for the Rest of Us",
            url: "https://overreacted.io/algebraic-effects-for-the-rest-of-us/",
          },
          { name: "Effekt", url: "https://effekt-lang.org/" },
        ],
      },
      {
        title: "Learning Languages",
        items: [
          {
            name: "CodeCrafters: Build Your Own X in Rust",
            url: "https://app.codecrafters.io/tracks/rust",
          },
          {
            name: "hecto: Build Your Own Text Editor in Rust",
            url: "https://philippflenker.com/hecto/",
          },
          {
            name: "OCaml Programming: CS 3110",
            url: "https://cs3110.github.io/textbook/cover.html",
          },
          { name: "SQLBolt", url: "https://sqlbolt.com/" },
          {
            name: "Learn X in Y Minutes",
            url: "https://learnxinyminutes.com/",
          },
        ],
      },
      {
        title: "Security",
        items: [
          {
            name: "OverTheWire Wargames",
            url: "https://overthewire.org/wargames/",
          },
        ],
      },
      {
        title: "Other",
        items: [
          { name: "Redox OS", url: "https://www.redox-os.org/" },
          { name: "Omarchy", url: "https://omarchy.org/" },
          {
            name: "Cosmic Desktop Environment",
            url: "https://system76.com/cosmic/",
          },
          { name: "Textual", url: "https://www.textualize.io/" },
        ],
      },
    ],
  },
  {
    category: "Artificial Intelligence",
    subsections: [
      {
        title: "Learning the Basics",
        items: [
          {
            name: "Neural Networks: Zero to Hero",
            url: "https://karpathy.ai/zero-to-hero.html",
          },
          {
            name: "From GPT-2 to GPT-OSS",
            url: "https://magazine.sebastianraschka.com/p/from-gpt-2-to-gpt-oss-analyzing-the",
          },
        ],
      },
      {
        title: "GPU & High-Performance Programming",
        items: [
          {
            name: "GPU and Tensor Puzzles",
            url: "https://github.com/srush/gpu-puzzles",
          },
          { name: "LeetCode for GPUs", url: "https://leetgpu.com/" },
          {
            name: "Your First WebGPU App",
            url: "https://codelabs.developers.google.com/your-first-webgpu-app",
          },
        ],
      },
      {
        title: "Interpretability",
        items: [
          {
            name: "Transformer Circuits",
            url: "https://transformer-circuits.pub/2023/monosemantic-features/index.html",
          },
          {
            name: "Scaling Monosemanticity",
            url: "https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html",
          },
          {
            name: "How does a blind model see the earth?",
            url: "https://outsidetext.substack.com/p/how-does-a-blind-model-see-the-earth",
          },
        ],
      },
      {
        title: "Specialized Topics & Applications",
        items: [
          {
            name: "Train a Reasoning Model with GRPO",
            url: "https://docs.unsloth.ai/basics/reasoning-grpo-and-rl/tutorial-train-your-own-reasoning-model-with-grpo",
          },
          {
            name: "Simple GRPO Implementation",
            url: "https://github.com/lsdefine/simple_GRPO",
          },
          {
            name: "COMET Framework",
            url: "https://unbabel.github.io/COMET/html/installation.html",
          },
        ],
      },
    ],
  },
  {
    category: "Mathematics & Formal Methods",
    subsections: [
      {
        title: "Learning Resources",
        items: [
          {
            name: "An Infinitely Large Napkin",
            url: "https://web.evanchen.cc/napkin.html",
          },
        ],
      },
      {
        title: "Theorem Proving",
        items: [
          {
            name: "The Natural Number Game",
            url: "https://adam.math.hhu.de/#/g/leanprover-community/nng4",
          },
        ],
      },
    ],
  },
  {
    category: "Linguistics",
    subsections: [
      {
        title: "Conlang Design",
        items: [
          {
            name: "The Language Construction Kit",
            url: "https://www.zompist.com/",
          },
        ],
      },
      {
        title: "Toki Pona",
        items: [
          {
            name: "Toki Pona in 18 Minutes",
            url: "https://www.youtube.com/watch?v=5phj5Ae80h8",
          },
          {
            name: "Pepper & Carrot in Toki Pona",
            url: "https://peppercarrot.com/tp/",
          },
        ],
      },
      {
        title: "Other",
        items: [
          { name: "Shavian School", url: "https://shavian.school" },
          {
            name: "Greek New Testament Study Edition",
            url: "https://bencrowder.net/greek-new-testament-study-edition/",
          },
        ],
      },
    ],
  },
  {
    category: "Miscellaneous",
    subsections: [
      {
        title: "Fun & Interesting",
        items: [
          {
            name: "The Divergent Association Task",
            url: "https://www.datcreativity.com/",
          },
        ],
      },
    ],
  },
];

export default function RecommendedPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Recommended
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A curated collection of useful links and resources I've found
          valuable.
        </p>
      </header>

      {recommendations.map((section) => (
        <section key={section.category} className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {section.category}
          </h2>
          <div className="space-y-2">
            {section.subsections.map((subsection) => (
              <div key={subsection.title} className="space-y-1">
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">
                    {subsection.title}
                  </span>
                  :{" "}
                  {subsection.items.map((item, index) => (
                    <span key={item.name}>
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:no-underline"
                      >
                        {item.name}
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
