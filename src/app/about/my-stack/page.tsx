import { msg, T, useGT, useMessages } from "gt-next";
import { getGT } from "gt-next/server";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/page-title";

type FavoriteSection = {
  category: string;
  subsections: Array<{
    title: string;
    items: Array<{
      name: string;
      link?: Route;
    }>;
  }>;
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
          { name: msg("MacBook Pro (work)") },
          { name: msg("Dell XPS 15 (personal)") },
        ],
      },
      {
        title: msg("Peripherals"),
        items: [
          { name: msg("NuPhy Air75 V3 Keyboard") },
          { name: msg("MX Master 3S Mouse") },
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
          { name: msg("Cosmic Desktop (occasionally)") },
          { name: "Alacritty" },
        ],
      },
      {
        title: msg("Development"),
        items: [{ name: msg("Zed w/ Vim keybindings") }, { name: msg("Brave Browser") }],
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
          { name: msg("Day One Journal") },
        ],
      },
    ],
  },
];

export default function MyStackPage() {
  const m = useMessages();
  const gt = useGT();
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <T>
          <PageTitle
            subtitle={gt("Technologies, apps, and tools I use for development and productivity.")}
          >
            My Stack
          </PageTitle>
        </T>
      </header>

      {stack.map((section) => (
        <section key={section.category} className="space-y-3">
          <div className="flex items-baseline gap-3.5">
            <h2 className="font-serif font-medium text-2xl tracking-tight text-foreground">
              {m(section.category)}
            </h2>
            <div className="flex-1 border-t border-dotted border-ink-faint mt-1.5" />
          </div>
          <div className="space-y-2">
            {section.subsections.map((subsection) => (
              <div key={subsection.title} className="grid grid-cols-[1fr] sm:grid-cols-[180px_1fr] gap-x-4 gap-y-0.5 py-2.5 border-b border-dotted border-border">
                <span className="font-serif font-medium text-foreground">
                    {m(subsection.title)}
                  </span>
                <span className="font-serif text-ink-soft font-light">
                  {subsection.items.map((item, index) => {
                    const displayName = m(item.name);
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
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
