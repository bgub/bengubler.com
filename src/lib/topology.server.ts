import type { Topology } from "@/components/lds-heatmap/topojson";

const cacheDuration = 60 * 60 * 24 * 30 * 1000;
const worldTopologyUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const usTopologyUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

type TopologyData = {
  usTopology: Topology;
  worldTopology: Topology;
};

let cachedTopology: Promise<TopologyData> | undefined;
let cacheExpiresAt = 0;

async function loadTopology(url: string) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json() as Promise<Topology>;
      lastError = new Error(
        `Failed to load topology data from ${url}: ${response.status}`,
      );
    } catch (error) {
      lastError = error;
    }
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 100 * 2 ** attempt));
    }
  }
  throw lastError;
}

export function getTopologyData() {
  if (!cachedTopology || Date.now() >= cacheExpiresAt) {
    cacheExpiresAt = Date.now() + cacheDuration;
    cachedTopology = Promise.all([
      loadTopology(worldTopologyUrl),
      loadTopology(usTopologyUrl),
    ])
      .then(([worldTopology, usTopology]) => ({ worldTopology, usTopology }))
      .catch((error) => {
        cachedTopology = undefined;
        cacheExpiresAt = 0;
        throw error;
      });
  }
  return cachedTopology;
}
