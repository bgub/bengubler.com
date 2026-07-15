---
title: "Plynulé přechody mezi stránkami v Next.js pomocí next-view-transitions"
description: "Přidejte do Next.js plynulé přechody mezi stránkami pomocí View Transitions API."
date: "2025-06-14"
tags: [frontend]
---



## TL;DR

Balíček [`next-view-transitions`](https://github.com/shuding/next-view-transitions) přináší plynulé přechody mezi stránkami do Next.js. Vytvoříme jednoduchý blog a přidáme plynulé přechody prvků pomocí vlastností `viewTransitionName`, díky nimž se nadpisy a data plynule transformují při přechodu mezi stránkami. Tady je ukázka toho, co budeme vytvářet:

{% tweet id="1934092246921671158" /%}

## Nastavení

```bash
pnpx create-next-app@latest my-smooth-blog
cd my-smooth-blog
pnpm install next-view-transitions
```

Zvolte TypeScript, Tailwind CSS a App Router.

Přidejte shadcn/ui:

```bash
pnpx shadcn@latest init
pnpx shadcn@latest add card badge
```



## Fiktivní data

Vytvořte `lib/posts.ts`:

```typescript
export interface Post {
  id: number;
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
}

export const posts: Post[] = [
  {
    id: 1,
    slug: "getting-started-nextjs",
    title: "Getting Started with Next.js",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    date: "2024-12-01",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    id: 2,
    slug: "react-best-practices",
    title: "React Best Practices",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    date: "2024-12-05",
    content:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
  },
  {
    id: 3,
    slug: "tailwind-tips",
    title: "Tailwind CSS Tips and Tricks",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    date: "2024-12-10",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
  },
];
```



## Seznam příspěvků

Nahraďte `app/page.tsx`:

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { posts } from "@/lib/posts";
import Link from "next/link";

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{post.date}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```



## Stránky jednotlivých příspěvků

Vytvořte `app/posts/[slug]/page.tsx`:

```tsx
import { posts } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to posts
      </Link>

      <article className="max-w-3xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4">
            <Badge>{post.date}</Badge>
          </div>
        </header>

        <div className="prose prose-lg">
          <p>{post.content}</p>
        </div>
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

Nyní máte funkční blog s běžným přecházením mezi stránkami.



## Přidejte View Transitions

Zabalte aplikaci do `app/layout.tsx`:

```tsx
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ViewTransitions>
  );
}
```

Nahraďte všechny importy z `next/link` verzí s podporou přechodů:

```tsx
// Místo:
import Link from "next/link";

// Použijte:
import { Link } from "next-view-transitions";
```

V tuto chvíli vypadá navigace stejně jako předtím. Balíček ve výchozím nastavení nepřidává žádné přechody.



## Kouzlo: přechody sdílených prvků

Prvkům, které se mají mezi stránkami plynule proměňovat, přidejte vlastnosti `viewTransitionName`:

```tsx
// Ve výpisu příspěvků (app/page.tsx):
<CardTitle
  className="line-clamp-2"
  style={{ viewTransitionName: `title-${post.slug}` }}
>
  {post.title}
</CardTitle>

<Badge
  variant="secondary"
  style={{ viewTransitionName: `date-${post.slug}` }}
>
  {post.date}
</Badge>
```

```tsx
// Na stránce konkrétního příspěvku (app/posts/[slug]/page.tsx):
<h1
  className="text-4xl font-bold mb-4"
  style={{ viewTransitionName: `title-${post.slug}` }}
>
  {post.title}
</h1>

<Badge
  style={{ viewTransitionName: `date-${post.slug}` }}
>
  {post.date}
</Badge>
```

Teď se název a datum plynule přenesou z karty na stránku příspěvku. **Jen tak jsou přechody opravdu vidět** – mezi stránkami se musí shodovat hodnoty `viewTransitionName`.



## Hotovo

Tyto přechody zajišťují vizuální kontinuitu, aplikace díky nim působí svižněji a uživatelům pomáhají udržet si kontext. View Transitions API je podporováno v Chrome, Edge a Opeře; v ostatních prohlížečích se bez problémů použije běžná navigace.
