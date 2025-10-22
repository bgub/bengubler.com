import { PostCard } from "@/components/post-card";
import { ProjectList } from "@/components/project-list";
import { Badge } from "@/components/ui/badge";
import { getPostColors } from "@/lib/colors";
import { projectsData } from "@/lib/projects";
import { allPosts } from "content-collections";
import { getLocale } from "gt-next/server";
import { ArrowRight, Github, Twitter } from "lucide-react";
import Link from "next/link";
import { decodeMsg, T } from "gt-next";

type Post = (typeof allPosts)[0];

export default async function HomePage() {

  const locale = (await getLocale()) || "en";

  // Get all posts sorted by date for consistent color assignment (current locale only)
  const sortedPosts = allPosts
    .filter((post: Post) => (post as any).locale === locale)
    .filter((post: Post) => !post.archived)
    .sort((a: Post, b: Post) => b.date.getTime() - a.date.getTime());

  // Get the 3 most recent posts with consistent colors based on date-determined index
  const recentPosts = sortedPosts.slice(0, 3).map((post) => {
    const colors = getPostColors(post.slug);
    return {
      ...post,
      color: colors.bg,
      borderColor: colors.border,
    };
  });

  // Get featured projects from the new data structure
  const featuredProjects =
    projectsData.find((section) => decodeMsg(section.category) === "Featured")?.projects ||
    [];

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section>
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              <T id="hero_greeting">Hello! Ahoj! Привет! مرحبا! 👋</T>
            </h1>
            <div className="flex items-center space-x-3">
              <Badge className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30">
                <T id="hero_vercel_badge">Currently interning @ Vercel</T>
              </Badge>
              <Link
                href="https://github.com/bgub"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only"><T id="github_label">GitHub</T></span>
              </Link>
              <Link
                href="https://x.com/bgub_"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only"><T id="twitter_label">Twitter</T></span>
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <T id="hero_bio_paragraph_1">I'm Ben — a student at BYU studying Applied Math and Arabic. I build open-source libraries, web applications, and AI tools. Currently interning at Vercel.</T>
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <T id="hero_bio_paragraph_2">Check out my <Link
                href="/projects"
                className="text-foreground hover:underline font-medium"
              >projects</Link>, read my <Link
                href="/posts"
                className="text-foreground hover:underline font-medium"
              >writing</Link>, or view my <a
                href="/ben-gubler-resume.pdf"
                className="text-foreground hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >résumé</a>.</T>
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              <T id="projects_heading">Projects</T>
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <T id="view_all">View all</T>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ProjectList projects={featuredProjects} />
        </div>
      </section>

      {/* Recent Posts Section */}
      <section>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              <T id="recent_posts_heading">Recent Posts</T>
            </h2>
            {allPosts.filter((p) => (p as any).locale === locale).length > 3 && (
              <Link
                href="/posts"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                <T id="view_all">View all</T>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
          <div className="@container">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post: Post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
