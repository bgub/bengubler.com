import { createFileRoute, redirect } from "@tanstack/react-router";
import { getLocalizedPath, resolveLocale } from "@/lib/locales";

export const Route = createFileRoute(
  "/{-$locale}/language-learning/russian-case-cards",
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: getLocalizedPath(
        "/language-learning/russian-declensions",
        resolveLocale(params.locale),
      ) as never,
      statusCode: 308,
    });
  },
});
