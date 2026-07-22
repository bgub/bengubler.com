import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { decodeMsg, T } from "gt-tanstack-start";
import { getGT } from "gt-tanstack-start/server";
import { Link } from "@/components/link";
import { PostRow } from "@/components/post-row";
import { ProjectList } from "@/components/project-list";
import { resolveLocale } from "@/lib/locales";
import { getRouteMetadata } from "@/lib/metadata";
import { getRecentPostsForLocale } from "@/lib/post-data";
import { projectsData } from "@/lib/projects";

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: "Ben Gubler",
    description: gt(
      "Ben Gubler's personal website. Working at General Translation, previously interned at Vercel. Studying AI and human languages at BYU.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/")({
  loader: async ({ params }) => {
    const locale = resolveLocale(params.locale);
    const [postData, metadata] = await Promise.all([
      getRecentPostsForLocale({ data: { locale } }),
      getMetadata(),
    ]);
    return { ...postData, metadata };
  },
  head: ({ loaderData, params }) => ({
    meta: getRouteMetadata(loaderData?.metadata, params.locale),
  }),
  component: HomePage,
});

function HomePage() {
  const { hasMorePosts, recentPosts } = Route.useLoaderData();

  const featuredProjects =
    projectsData.find((section) => decodeMsg(section.category) === "Featured")
      ?.projects || [];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section>
        <h1 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[56px] leading-[1.02] tracking-tight text-foreground mb-4">
          <T>Hey, I'm Ben</T>
        </h1>

        <p className="font-serif text-lg sm:text-xl leading-relaxed text-ink-soft font-light mb-2.5">
          <T>
            I'm a student at BYU, where I'm majoring in CS/ML and
            double-minoring in Arabic + Math. I build open-source libraries, web
            applications, and AI tools. Currently working at{" "}
            <span className="bg-buttercream px-1.5 py-0.5 rounded-sm text-foreground font-normal">
              General Translation
            </span>
            , previously interned at{" "}
            <span className="bg-buttercream px-1.5 py-0.5 rounded-sm text-foreground font-normal">
              Vercel
            </span>
            .
          </T>
        </p>

        <div className="flex flex-wrap items-center gap-x-1.5 font-mono text-[11.5px] text-muted-foreground mt-5">
          <T>
            <Link
              href="/projects"
              className="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
            >
              Projects
            </Link>
            <span className="mx-1 text-ink-faint">&middot;</span>
            <Link
              href="/posts"
              className="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
            >
              Writing
            </Link>
            <span className="mx-1 text-ink-faint">&middot;</span>
            <Link
              href="/ben-gubler-resume.pdf"
              className="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              R&eacute;sum&eacute;
            </Link>
            <span className="mx-1 text-ink-faint">&middot;</span>
            <Link
              href="https://github.com/bgub"
              className="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <span className="mx-1 text-ink-faint">&middot;</span>
            <Link
              href="https://x.com/bgub_"
              className="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </Link>
          </T>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif font-medium text-[28px] tracking-tight text-foreground">
            <T>Projects</T>
          </h2>
          <Link
            href="/projects"
            className="font-mono text-[11px] text-muted-foreground hover:text-foreground no-underline transition-colors"
          >
            <T>See All &#x25B8;</T>
          </Link>
        </div>
        <ProjectList projects={featuredProjects} compact />
      </section>

      {/* Recent Posts Section */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif font-medium text-[28px] tracking-tight text-foreground">
            <T>Recent Posts</T>
          </h2>
          {hasMorePosts && (
            <Link
              href="/posts"
              className="font-mono text-[11px] text-muted-foreground hover:text-foreground no-underline transition-colors"
            >
              <T>See All &#x25B8;</T>
            </Link>
          )}
        </div>
        <div>
          {recentPosts.map((post) => (
            <PostRow key={post.slug} post={post} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}
