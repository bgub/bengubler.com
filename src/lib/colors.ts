// Unified color system — warm editorial palette with colored top stripes
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
