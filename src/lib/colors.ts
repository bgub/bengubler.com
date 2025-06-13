// Unified color system for all cards across the site
// Based on language learning, project, and post cards with consistent hover effects
import { allPosts } from "content-collections";

const colorOptions = [
  {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30",
    border:
      "border-blue-500/30 hover:border-blue-500/60 dark:border-blue-500/20 dark:hover:border-blue-500/40",
  },
  {
    bg: "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30",
    border:
      "border-emerald-500/30 hover:border-emerald-500/60 dark:border-emerald-500/20 dark:hover:border-emerald-500/40",
  },
  {
    bg: "bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/30",
    border:
      "border-purple-500/30 hover:border-purple-500/60 dark:border-purple-500/20 dark:hover:border-purple-500/40",
  },
  {
    bg: "bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/30 dark:to-red-950/30",
    border:
      "border-orange-500/30 hover:border-orange-500/60 dark:border-orange-500/20 dark:hover:border-orange-500/40",
  },
  {
    bg: "bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-950/30 dark:to-cyan-950/30",
    border:
      "border-sky-500/30 hover:border-sky-500/60 dark:border-sky-500/20 dark:hover:border-sky-500/40",
  },
  {
    bg: "bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950/30 dark:to-cyan-950/30",
    border:
      "border-teal-500/30 hover:border-teal-500/60 dark:border-teal-500/20 dark:hover:border-teal-500/40",
  },
  {
    bg: "bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-950/30 dark:to-blue-950/30",
    border:
      "border-indigo-500/30 hover:border-indigo-500/60 dark:border-indigo-500/20 dark:hover:border-indigo-500/40",
  },
  {
    bg: "bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30",
    border:
      "border-pink-500/30 hover:border-pink-500/60 dark:border-pink-500/20 dark:hover:border-pink-500/40",
  },
];

// Get color by index (for consistent ordering by date)
export function getColorByIndex(index: number) {
  return colorOptions[index % colorOptions.length];
}

// Get deterministic post index based on date sorting
function getPostIndex(slug: string): number {
  // Create a deterministic sorted array of all posts (newest first)
  const sortedPosts = allPosts.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  const index = sortedPosts.findIndex((post) => post.slug === slug);
  return index === -1 ? 0 : index;
}

export function getPostColors(slug: string) {
  const index = getPostIndex(slug);
  return getColorByIndex(index);
}
