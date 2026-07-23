import { dataResource, readData } from "@bgub/fig";
import { createServerFn } from "@bgub/fig-tanstack-start";
import { createFileRoute } from "@tanstack/solid-router";
import { getGT } from "gt-fig-tanstack-start";
import { getPageMetadata } from "@/lib/metadata";
import { Heatmap } from "./-heatmap";

const getTopology = createServerFn({ method: "GET" }).handler(async () => {
  const { getTopologyData } = await import("./-topology.server");
  return getTopologyData();
});

const topologyResource = dataResource({
  key: () => ["lds-heatmap-topology"],
  load: () => getTopology(),
});

export const Route = createFileRoute("/{-$locale}/lds-heatmap")({
  loader: async ({ context }) => {
    await context.data.ensureData(topologyResource);
  },
  head: async () => {
    const gt = await getGT();
    return {
      meta: getPageMetadata({
        title: `${gt("LDS Membership Heat Map — 2024")} - Ben Gubler`,
        description: gt(
          "Interactive heat map of Latter-day Saint membership worldwide, by country, US state, and Canadian province.",
        ),
      }),
    };
  },
  component: LdsHeatmapPage,
});

function LdsHeatmapPage() {
  const { worldTopology, usTopology } = readData(topologyResource);
  return (
    <div class="-mx-4 sm:-mx-6 lg:-mx-8 -my-8 md:-my-12">
      <Heatmap worldTopology={worldTopology} usTopology={usTopology} />
    </div>
  );
}
