import { PostCard } from "@/components/post-card";
import { ProjectList } from "@/components/project-list";
import { Badge } from "@/components/ui/badge";
import { getPostColors } from "@/lib/colors";
import { projectsData } from "@/lib/projects";
import { allPosts } from "content-collections";
import { ArrowRight, Github, Twitter } from "lucide-react";
import Link from "next/link";

type Post = (typeof allPosts)[0];

export default function HomePage() {
  // Get all posts sorted by date for consistent color assignment
  const sortedPosts = allPosts
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
    projectsData.find((section) => section.category === "Featured")?.projects ||
    [];

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section>
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Hello! Ahoj! Привет! مرحبا! 👋
            </h1>
            <div className="flex items-center space-x-3">
              <Badge className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30">
                Currently interning @ Vercel
              </Badge>
              <Link
                href="https://github.com/bgub"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://x.com/bgub_"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm Ben — a student at BYU studying Applied Math and Arabic. I
              build open-source libraries, web applications, and AI tools.
              Currently interning at Vercel.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Check out my{" "}
              <Link
                href="/projects"
                className="text-foreground hover:underline font-medium"
              >
                projects
              </Link>
              , read my{" "}
              <Link
                href="/posts"
                className="text-foreground hover:underline font-medium"
              >
                writing
              </Link>
              , or view my{" "}
              <Link
                href="/ben-gubler-resume.pdf"
                className="text-foreground hover:underline font-medium"
              >
                résumé
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Projects
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              View all
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
              Recent Posts
            </h2>
            {allPosts.length > 3 && (
              <Link
                href="/posts"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                View all
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
