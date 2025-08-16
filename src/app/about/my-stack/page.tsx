import type { Metadata } from "next";
import Link from "next/link";

type FavoriteItem = {
  name: string;
  link?: string;
};

type FavoriteSubsection = {
  title: string;
  items: FavoriteItem[];
};

type FavoriteSection = {
  category: string;
  subsections: FavoriteSubsection[];
};

export const metadata: Metadata = {
  title: "My Stack - Ben Gubler",
  description:
    "Technologies, apps, and tools that Ben Gubler uses for development and productivity.",
};

const stack: FavoriteSection[] = [
  {
    category: "Hardware",
    subsections: [
      {
        title: "Computers",
        items: [
          { name: "MacBook Pro (work)" },
          { name: "Dell XPS 15 (personal)" },
        ],
      },
      {
        title: "Peripherals",
        items: [
          { name: "NuPhy Air75 V3 Keyboard" },
          { name: "MX Master 3S Mouse" },
        ],
      },
    ],
  },
  {
    category: "Software",
    subsections: [
      {
        title: "Operating Systems",
        items: [{ name: "macOS" }, { name: "Fedora Linux" }],
      },
      {
        title: "Desktop & Terminal",
        items: [
          { name: "GNOME Desktop" },
          { name: "Cosmic Desktop (occasionally)" },
          { name: "Alacritty" },
        ],
      },
      {
        title: "Development",
        items: [{ name: "Zed w/ Vim keybindings" }, { name: "Zen Browser" }],
      },
    ],
  },
  {
    category: "Apps",
    subsections: [
      {
        title: "Language Learning",
        items: [
          { name: "Anki", link: "https://apps.ankiweb.net" },
          { name: "Readlang", link: "https://readlang.com" },
          { name: "Pimsleur", link: "https://pimsleur.com" },
          { name: "Beelinguapp", link: "https://beelinguapp.com" },
          { name: "my own tools", link: "/language-learning" },
        ],
      },
      {
        title: "Productivity & Life",
        items: [
          { name: "Todoist" },
          { name: "Obsidian" },
          { name: "Monarch Money", link: "https://monarchmoney.com" },
          { name: "Wispr Flow" },
          { name: "Day One Journal" },
        ],
      },
    ],
  },
];

export default function MyStackPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          My Stack
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Technologies, apps, and tools I use for development and productivity.
        </p>
      </header>

      {stack.map((section) => (
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
                      {item.link ? (
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:no-underline"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        item.name
                      )}
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
