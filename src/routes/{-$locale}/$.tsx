import { createFileRoute } from "@tanstack/solid-router";
import { notFound } from "@tanstack/solid-router";

export const Route = createFileRoute("/{-$locale}/$")({
  loader: () => {
    throw notFound();
  },
});
