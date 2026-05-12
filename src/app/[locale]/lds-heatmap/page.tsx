import type { Metadata } from "next";
import { getGT } from "gt-next/server";
import { Heatmap } from "./heatmap";

export async function generateMetadata(): Promise<Metadata> {
  const gt = await getGT();
  return {
    title: gt("LDS Membership Heat Map — 2024"),
    description: gt(
      "Interactive heat map of Latter-day Saint membership worldwide, by country, US state, and Canadian province."
    ),
  };
}

export default function LdsHeatmapPage() {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8 md:-my-12">
      <Heatmap />
    </div>
  );
}
