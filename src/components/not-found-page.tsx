import { T } from "gt-react";
import type { ReactNode } from "react";
import { Link } from "@/components/link";

function NotFoundLayout({
  actions,
  description,
  title,
}: {
  actions: ReactNode;
  description: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-y-6 text-center">
      <div className="space-y-4">
        <T>
          <h1 className="font-serif text-6xl font-medium text-muted-foreground">
            404
          </h1>
        </T>
        {title}
        {description}
      </div>
      <div className="flex items-center gap-4 font-mono text-[11.5px]">
        {actions}
      </div>
    </div>
  );
}

const actionClassName =
  "border-b border-border pb-px text-ink-soft no-underline transition-colors hover:border-ink-mute hover:text-foreground";

export function PageNotFound() {
  return (
    <NotFoundLayout
      title={
        <T>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
            Page Not Found
          </h2>
        </T>
      }
      description={
        <T>
          <p className="mx-auto max-w-md font-serif text-lg font-light leading-relaxed text-ink-soft">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </T>
      }
      actions={
        <>
          <T>
            <Link href="/" className={actionClassName}>
              Go Home
            </Link>
          </T>
          <span className="text-ink-faint">&middot;</span>
          <T>
            <Link href="/posts" className={actionClassName}>
              View Posts
            </Link>
          </T>
        </>
      }
    />
  );
}

export function PostNotFound() {
  return (
    <NotFoundLayout
      title={
        <T>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
            Post Not Found
          </h2>
        </T>
      }
      description={
        <T>
          <p className="mx-auto max-w-md font-serif text-lg font-light leading-relaxed text-ink-soft">
            Sorry, the post you're looking for doesn't exist or has been moved.
          </p>
        </T>
      }
      actions={
        <>
          <T>
            <Link href="/posts" className={actionClassName}>
              Browse All Posts
            </Link>
          </T>
          <span className="text-ink-faint">&middot;</span>
          <T>
            <Link href="/" className={actionClassName}>
              Go Home
            </Link>
          </T>
        </>
      }
    />
  );
}
