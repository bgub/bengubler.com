import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/$")({
  loader: () => {
    throw notFound();
  },
});
