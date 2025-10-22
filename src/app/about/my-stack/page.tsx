import { msg, T, useMessages } from "gt-next";
import { getGT } from "gt-next/server";
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

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();

  return {
    title: gt("My Stack - Ben Gubler"),
    description: gt(
      "Technologies, apps, and tools that Ben Gubler uses for development and productivity.",
    ),
  };
}

const stack: FavoriteSection[] = [
  {
    category: msg("Hardware"),
    subsections: [
      {
        title: msg("Computers"),
        items: [
          { name: "MacBook Pro (work)" },
          { name: "Dell XPS 15 (personal)" },
        ],
      },
      {
        title: msg("Peripherals"),
        items: [
          { name: "NuPhy Air75 V3 Keyboard" },
          { name: "MX Master 3S Mouse" },
        ],
      },
    ],
  },
  {
    category: msg("Software"),
    subsections: [
      {
        title: msg("Operating Systems"),
        items: [{ name: "macOS" }, { name: "Fedora Linux" }],
      },
      {
        title: msg("Desktop & Terminal"),
        items: [
          { name: "GNOME Desktop" },
          { name: "Cosmic Desktop (occasionally)" },
          { name: "Alacritty" },
        ],
      },
      {
        title: msg("Development"),
        items: [{ name: "Zed w/ Vim keybindings" }, { name: "Zen Browser" }],
      },
    ],
  },
  {
    category: msg("Apps"),
    subsections: [
      {
        title: msg("Language Learning"),
        items: [
          { name: "Anki", link: "https://apps.ankiweb.net" },
          { name: "Readlang", link: "https://readlang.com" },
          { name: "Pimsleur", link: "https://pimsleur.com" },
          { name: "Beelinguapp", link: "https://beelinguapp.com" },
          { name: msg("my own tools"), link: "/language-learning" },
        ],
      },
      {
        title: msg("Productivity & Life"),
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
  const m = useMessages();
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <T>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            My Stack
          </h1>
        </T>
        <T>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Technologies, apps, and tools I use for development and
            productivity.
          </p>
        </T>
      </header>

      {stack.map((section) => (
        <section key={section.category} className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {m(section.category)}
          </h2>
          <div className="space-y-2">
            {section.subsections.map((subsection) => (
              <div key={subsection.title} className="space-y-1">
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">
                    {m(subsection.title)}
                  </span>
                  :{" "}
                  {subsection.items.map((item, index) => {
                    const displayName =
                      typeof item.name === "string" &&
                      item.name.startsWith("__")
                        ? m(item.name)
                        : item.name;
                    return (
                      <span key={item.name}>
                        {item.link ? (
                          <Link
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:no-underline"
                          >
                            {displayName}
                          </Link>
                        ) : (
                          displayName
                        )}
                        {index < subsection.items.length - 1 && ", "}
                      </span>
                    );
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
