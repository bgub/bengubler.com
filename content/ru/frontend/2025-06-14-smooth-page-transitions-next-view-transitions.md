---
title: "Плавные переходы между страницами в Next.js с next-view-transitions"
description: "Добавьте в Next.js плавные переходы между страницами с помощью View Transitions API."
date: "2025-06-14"
tags: [frontend]
---



## TL;DR

Пакет [`next-view-transitions`](https://github.com/shuding/next-view-transitions) добавляет плавные переходы между страницами в Next.js. Мы создадим простой блог и добавим плавные переходы элементов с помощью свойств `viewTransitionName`, чтобы заголовки и даты плавно перетекали при смене страниц. Вот демонстрация того, что у нас получится:

{% tweet id="1934092246921671158" /%}

## Настройка

```bash
pnpx create-next-app@latest my-smooth-blog
cd my-smooth-blog
pnpm install next-view-transitions
```

Выберите TypeScript, Tailwind CSS и App Router.

Добавьте shadcn/ui:

```bash
pnpx shadcn@latest init
pnpx shadcn@latest add card badge
```



## Тестовые данные

Создайте `lib/posts.ts`:

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



## Список публикаций

Замените `app/page.tsx`:

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



## Страницы отдельных публикаций

Создайте `app/posts/[slug]/page.tsx`:

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

Теперь у вас есть работающий блог с обычной постраничной навигацией.



## Добавьте View Transitions

Оберните приложение в `app/layout.tsx`:

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

Замените все импорты из `next/link` на версию с поддержкой переходов:

```tsx
// Вместо:
import Link from "next/link";

// Используйте:
import { Link } from "next-view-transitions";
```

Пока навигация выглядит точно так же, как и раньше. По умолчанию пакет не добавляет никаких анимаций перехода.



## Магия: переходы с общими элементами

Добавьте свойства `viewTransitionName` к элементам, которые должны плавно трансформироваться при переходе между страницами:

```tsx
// В вашем списке публикаций (app/page.tsx):
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
// На странице отдельной публикации (app/posts/[slug]/page.tsx):
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

Теперь заголовок и дата плавно переходят из карточки на страницу публикации. **Только так можно действительно увидеть переходы** — если значения `viewTransitionName` на страницах совпадают.



## Готово

Эти переходы обеспечивают визуальную непрерывность, делают приложение более отзывчивым и помогают пользователям сохранять контекст. View Transitions API поддерживается в Chrome, Edge и Opera, а в других браузерах просто используется обычная навигация.
