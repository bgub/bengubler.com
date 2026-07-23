import { createFileRoute } from "@tanstack/solid-router";
import { getGT, msg, T, useGT, useMessages } from "gt-fig-tanstack-start";
import { Link } from "@/components/link";
import { PageTitle } from "@/components/page-title";
import { getPageMetadata } from "@/lib/metadata";

export const Route = createFileRoute("/{-$locale}/about/my-stack")({
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: gt("My Stack - Ben Gubler"),
        description: gt(
          "Technologies, apps, and tools that Ben Gubler uses for development and productivity.",
        ),
      }),
    };
  },
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
    <div class="space-y-12">
      <header class="space-y-3">
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
        <section key={m(section.category)} class="space-y-3">
          <div class="flex items-baseline gap-3.5">
            <h2 class="font-serif font-medium text-2xl tracking-tight text-foreground">
              {m(section.category)}
            </h2>
            <div class="flex-1 border-t border-dotted border-ink-faint mt-1.5" />
          </div>
          <div class="space-y-2">
            {section.subsections.map((subsection) => (
              <div
                key={m(subsection.title)}
                class="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-x-4 gap-y-0.5 py-2.5 border-b border-dotted border-border"
              >
                <span class="font-serif font-medium text-foreground">
                  {m(subsection.title)}
                </span>
                <span class="font-serif text-ink-soft font-light">
                  {subsection.items.map((item, index) => {
                    const displayName = m(item.name);
                    return (
                      <span key={m(item.name)}>
                        {"link" in item && item.link ? (
                          <Link
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="underline hover:no-underline"
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
