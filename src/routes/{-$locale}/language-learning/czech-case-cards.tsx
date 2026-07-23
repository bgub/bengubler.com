import { createFileRoute, redirect } from "@tanstack/solid-router";
import { getLocalizedPath, resolveLocale } from "@/lib/locales";

export const Route = createFileRoute(
  "/{-$locale}/language-learning/czech-case-cards",
)({
  beforeLoad: () => {
    throw redirect({
      href: getLocalizedPath(
        "/language-learning/czech-declensions",
        resolveLocale(),
      ),
      statusCode: 308,
    });
  },
});
