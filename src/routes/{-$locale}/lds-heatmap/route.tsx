import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { getRouteMetadata } from "@/lib/metadata";
import { Heatmap } from "./-heatmap";

const getTopology = createServerFn({ method: "GET" }).handler(async () => {
  const { getTopologyData } = await import("./-topology.server");
  return getTopologyData();
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
    const [topology, metadata] = await Promise.all([
      getTopology(),
      getMetadata(),
    ]);
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
