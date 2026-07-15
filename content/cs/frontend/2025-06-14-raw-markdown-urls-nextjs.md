---
title: "Přidání URL s `.md` pro nezpracovaný obsah v Markdownu v Next.js"
description: "Jak do svého blogu v Next.js přidat URL s `.md`, aby servíroval nezpracovaný obsah v Markdownu, inspirováno dokumentací Vercel."
date: "2025-06-14"
tags: [frontend]
---

> **Aktualizace**: Po zveřejnění tohoto příspěvku [Guillermo Rauch](https://twitter.com/rauchg) (CEO Vercel) navrhl pro tento případ místo middleware použít přepisování v Next.js. Implementaci níže jsem proto aktualizoval — je jednodušší a výkonnější! 🚀



## TL;DR

Inspirováni dokumentací Vercelu přidáme možnost připojit `.md` k URL libovolného příspěvku a získat tak obsah v surovém markdownu. Takže z `/posts/my-post` se stane `/posts/my-post.md` pro zobrazení zdrojového textu. Nedávno jsem tuto funkci přidal do svého vlastního blogu – hodí se skvěle pro sdílení ukázek kódu nebo pro ty, kteří chtějí vidět, jak jste něco napsali.

Next.js [přepisování](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites) to překvapivě usnadňují a umožňují čistou implementaci.

{% tweet id="1930689104800518392" /%}

## Nastavení

```bash
pnpx create-next-app@latest raw-markdown-blog
cd raw-markdown-blog
pnpm install @content-collections/core @content-collections/mdx @content-collections/next zod
```

Zvolte TypeScript, Tailwind CSS a App Router.

Do `.gitignore` přidejte `.content-collections`:

```
.content-collections
```



## Nastavení Content Collections

[Content Collections](https://www.content-collections.dev/) je skvělá knihovna pro správu obsahu v Next.js – je typově bezpečná, rychlá a nabízí skvělé DX.

V kořenovém adresáři projektu vytvořte `content-collections.ts` (ne do `src/`):

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

Upravte `next.config.js`:

```javascript
const { withContentCollections } = require("@content-collections/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // vaše stávající konfigurace...
};

module.exports = withContentCollections(nextConfig);
```

Upravte cesty v `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... ostatní možnosti
    "paths": {
      "@/*": ["./src/*"],
      "content-collections": ["./.content-collections/generated"]
    }
  }
}
```



## Ukázkový obsah

V kořenovém adresáři projektu vytvořte složku `content/` a přidejte `content/hello-world.mdx`:

````markdown
---
title: "Hello World"
description: "My first blog post with raw markdown support."
date: "2024-12-20"
---
```



## Vítejte

Tohle je můj první příspěvek na blogu! Tady je **tučný text** a blok kódu:

```javascript
console.log("Hello, world!");
```

Docela super, co?

````



## Stránky s příspěvky

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

Vytvořte `app/posts/[slug]/page.tsx`:

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



## Kouzlo přepisování

Právě tady přepisování v Next.js opravdu vynikne – přepisování URL můžeme elegantně vyřešit pomocí několika řádků konfigurace.

Aktualizujte `next.config.js` a přidejte pravidlo přepisování:

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

Pravidlo přepisování automaticky mapuje každý požadavek, který odpovídá `/posts/:slug.md`, na `/api/posts/:slug/raw`. Parametr `:slug` se převezme ze zdrojové URL a předá cílové adrese. Uživatel ve svém prohlížeči vidí `/posts/hello-world.md`, ale Next.js ho ve skutečnosti obslouží z `/api/posts/hello-world/raw`.



## API route pro nezpracovaný obsah

Vytvořte `app/api/posts/[slug]/raw/route.ts`:

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
      "Cache-Control": "public, max-age=3600", // Cache na 1 hodinu
    },
  });
}

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}
```



## Hotovo

Spusťte vývojový server a otestujte obě URL:

* `/posts/hello-world` - vyrenderované MDX se styly a komponentami
* `/posts/hello-world.md` - surový markdown

Cache hlavičky zajišťují, že se surový markdown ukládá na hodinu do mezipaměti, což snižuje zatížení serveru u populárních příspěvků. V produkci možná budete chtít ke svým příspěvkům přidat tlačítko „View raw“ (jako jsem to udělal na vlastním blogu), místo toho, abyste jen zobrazovali odkaz v seznamu příspěvků.

Tato funkce je ideální pro sdílení ukázek, ladění obsahu nebo když chcete ostatním umožnit, aby si prostudovali formátování vašeho markdownu. A přepisování v Next.js udržuje implementaci čistou a svižnou - bez potřeby složité logiky směrování.
