import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { msg, T, useGT, useMessages } from "gt-tanstack-start";
import { getGT } from "gt-tanstack-start/server";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { getRouteMetadata } from "@/lib/metadata";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: gt("My Stack - Ben Gubler"),
    description: gt(
      "Technologies, apps, and tools that Ben Gubler uses for development and productivity.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/about/my-stack")({
  loader: () => getMetadata(),
  head: ({ loaderData, params }) => ({
    meta: getRouteMetadata(loaderData, params.locale),
  }),
  component: MyStackPage,
});

const stack = [
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
        items: [{ name: msg("macOS") }, { name: msg("Fedora Linux") }],
      },
      {
        title: msg("Desktop & Terminal"),
        items: [
          { name: msg("GNOME Desktop") },
          { name: msg("Cosmic Desktop (occasionally)") },
          { name: msg("Alacritty") },
        ],
      },
      {
        title: msg("Development"),
        items: [
          { name: msg("Zed w/ Vim keybindings") },
          { name: msg("Brave Browser") },
        ],
      },
    ],
  },
  {
    category: msg("Apps"),
    subsections: [
      {
        title: msg("Language Learning"),
        items: [
          { name: msg("Anki"), link: "https://apps.ankiweb.net" },
          { name: msg("Readlang"), link: "https://readlang.com" },
          { name: msg("Pimsleur"), link: "https://pimsleur.com" },
          { name: msg("Beelinguapp"), link: "https://beelinguapp.com" },
          { name: msg("my own tools"), link: "/language-learning" },
        ],
      },
      {
        title: msg("Productivity & Life"),
        items: [
          { name: msg("Todoist") },
          { name: msg("Obsidian") },
          { name: msg("Monarch Money"), link: "https://monarchmoney.com" },
          { name: msg("Wispr Flow") },
          { name: msg("Day One Journal") },
        ],
      },
    ],
  },
];

function MyStackPage() {
  const m = useMessages();
  const gt = useGT();
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <T>
          <PageTitle
            subtitle={gt(
              "Technologies, apps, and tools I use for development and productivity.",
            )}
          >
            My Stack
          </PageTitle>
        </T>
      </header>

      {stack.map((section) => (
        <section key={m(section.category)} className="space-y-3">
          <div className="flex items-baseline gap-3.5">
            <h2 className="font-serif font-medium text-2xl tracking-tight text-foreground">
              {m(section.category)}
            </h2>
            <div className="flex-1 border-t border-dotted border-ink-faint mt-1.5" />
          </div>
          <div className="space-y-2">
            {section.subsections.map((subsection) => (
              <div
                key={m(subsection.title)}
                className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-x-4 gap-y-0.5 py-2.5 border-b border-dotted border-border"
              >
                <span className="font-serif font-medium text-foreground">
                  {m(subsection.title)}
                </span>
                <span className="font-serif text-ink-soft font-light">
                  {subsection.items.map((item, index) => {
                    const displayName = m(item.name);
                    return (
                      <span key={m(item.name)}>
                        {"link" in item && item.link ? (
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
