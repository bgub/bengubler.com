import type * as d3 from "d3";

export interface TopoGeometry {
  type: string;
  id?: string | number;
  properties?: Record<string, unknown>;
  arcs: number[][] | number[][][];
}

export interface TopoObject {
  geometries: TopoGeometry[];
}

export interface Topology {
  arcs: number[][][];
  transform: { scale: [number, number]; translate: [number, number] };
  objects: Record<string, TopoObject>;
}

export interface GeoFeature {
  type: "Feature";
  id?: string | number;
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export function decodeTopo(
  topo: Topology,
  obj: TopoObject,
): d3.GeoPermissibleObjects & { features: GeoFeature[] } {
  const {
    arcs,
    transform: {
      scale: [sx, sy],
      translate: [tx, ty],
    },
  } = topo;

  const decodeArc = (ai: number) => {
    const a = arcs[ai < 0 ? ~ai : ai];
    const coords: [number, number][] = [];
    let x = 0;
    let y = 0;
    for (const [dx, dy] of a) {
      x += dx;
      y += dy;
      coords.push([x * sx + tx, y * sy + ty]);
    }
    return ai < 0 ? coords.reverse() : coords;
  };

  const ring = (r: number[]) => {
    let coords: [number, number][] = [];
    r.forEach((ai, i) => {
      const a = decodeArc(ai);
      if (i) a.shift();
      coords = coords.concat(a);
    });
    return coords;
  };

  return {
    type: "FeatureCollection" as const,
    features: obj.geometries.map((g) => ({
      type: "Feature" as const,
      id: g.id,
      properties: g.properties || {},
      geometry:
        g.type === "Polygon"
          ? { type: "Polygon", coordinates: (g.arcs as number[][]).map(ring) }
          : g.type === "MultiPolygon"
            ? {
                type: "MultiPolygon",
                coordinates: (g.arcs as number[][][]).map((p) => p.map(ring)),
              }
            : (g as unknown as { type: string; coordinates: number[][][] }),
    })),
  } as d3.GeoPermissibleObjects & { features: GeoFeature[] };
}
