---
title: "إضافة عناوين URL بامتداد .md لمحتوى Markdown الخام في Next.js"
description: "كيفية إضافة عناوين URL بامتداد .md إلى مدونتك على Next.js لعرض محتوى Markdown الخام، استلهامًا من توثيق Vercel."
date: "2025-06-14"
tags: [frontend]
---

> **تحديث**: بعد نشر هذا المقال، اقترح [Guillermo Rauch](https://twitter.com/rauchg) (الرئيس التنفيذي لـ Vercel) استخدام ميزة إعادة كتابة في Next.js بدلًا من middleware لهذا الاستخدام. وقد حدّثتُ التنفيذ أدناه — فهو أبسط وأفضل أداءً! 🚀



## TL;DR

مستوحىً من توثيق Vercel، سنضيف إمكانية إلحاق `.md` بأي رابط لمقال في المدونة للحصول على محتوى Markdown الخام. فيصبح `/posts/my-post` على هذا الشكل: `/posts/my-post.md` للوصول إلى المصدر الخام. أضفت هذه الميزة مؤخرًا إلى مدونتي الخاصة - وهي رائعة لمشاركة أمثلة الكود أو لإتاحة الفرصة للآخرين لرؤية أسلوبك في الكتابة.

تجعل ميزة [إعادة الكتابة](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites) في Next.js تنفيذ هذا الأمر بشكل نظيف سهلًا بشكل مدهش.

{% tweet id="1930689104800518392" /%}

## الإعداد

```bash
pnpx create-next-app@latest raw-markdown-blog
cd raw-markdown-blog
pnpm install @content-collections/core @content-collections/mdx @content-collections/next zod
```

اختر TypeScript وTailwind CSS وApp Router.

أضف `.content-collections` إلى `.gitignore`:

```
.content-collections
```



## إعداد Content Collections

تُعد [Content Collections](https://www.content-collections.dev/) مكتبة ممتازة لإدارة المحتوى في Next.js، فهي آمنة من حيث الأنواع، وسريعة، وتوفّر تجربة مطوّر رائعة.

أنشئ `content-collections.ts` في جذر المشروع (وليس داخل src/):

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

حدِّث `next.config.js`:

```javascript
const { withContentCollections } = require("@content-collections/next");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // إعداداتك الحالية...
};

module.exports = withContentCollections(nextConfig);
```

حدّث المسارات في `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... خيارات أخرى
    "paths": {
      "@/*": ["./src/*"],
      "content-collections": ["./.content-collections/generated"]
    }
  }
}
```



## محتوى نموذجي

أنشئ الدليل `content/` في المجلد الجذر لمشروعك، ثم أضف `content/hello-world.mdx`:

````markdown
---
title: "Hello World"
description: "My first blog post with raw markdown support."
date: "2024-12-20"
---
```



## مرحبًا

هذا أول مقال على مدونتي! إليك بعض **النص الغامق** ومقطعًا برمجيًا:

```javascript
console.log("Hello, world!");
```

رائع، أليس كذلك؟

````



## صفحات المقالات

استبدِل `app/page.tsx`:

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

أنشئ `app/posts/[slug]/page.tsx`:

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



## السحر: إعادة الكتابة

هنا تتألق ميزة إعادة الكتابة في Next.js — إذ تتيح لنا التعامل مع إعادة كتابة عناوين URL بسلاسة من خلال بضعة أسطر فقط من الإعدادات.

حدّث `next.config.js` لإضافة قاعدة إعادة الكتابة:

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

تربط قاعدة إعادة الكتابة تلقائيًا أي طلب يطابق `/posts/:slug.md` بالمسار `/api/posts/:slug/raw`. ويُستخرج المعلَّم `:slug` من عنوان URL المصدر ويُمرَّر إلى الوجهة. يرى المستخدم `/posts/hello-world.md` في متصفحه، لكن Next.js يخدمه من `/api/posts/hello-world/raw`.



## مسار واجهة برمجة التطبيقات للمحتوى الخام

أنشئ `app/api/posts/[slug]/raw/route.ts`:

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
      "Cache-Control": "public, max-age=3600", // تخزين مؤقت لمدة ساعة واحدة
    },
  });
}

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}
```



## تم

شغّل خادم التطوير لديك واختبر كلا الرابطين:

* `/posts/hello-world` - ملف MDX معروض بالتنسيق والمكوّنات
* `/posts/hello-world.md` - مصدر Markdown الخام

تضمن ترويسات التخزين المؤقت تخزين مصدر Markdown الخام لمدة ساعة، مما يقلّل الضغط على الخادم للمقالات الشائعة. في بيئة الإنتاج، قد ترغب في إضافة زر &quot;عرض المصدر الخام&quot; إلى مقالاتك (كما فعلتُ في مدونتي الشخصية) بدلًا من مجرد إظهار الرابط في قائمة المقالات.

تُعد هذه الميزة مثالية لمشاركة الأمثلة، أو استكشاف أخطاء المحتوى وإصلاحها، أو إتاحة الفرصة للآخرين لدراسة تنسيق Markdown لديك. كما أن إعادة كتابة في Next.js تجعل التنفيذ نظيفًا وعالي الأداء - من دون الحاجة إلى منطق توجيه معقّد.
