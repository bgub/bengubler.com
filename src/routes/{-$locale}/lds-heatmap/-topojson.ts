import type * as d3 from "d3";

type Position = [number, number];

type TopoGeometryBase = {
  id?: string | number;
};

export type TopoGeometry =
  | (TopoGeometryBase & { type: "Polygon"; arcs: number[][] })
  | (TopoGeometryBase & { type: "MultiPolygon"; arcs: number[][][] });

export interface TopoObject {
  geometries: TopoGeometry[];
}

export interface Topology {
  arcs: Position[][];
  transform: { scale: Position; translate: Position };
  objects: Record<string, TopoObject>;
}

type GeoGeometry =
  | { type: "Polygon"; coordinates: Position[][] }
  | { type: "MultiPolygon"; coordinates: Position[][][] };

export type GeoFeature = d3.ExtendedFeature<
  GeoGeometry,
  Record<string, unknown>
>;

export type DecodedTopology = d3.ExtendedFeatureCollection<GeoFeature>;

export function decodeTopo(topo: Topology, obj: TopoObject): DecodedTopology {
  const {
    arcs,
    transform: {
      scale: [sx, sy],
      translate: [tx, ty],
    },
  } = topo;

  const decodeArc = (arcIndex: number) => {
    const arc = arcs[arcIndex < 0 ? ~arcIndex : arcIndex];
    const coordinates: Position[] = [];
    let x = 0;
    let y = 0;
    for (const [dx, dy] of arc) {
      x += dx;
      y += dy;
      coordinates.push([x * sx + tx, y * sy + ty]);
    }
    return arcIndex < 0 ? coordinates.reverse() : coordinates;
  };

  const decodeRing = (ring: number[]) => {
    const coordinates: Position[] = [];
    ring.forEach((arcIndex, index) => {
      const arc = decodeArc(arcIndex);
      if (index > 0) arc.shift();
      coordinates.push(...arc);
    });
    return coordinates;
  };

  return {
    type: "FeatureCollection",
    features: obj.geometries.map(
      (geometry): GeoFeature => ({
        type: "Feature",
        id: geometry.id,
        properties: {},
        geometry:
          geometry.type === "Polygon"
            ? { type: "Polygon", coordinates: geometry.arcs.map(decodeRing) }
            : {
                type: "MultiPolygon",
                coordinates: geometry.arcs.map((polygon) =>
                  polygon.map(decodeRing),
                ),
              },
      }),
    ),
  };
}
