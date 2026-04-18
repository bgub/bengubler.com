import { T } from "gt-next";
import { getGT } from "gt-next/server";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();

  return {
    title: gt("Page Not Found - Ben Gubler"),
    description: gt("The page you're looking for doesn't exist."),
  };
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-4">
        <T>
          <h1 className="font-serif text-6xl font-medium text-muted-foreground">404</h1>
        </T>
        <T>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
            Page Not Found
          </h2>
        </T>
        <T>
          <p className="font-serif text-lg text-ink-soft font-light max-w-md mx-auto leading-relaxed">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </T>
      </div>

      <div className="flex gap-4 items-center font-mono text-[11.5px]">
        <T>
          <Link href="/" className="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors">
            Go Home
          </Link>
        </T>
        <span className="text-ink-faint">&middot;</span>
        <T>
          <Link href="/posts" className="text-ink-soft no-underline border-b border-border pb-px hover:text-foreground hover:border-ink-mute transition-colors">
            View Posts
          </Link>
        </T>
      </div>
    </div>
  );
}
