import { createFileRoute, redirect } from "@tanstack/solid-router";
import { getLocalizedPath, resolveLocale } from "@/lib/locales";

export const Route = createFileRoute(
  "/{-$locale}/language-learning/russian-case-cards",
)({
  beforeLoad: () => {
    throw redirect({
      href: getLocalizedPath(
        "/language-learning/russian-declensions",
        resolveLocale(),
      ),
      statusCode: 308,
    });
  },
});
