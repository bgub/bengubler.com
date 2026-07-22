import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getGT } from "gt-tanstack-start/server";
import { LdsHeatmapPage } from "@/app/[locale]/lds-heatmap/page";
import type { Topology } from "@/app/[locale]/lds-heatmap/topojson";
import { resolveLocale } from "@/lib/locales";
import { getPageMetadata } from "@/lib/metadata";

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
    meta: loaderData
      ? getPageMetadata({
          ...loaderData.metadata,
          locale: resolveLocale(params.locale),
        })
      : [],
  }),
  component: HeatmapRoute,
});

function HeatmapRoute() {
  const { worldTopology, usTopology } = Route.useLoaderData();
  return (
    <LdsHeatmapPage worldTopology={worldTopology} usTopology={usTopology} />
  );
}
