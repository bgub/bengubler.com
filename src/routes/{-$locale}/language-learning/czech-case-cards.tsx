import { createFileRoute, redirect } from "@tanstack/react-router";
import { getLocalizedPath, resolveLocale } from "@/lib/locales";

export const Route = createFileRoute(
  "/{-$locale}/language-learning/czech-case-cards",
)({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: getLocalizedPath(
        "/language-learning/czech-declensions",
        resolveLocale(params.locale),
      ) as never,
      statusCode: 308,
    });
  },
});
