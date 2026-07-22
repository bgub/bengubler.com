import { createFileRoute } from "@tanstack/react-router";
import { resolveLocale } from "@/lib/locales";
import { getRawPostResponse } from "@/lib/raw-post.server";

export const Route = createFileRoute("/{-$locale}/posts/{$slug}.md")({
  server: {
    handlers: {
      GET: ({ params }) => {
        return getRawPostResponse(resolveLocale(params.locale), params.slug);
      },
    },
  },
});
