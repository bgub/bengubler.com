import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { Heatmap } from "@/components/lds-heatmap/heatmap";
import type { Topology } from "@/components/lds-heatmap/topojson";
import { getRouteMetadata } from "@/lib/metadata";

const getTopology = createServerFn({ method: "GET" }).handler(async () => {
  const { getTopologyData } = await import("@/lib/topology.server");
  return JSON.stringify(await getTopologyData());
});

const getMetadata = createServerFn({ method: "GET" }).handler(async () => {
  const gt = await getGT();
  return {
    title: `${gt("LDS Membership Heat Map — 2024")} - Ben Gubler`,
    description: gt(
      "Interactive heat map of Latter-day Saint membership worldwide, by country, US state, and Canadian province.",
    ),
  };
});

export const Route = createFileRoute("/{-$locale}/lds-heatmap")({
  loader: async () => {
    const [topologyJson, metadata] = await Promise.all([
      getTopology(),
      getMetadata(),
    ]);
    const topology = JSON.parse(topologyJson) as {
      usTopology: Topology;
      worldTopology: Topology;
    };
    return { ...topology, metadata };
  },
  head: ({ loaderData, params }) => ({
    meta: getRouteMetadata(loaderData?.metadata, params.locale),
  }),
  component: LdsHeatmapPage,
});

function LdsHeatmapPage() {
  const { worldTopology, usTopology } = Route.useLoaderData();
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8 md:-my-12">
      <Heatmap worldTopology={worldTopology} usTopology={usTopology} />
    </div>
  );
}
