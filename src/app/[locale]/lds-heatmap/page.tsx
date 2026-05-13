import type { Metadata } from "next";
import { Heatmap } from "./heatmap";
import type { Topology } from "./topojson";

export const metadata: Metadata = {
  title: "LDS Membership Heat Map — 2024",
  description:
    "Interactive heat map of Latter-day Saint membership worldwide, by country, US state, and Canadian province.",
};

const MAP_REVALIDATE_SECONDS = 60 * 60 * 24 * 30;

async function loadTopology(url: string) {
  const response = await fetch(url, {
    next: { revalidate: MAP_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Failed to load topology data from ${url}`);
  }

  return response.json() as Promise<Topology>;
}

export default async function LdsHeatmapPage() {
  const [worldTopology, usTopology] = await Promise.all([
    loadTopology(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
    ),
    loadTopology("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),
  ]);

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8 md:-my-12">
      <Heatmap worldTopology={worldTopology} usTopology={usTopology} />
    </div>
  );
}
