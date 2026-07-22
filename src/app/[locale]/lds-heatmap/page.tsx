import { Heatmap } from "./heatmap";
import type { Topology } from "./topojson";

export function LdsHeatmapPage({
  worldTopology,
  usTopology,
}: {
  worldTopology: Topology;
  usTopology: Topology;
}) {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8 md:-my-12">
      <Heatmap worldTopology={worldTopology} usTopology={usTopology} />
    </div>
  );
}
