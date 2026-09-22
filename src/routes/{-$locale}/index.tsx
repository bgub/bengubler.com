import { dataResource, readData } from "@bgub/fig";
import { createFileRoute } from "@tanstack/solid-router";
import { getGT, T } from "gt-fig-tanstack-start";
import { Link } from "@/components/link";
import { PostRow } from "@/components/post-row";
import { ProjectList } from "@/components/project-list";
import { type Locale, resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";
import { getRecentPostsForLocale } from "@/lib/post-data";
import { projectsData } from "@/lib/projects";

const recentPostsResource = dataResource({
  key: (locale: Locale) => ["recent-posts", locale],
  load: (locale: Locale) => getRecentPostsForLocale({ data: { locale } }),
});

export const Route = createFileRoute("/{-$locale}/")({
  loader: async ({ context }) => {
    const locale = resolveLocale();
    await context.data.ensureData(recentPostsResource, locale);
  },
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: "Ben Gubler",
        description: gt(
          "Ben Gubler's personal website. Working at General Translation, previously interned at Vercel. Studying AI and human languages at BYU.",
        ),
      }),
    };
  },
  component: HomePage,
});

function HomePage() {
  const { hasMorePosts, recentPosts } = readData(
    recentPostsResource,
    resolveLocale(),
  );

  const featuredProjects =
    projectsData.find((section) => section.id === "featured")?.projects ?? [];

  return (
    <div class="home-wireframe">
      {/* Hero Section */}
      <section class="home-hero">
        <h1 class="font-serif font-normal text-foreground">
          <T>Hey, I'm Ben</T>
        </h1>

        <p class="text-ink-soft mb-2.5">
          <T>
            I work on high-performance TypeScript systems, open-source
            infrastructure, and libraries for building with AI.
          </T>
        </p>

        <p class="text-ink-soft mb-2.5">
          <T>
            I'm a student at BYU, where I'm majoring in CS/ML and
            double-minoring in Arabic + Math. I build open-source libraries, web
            applications, and AI tools.
          </T>
        </p>

        <p class="text-ink-soft">
          <T>
            Previously interned at{" "}
            <span class="font-normal">General Translation</span> and{" "}
            <span class="font-normal">Vercel</span>.
          </T>
        </p>

        <div class="home-links flex flex-wrap items-center gap-x-1.5 text-muted-foreground">
          <T>
            <Link
              href="/projects"
              class="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
            >
              Projects
            </Link>
            <span class="mx-1 text-ink-faint">&middot;</span>
            <Link
              href="/posts"
              class="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
            >
              Writing
            </Link>
            <span class="mx-1 text-ink-faint">&middot;</span>
            <Link
              href="/ben-gubler-resume.pdf"
              class="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              R&eacute;sum&eacute;
            </Link>
            <span class="mx-1 text-ink-faint">&middot;</span>
            <Link
              href="https://github.com/bgub"
              class="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <span class="mx-1 text-ink-faint">&middot;</span>
            <Link
              href="https://x.com/bgub_"
              class="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </Link>
          </T>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section class="home-projects">
        <div class="home-section-head flex justify-between">
          <h2 class="text-foreground">
            <T>Projects</T>
          </h2>
          <Link href="/projects" class="transition-colors">
            <T>See All &#x25B8;</T>
          </Link>
        </div>
        <ProjectList projects={featuredProjects} />
      </section>

      {/* Recent Posts Section */}
      <section class="home-posts">
        <div class="home-section-head flex justify-between">
          <h2 class="text-foreground">
            <T>Recent Posts</T>
          </h2>
          {hasMorePosts && (
            <Link href="/posts" class="transition-colors">
              <T>See All &#x25B8;</T>
            </Link>
          )}
        </div>
        <div>
          {recentPosts.map((post) => (
            <PostRow key={post.slug} post={post} showTags={false} />
          ))}
        </div>
      </section>
    </div>
  );
}
