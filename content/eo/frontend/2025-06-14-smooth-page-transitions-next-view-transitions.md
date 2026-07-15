---
title: "Glataj paĝtransiroj en Next.js per next-view-transitions"
description: "Aldonu glatajn paĝtransirojn en Next.js per la View Transitions API."
date: "2025-06-14"
tags: [frontend]
---

## Mallonge

La pakaĵo [`next-view-transitions`](https://github.com/shuding/next-view-transitions) ebligas glatajn paĝtransirojn en Next.js. Ni konstruos simplan blogon kaj aldonos glatajn elementajn transirojn per ecoj `viewTransitionName`, por ke titoloj kaj datoj glate ŝanĝiĝu inter paĝoj. Jen demonstraĵo de tio, kion ni konstruos:

{% tweet id="1934092246921671158" /%}

## Agordo

```bash
pnpx create-next-app@latest my-smooth-blog
cd my-smooth-blog
pnpm install next-view-transitions
```

Elektu TypeScript, Tailwind CSS kaj App Router.

Aldonu shadcn/ui:

```bash
pnpx shadcn@latest init
pnpx shadcn@latest add card badge
```

## Testaj datumoj

Kreu `lib/posts.ts`:

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

## Listo de afiŝoj

Anstataŭigu `app/page.tsx`:

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

## Paĝoj por unuopaj afiŝoj

Kreu `app/posts/[slug]/page.tsx`:

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

Vi nun havas funkciantan blogon kun ordinara navigado inter paĝoj.

## Aldonu View Transitions

En `app/layout.tsx`, ĉirkaŭu vian aplikaĵon:

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

Anstataŭigu ĉiujn importojn de `next/link` per la versio kun ebligitaj transiroj:

```tsx
// Anstataŭ:
import Link from "next/link";

// Uzu:
import { Link } from "next-view-transitions";
```

Je ĉi tiu etapo, la navigado aspektas same kiel antaŭe. La pakaĵo defaŭlte ne aldonas transirojn.

## La magio: transiroj de komunaj elementoj

Aldonu ecojn `viewTransitionName` al elementoj, kiuj devus transformiĝi inter paĝoj:

```tsx
// En via listo de afiŝoj (app/page.tsx):
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
// En via individua afiŝpaĝo (app/posts/[slug]/page.tsx):
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

Nun la titolo kaj dato glate transformiĝas de la karto al la paĝo de la afiŝo. **Tio estas efektive la sola maniero vidi transirojn** - kiam la valoroj de `viewTransitionName` kongruas inter la paĝoj.

## Prete

Ĉi tiuj transiroj donas vidan kontinuecon, igas la aplikaĵon pli respondema, kaj helpas al uzantoj konservi la kuntekston. La View Transitions API estas subtenata en Chrome, Edge kaj Opera, kaj en aliaj retumiloj ĝi simple uzas normalan navigadon.