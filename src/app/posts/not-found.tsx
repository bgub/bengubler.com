import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Post Not Found - Ben Gubler",
  description: "The post you're looking for doesn't exist.",
};

export default function PostNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Post Not Found
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          Sorry, the post you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button asChild>
          <Link href="/posts">Browse All Posts</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
