import { createFileRoute } from "@tanstack/solid-router";
import { resolveLocale } from "@/lib/locales";
import { getRawPostResponse } from "@/lib/raw-post.server";

export const Route = createFileRoute("/{-$locale}/api/posts/$slug/raw")({
  server: {
    handlers: {
      GET: ({ params }) => {
        return getRawPostResponse(resolveLocale(), params.slug);
      },
    },
  },
});
