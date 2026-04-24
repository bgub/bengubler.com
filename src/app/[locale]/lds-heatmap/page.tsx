import type { Metadata } from "next";
import { Heatmap } from "./heatmap";

export const metadata: Metadata = {
  title: "LDS Membership Heat Map — 2024",
  description:
    "Interactive heat map of Latter-day Saint membership worldwide, by country, US state, and Canadian province.",
};

export default function LdsHeatmapPage() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8 md:-my-12">
      <Heatmap />
    </div>
  );
}
