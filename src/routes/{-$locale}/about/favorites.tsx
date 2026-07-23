import { createFileRoute } from "@tanstack/solid-router";
import { getGT, msg, T, useGT, useMessages } from "gt-fig-tanstack-start";
import { PageTitle } from "@/components/page-title";
import { getPageMetadata } from "@/lib/metadata";

export const Route = createFileRoute("/{-$locale}/about/favorites")({
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: gt("Favorites - Ben Gubler"),
        description: gt(
          "Ben Gubler's favorite books, movies, and personal recommendations.",
        ),
      }),
    };
  },
  component: FavoritesPage,
});

const favorites = [
  {
    category: msg("Books"),
    subsections: [
      {
        title: msg("Classics"),
        items: [
          { name: msg("The Brothers Karamazov") },
          { name: msg("The Death of Ivan Ilyich") },
          { name: msg("Les Misérables") },
          { name: msg("Things Fall Apart") },
          { name: msg("Animal Farm") },
          { name: msg("A River Runs Through It") },
          { name: msg("The Little Prince") },
          { name: msg("A Tale of Two Cities") },
          { name: msg("The Picture of Dorian Gray") },
          { name: msg("Brave New World") },
          { name: msg("Fahrenheit 451") },
        ],
      },
      {
        title: msg("Faith"),
        items: [
          { name: msg("The Book of Mormon") },
          { name: msg("The Bible") },
          { name: msg("The Screwtape Letters") },
          { name: msg("Jesus the Christ") },
        ],
      },
      {
        title: msg("Fantasy"),
        items: [
          { name: msg("The Lord of the Rings") },
          { name: msg("The Stormlight Archive") },
          { name: msg("Inkheart Series") },
          { name: msg("The Queen's Thief Series") },
        ],
      },
      {
        title: msg("Other"),
        items: [
          { name: msg("The Hiding Place") },
          { name: msg("Just Mercy") },
          { name: msg("44 Scotland Street") },
        ],
      },
    ],
  },
  {
    category: msg("Movies"),
    subsections: [
      {
        title: msg("American"),
        items: [
          { name: msg("Fiddler on the Roof") },
          { name: msg("A River Runs Through It") },
          { name: msg("The Founder") },
          { name: msg("The Prestige") },
          { name: msg("Interstellar") },
        ],
      },
      {
        title: msg("International"),
        items: [
          { name: msg("Jojo Rabbit") },
          { name: msg("Hunt for the Wilderpeople") },
          { name: msg("Pelíšky") },
        ],
      },
    ],
  },
];

function FavoritesPage() {
  const m = useMessages();
  const gt = useGT();
  return (
    <div class="space-y-12">
      <header class="space-y-3">
        <T>
          <PageTitle
            subtitle={gt(
              "Books, movies, and other things I love and recommend.",
            )}
          >
            Favorites
          </PageTitle>
        </T>
      </header>

      {favorites.map((section) => (
        <section key={m(section.category)} class="space-y-3">
          <div class="flex items-baseline gap-3.5">
            <h2 class="font-serif font-medium text-2xl tracking-tight text-foreground">
              {m(section.category)}
            </h2>
            <div class="flex-1 border-t border-dotted border-ink-faint mt-1.5" />
          </div>
          <div>
            {section.subsections.map((subsection) => (
              <div
                key={m(subsection.title)}
                class="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-4 gap-y-0.5 py-2.5 border-b border-dotted border-border"
              >
                <span class="font-serif font-medium text-foreground">
                  {m(subsection.title)}
                </span>
                <span class="font-serif text-ink-soft font-light">
                  {subsection.items.map((item, index) => (
                    <span key={m(item.name)}>
                      {m(item.name)}
                      {index < subsection.items.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
