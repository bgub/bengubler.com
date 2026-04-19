import { allPosts } from "content-collections";
import { decodeMsg, T } from "gt-next";
import { getLocale } from "gt-next/server";
import Link from "next/link";
import { ViewTransition } from "react";
import { ProjectList } from "@/components/project-list";
import { getPostColors } from "@/lib/colors";

function sanitize(slug: string) {
  return slug.replace(/[^\w\s\-/]/gi, "").replace(/[\s/]/g, "-");
}
import { projectsData } from "@/lib/projects";

type Post = (typeof allPosts)[0];

export default async function HomePage() {
  const locale = (await getLocale()) || "en";

  const sortedPosts = allPosts
    .filter((post: Post) => post.locale === locale)
    .filter((post: Post) => !post.archived)
    .sort((a: Post, b: Post) => b.date.getTime() - a.date.getTime());

  const recentPosts = sortedPosts.slice(0, 4).map((post) => {
    const colors = getPostColors(post.slug);
    return { ...post, ...colors };
  });

  const featuredProjects =
    projectsData.find((section) => decodeMsg(section.category) === "Featured")
      ?.projects || [];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section>
        <h1 className="font-serif font-normal text-4xl sm:text-5xl lg:text-[56px] leading-[1.02] tracking-tight text-foreground mb-4">
          <T id="hero_greeting">
            Hello, Ahoj, Привет,{" "}
            <span dir="rtl">مرحبا</span>.
          </T>
        </h1>

        <p className="font-serif text-lg sm:text-xl leading-relaxed text-ink-soft font-light mb-2.5">
          <T id="hero_bio_paragraph_1">
            I'm Ben — a student at BYU studying CS and Arabic. I build
            open-source libraries, web applications, and AI tools. Currently
            working at{" "}
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
          <T id="hero_bio_paragraph_2">
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
            <a
              href="/ben-gubler-resume.pdf"
              className="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              R&eacute;sum&eacute;
            </a>
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
            <T id="projects_heading">Projects</T>
          </h2>
          <Link
            href="/projects"
            className="font-mono text-[11px] text-muted-foreground hover:text-foreground no-underline transition-colors"
          >
            <T id="view_all">See All &#x25B8;</T>
          </Link>
        </div>
        <ProjectList projects={featuredProjects} compact />
      </section>


      {/* Recent Posts Section */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif font-medium text-[28px] tracking-tight text-foreground">
            <T id="recent_posts_heading">Recent Posts</T>
          </h2>
          {sortedPosts.length > 4 && (
            <Link
              href="/posts"
              className="font-mono text-[11px] text-muted-foreground hover:text-foreground no-underline transition-colors"
            >
              <T id="view_all_posts">See All &#x25B8;</T>
            </Link>
          )}
        </div>
        <div>
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={post.url as any}
              className="grid grid-cols-[1fr] sm:grid-cols-[100px_1fr_auto] gap-x-5 gap-y-1 py-4 border-b border-dotted border-border items-baseline no-underline text-inherit hover:bg-rule-soft/30 transition-colors -mx-2 px-2 rounded-sm"
            >
              <ViewTransition name={`date-${sanitize(post.url)}`}>
                <div className="font-mono text-[11px] text-muted-foreground tracking-wide">
                  {post.date.toLocaleDateString(locale, {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </ViewTransition>
              <div>
                <ViewTransition name={`title-${sanitize(post.url)}`}>
                  <div className="font-serif text-xl font-medium text-foreground leading-tight mb-1">
                    {post.title}
                  </div>
                </ViewTransition>
                <ViewTransition name={`description-${sanitize(post.url)}`}>
                  <div className="font-serif text-sm leading-relaxed text-ink-soft font-light">
                    {post.description}
                  </div>
                </ViewTransition>
              </div>
              <div className="hidden sm:block font-mono text-[11px] text-muted-foreground text-right whitespace-nowrap">
                <ViewTransition name={`reading-time-${sanitize(post.url)}`}>
                  <span>{post.readingTime}</span>
                </ViewTransition>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
