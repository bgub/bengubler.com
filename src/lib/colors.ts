// Unified color system — warm editorial palette with colored top stripes
import { allPosts } from "content-collections";

const colorOptions = [
  {
    bg: "bg-card",
    border: "border-border hover:border-peach-deep/60",
    stripe: "bg-peach",
  },
  {
    bg: "bg-card",
    border: "border-border hover:border-sage-deep/60",
    stripe: "bg-sage",
  },
  {
    bg: "bg-card",
    border: "border-border hover:border-lavender-deep/60",
    stripe: "bg-lavender",
  },
  {
    bg: "bg-card",
    border: "border-border hover:border-peach-deep/60",
    stripe: "bg-buttercream",
  },
];

// Get color by index
export function getColorByIndex(index: number) {
  return colorOptions[index % colorOptions.length];
}

// Get deterministic post index based on date sorting
function getPostIndex(slug: string): number {
  const sortedPosts = allPosts.sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
  const index = sortedPosts.findIndex((post) => post.slug === slug);
  return index === -1 ? 0 : index;
}

export function getPostColors(slug: string) {
  const index = getPostIndex(slug);
  return getColorByIndex(index);
}
