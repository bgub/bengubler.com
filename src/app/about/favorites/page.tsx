import { msg, T, useGT, useMessages } from "gt-next";
import { getGT } from "gt-next/server";
import type { Metadata } from "next";
import { PageTitle } from "@/components/page-title";

type FavoriteSection = {
  category: string;
  subsections: Array<{
    title: string;
    items: Array<{
      name: string;
    }>;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();

  return {
    title: gt("Favorites - Ben Gubler"),
    description: gt(
      "Ben Gubler's favorite books, movies, and personal recommendations.",
    ),
  };
}

const favorites: FavoriteSection[] = [
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

export default function FavoritesPage() {
  const m = useMessages();
  const gt = useGT();
  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <T>
          <PageTitle
            subtitle={gt("Books, movies, and other things I love and recommend.")}
          >
            Favorites
          </PageTitle>
        </T>
      </header>

      {favorites.map((section) => (
        <section key={section.category} className="space-y-3">
          <div className="flex items-baseline gap-3.5">
            <h2 className="font-serif font-medium text-2xl tracking-tight text-foreground">
              {m(section.category)}
            </h2>
            <div className="flex-1 border-t border-dotted border-ink-faint mt-1.5" />
          </div>
          <div>
            {section.subsections.map((subsection) => (
              <div key={subsection.title} className="grid grid-cols-[1fr] sm:grid-cols-[140px_1fr] gap-x-4 gap-y-0.5 py-2.5 border-b border-dotted border-border">
                <span className="font-serif font-medium text-foreground">
                  {m(subsection.title)}
                </span>
                <span className="font-serif text-ink-soft font-light">
                  {subsection.items.map((item, index) => (
                    <span key={item.name}>
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
