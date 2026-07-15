---
title: "Pridanie .md URL adries pre surový obsah v Markdowne v Next.js"
description: "Ako pridať .md URL adresy do svojho blogu v Next.js, aby sprístupňoval surový obsah v Markdowne, inšpirované dokumentáciou Vercel."
date: "2025-06-14"
tags: [frontend]
---

> **Aktualizácia**: Po publikovaní tohto príspevku [Guillermo Rauch](https://twitter.com/rauchg) (CEO spoločnosti Vercel) navrhol pre tento prípad použiť Next.js rewrites namiesto middleware. Implementáciu nižšie som aktualizoval — je jednoduchšia a výkonnejšia! 🚀



## TL;DR

Inšpirovaní dokumentáciou Vercel pridáme možnosť pripojiť `.md` k URL ľubovoľného príspevku a získať tak surový obsah v Markdowne. Teda `/posts/my-post` sa zmení na `/posts/my-post.md` pre surový zdroj. Nedávno som túto funkciu pridal aj na svoj blog – je ideálna na zdieľanie ukážok kódu alebo na to, aby ľudia videli, ako ste niečo napísali.

Next.js [rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites) to prekvapivo uľahčujú čistú implementáciu.

{% tweet id="1930689104800518392" /%}

## Nastavenie

```bash
pnpx create-next-app@latest raw-markdown-blog
cd raw-markdown-blog
pnpm install @content-collections/core @content-collections/mdx @content-collections/next zod
```

Vyberte si TypeScript, Tailwind CSS a App Router.

Pridajte `.content-collections` do svojho `.gitignore`:

```
.content-collections
```



## Nastavenie Content Collections

[Content Collections](https://www.content-collections.dev/) je výborná knižnica na správu obsahu v Next.js – je typovo bezpečná, rýchla a ponúka skvelé DX.

Vytvorte `content-collections.ts` v koreňovom adresári projektu (nie v `src/`):

```typescript
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const posts = defineCollection({
  name: "posts",
  directory: "content",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().pipe(z.coerce.date()),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document);
    const slug = document._meta.path.replace(/\.mdx$/, "");

    return {
      ...document,
      mdx,
      slug,
      url: `/posts/${slug}`,
    };
  },
});

export default defineConfig({
  collections: [posts],
});
```

Aktualizujte súbor `next.config.js`:

```javascript
const { withContentCollections } = require("@content-collections/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // vaša existujúca konfigurácia...
};

module.exports = withContentCollections(nextConfig);
```

Aktualizujte cesty v súbore `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... ostatné možnosti
    "paths": {
      "@/*": ["./src/*"],
      "content-collections": ["./.content-collections/generated"]
    }
  }
}
```



## Ukážkový obsah

V koreňovom adresári projektu vytvorte adresár `content/` a pridajte `content/hello-world.mdx`:

````markdown
---
title: "Hello World"
description: "My first blog post with raw markdown support."
date: "2024-12-20"
---
```



## Vitajte

Toto je môj prvý príspevok! Tu je trochu **tučného textu** a blok kódu:

```javascript
console.log("Hello, world!");
```

Celkom super, však?

````



## Stránky s príspevkami

Nahraďte `app/page.tsx`:

```tsx
import { allPosts } from "content-collections";
import Link from "next/link";

export default function Home() {
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Blog</h1>
      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <article key={post.slug} className="border-b pb-4">
            <Link
              href={post.url}
              className="text-xl font-semibold hover:text-blue-600"
            >
              {post.title}
            </Link>
            <p className="text-gray-600 mt-2">{post.description}</p>
            <time className="text-sm text-gray-500">
              {post.date.toLocaleDateString()}
            </time>
            <div className="mt-2 text-sm">
              <Link
                href={`${post.url}.md`}
                className="text-blue-500 hover:underline"
              >
                View raw markdown
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

Vytvorte `app/posts/[slug]/page.tsx`:

```tsx
import { allPosts } from "content-collections";
import { MDXContent } from "@content-collections/mdx/react";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to posts
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <p className="text-gray-600 mb-2">{post.description}</p>
          <time className="text-sm text-gray-500">
            {post.date.toLocaleDateString()}
          </time>
          <div className="mt-4">
            <Link
              href={`${post.url}.md`}
              className="text-blue-500 hover:underline text-sm"
            >
              View raw markdown
            </Link>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <MDXContent code={post.mdx} />
        </div>
      </article>
    </div>
  );
}

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}
```



## Kúzlo: Rewrites

Práve tu sa naplno ukáže sila funkcie `rewrites` v Next.js – prepisovanie URL adries môžeme elegantne vyriešiť len pomocou niekoľkých riadkov konfigurácie.

Aktualizujte `next.config.js` a pridajte pravidlo prepisu:

```javascript
const { withContentCollections } = require("@content-collections/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/posts/:slug.md",
        destination: "/api/posts/:slug/raw",
      },
    ];
  },
};

module.exports = withContentCollections(nextConfig);
```

Pravidlo prepisu automaticky presmeruje každú požiadavku zodpovedajúcu `/posts/:slug.md` na `/api/posts/:slug/raw`. Parameter `:slug` sa zachytí zo zdrojovej URL a odovzdá cieľovej adrese. Používateľ vo svojom prehliadači vidí `/posts/hello-world.md`, ale Next.js ho obslúži z `/api/posts/hello-world/raw`.



## Trasa API pre surový obsah

Vytvorte `app/api/posts/[slug]/raw/route.ts`:

```typescript
import { allPosts } from "content-collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return new NextResponse("Post not found", { status: 404 });
  }

  return new NextResponse(post.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600", // Uložiť do cache na 1 hodinu
    },
  });
}

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}
```



## Hotovo

Spustite vývojový server a otestujte obe URL adresy:

* `/posts/hello-world` - Vyrenderované MDX so štýlmi a komponentmi
* `/posts/hello-world.md` - Surový zdrojový markdown

Hlavičky cache zabezpečia, že surový markdown sa bude ukladať do cache na hodinu, čím sa zníži zaťaženie servera pri obľúbených príspevkoch. V produkcii možno budete chcieť do svojich príspevkov pridať tlačidlo „View raw“ (ako som to urobil na svojom blogu) namiesto toho, aby ste len zobrazili odkaz v zozname príspevkov.

Táto funkcia je ideálna na zdieľanie príkladov, ladenie obsahu alebo na to, aby si ostatní mohli pozrieť formátovanie vášho markdownu. A Next.js rewrites robia implementáciu čistou a výkonnou – bez potreby zložitej logiky smerovania.
