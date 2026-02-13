"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  COUNTRIES,
  COUNTRY_NAMES,
  US_STATES,
  CA_PROVINCES,
  FIPS_TO_STATE,
  fmt,
  pct,
  type TipData,
  type RankedItem,
} from "./data";
import { decodeTopo, type Topology } from "./topojson";

// ── COLOR SCALES ─────────────────────────────────────────────
// ColorBrewer Blues-7 (total members) and YlOrRd-7 (% of pop.)
// Using scalePow instead of scaleLog — log was compressing the
// upper range so 4% and 60% looked nearly identical.

const BG = "#f0f4f8";
const PALETTE_TOTAL = ["#f7fbff", "#c6dbef", "#6baed6", "#3182bd", "#08519c", "#08306b", "#041e42"];
const PALETTE_PCT = ["#ffffcc", "#fed976", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026", "#4a0012"];

function heat(val: number, lo: number, hi: number, palette: string[], exp: number) {
  if (!val) return BG;
  const t = d3.scalePow().exponent(exp).domain([lo, hi]).range([0, 1]).clamp(true)(val);
  const n = palette.length - 1;
  return d3
    .scaleLinear<string>()
    .domain(palette.map((_, i) => i / n))
    .range(palette)
    .clamp(true)(t);
}

// ── COMPONENT ─────────────────────────────────────────────────

const W = 960;
const H = 500;

const FLY_TARGETS = [
  ["Reset", 0, 0, 1],
  ["US", -580, -115, 4.2],
  ["S. America", -420, -550, 3.2],
  ["Africa", -1020, -340, 4],
  ["Pacific", -1950, -350, 3.8],
] as const;

export function Heatmap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [world, setWorld] = useState<ReturnType<typeof decodeTopo> | null>(null);
  const [us, setUs] = useState<ReturnType<typeof decodeTopo> | null>(null);
  const [tip, setTip] = useState<TipData | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<"total" | "pct">("total");

  useEffect(() => {
    const load = (url: string) => fetch(url).then((r) => r.json());
    load("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((t: Topology) =>
      setWorld(decodeTopo(t, t.objects.countries)),
    );
    load("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then((t: Topology) =>
      setUs(decodeTopo(t, t.objects.states)),
    );
  }, []);

  useEffect(() => {
    if (!svgRef.current || !world) return;
    const svg = d3.select(svgRef.current);
    const g = svg.select("#g");
    const z = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 30])
      .on("zoom", (e) => {
        g.attr("transform", e.transform);
        setZoom(e.transform.k);
      });
    svg.call(z);
    (svgRef.current as SVGSVGElement & { _z: typeof z })._z = z;
    return () => {
      svg.on(".zoom", null);
    };
  }, [world]);

  const fly = (tx: number, ty: number, s: number) => {
    if (!svgRef.current) return;
    const el = svgRef.current as SVGSVGElement & {
      _z: d3.ZoomBehavior<SVGSVGElement, unknown>;
    };
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(el._z.transform, d3.zoomIdentity.translate(tx, ty).scale(s));
  };

  const proj = d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" });
  const geoPath = d3.geoPath().projection(proj);
  const strokeWidth = Math.max(0.06, 0.25 / Math.sqrt(zoom));
  const isPct = mode === "pct";
  const palette = isPct ? PALETTE_PCT : PALETTE_TOTAL;

  function countryColor(id: string) {
    const d = COUNTRIES[id];
    if (!d) return BG;
    if (id === "840") return "#eef2f6";
    return isPct
      ? heat(pct(d[0], d[1]), 0.01, 65, PALETTE_PCT, 0.5)
      : heat(d[0], 50, 7e6, PALETTE_TOTAL, 0.15);
  }

  function stateColor(name: string) {
    const d = US_STATES[name];
    if (!d) return BG;
    return isPct
      ? heat(pct(d[0], d[1]), 0.3, 68, PALETTE_PCT, 0.5)
      : heat(d[0], 2000, 2.2e6, PALETTE_TOTAL, 0.2);
  }

  const rank = (data: Record<string, [number, number]>, names?: Record<string, string>) =>
    Object.entries(data)
      .map(([key, [m, p]]) => ({ n: names ? names[key] || key : key, m, p, pv: pct(m, p) }))
      .sort((a, b) => (isPct ? b.pv - a.pv : b.m - a.m));

  const ranked = rank(COUNTRIES, COUNTRY_NAMES).slice(0, 20);
  const stateRanked = rank(US_STATES).slice(0, 10);
  const caRanked = rank(CA_PROVINCES).slice(0, 8);

  const topVal = (items: RankedItem[]) =>
    isPct ? Math.max(...items.map((r) => r.pv)) : items[0]?.m || 1;

  return (
    <div
      ref={boxRef}
      onMouseMove={(e) => {
        const r = boxRef.current?.getBoundingClientRect();
        if (r) setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      className="relative flex flex-col overflow-hidden select-none"
      style={{ background: "#f8f9fb", color: "#1a1a2e", height: "calc(100vh - 64px)" }}
    >
      {/* Header */}
      <div
        className="flex flex-wrap items-end justify-between gap-2"
        style={{ padding: "12px 18px 8px", borderBottom: "1px solid #e5e8ed" }}
      >
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: 3, color: "#888" }}>
            Membership Heat Map &middot; 2024
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: "2px 0 0", color: "#1a1a2e" }}>
            Latter-day Saints{" "}
            <span style={{ fontWeight: 400, color: "#888", fontSize: 15 }}>Worldwide</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-1 pb-0.5">
          <div className="flex mr-2" style={{ background: "#eef1f5", borderRadius: 6, padding: 2 }}>
            {([["total", "Total Members"], ["pct", "% of Pop."]] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setMode(k)}
                className="font-mono cursor-pointer"
                style={{
                  padding: "4px 12px",
                  borderRadius: 5,
                  border: "none",
                  background: mode === k ? "#fff" : "transparent",
                  color: mode === k ? "#1a1a2e" : "#999",
                  fontSize: 10,
                  fontWeight: mode === k ? 600 : 400,
                  boxShadow: mode === k ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all .15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {FLY_TARGETS.map(([label, x, y, s]) => (
            <button
              key={label}
              onClick={() => fly(x, y, s)}
              className="font-mono cursor-pointer"
              style={{
                padding: "3px 9px",
                borderRadius: 4,
                border: "1px solid #dde1e7",
                background: "#fff",
                color: "#666",
                fontSize: 9.5,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Map */}
        <div className="relative flex-1 overflow-hidden" style={{ background: "#eef2f6" }}>
          {!world ? (
            <div className="flex items-center justify-center h-full" style={{ color: "#aaa" }}>
              Loading&hellip;
            </div>
          ) : (
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-full cursor-grab">
              <rect width={W} height={H} fill="#eef2f6" />
              <g id="g">
                <path
                  d={geoPath({ type: "Sphere" }) || ""}
                  fill="#f8f9fb"
                  stroke="#dde1e7"
                  strokeWidth={0.5}
                />
                <path
                  d={geoPath(d3.geoGraticule10()) || ""}
                  fill="none"
                  stroke="#e8ecf0"
                  strokeWidth={0.3}
                />

                {world.features.map((f, i) => {
                  const id = String(f.id).padStart(3, "0");
                  const isUS = id === "840";
                  return (
                    <path
                      key={i}
                      d={geoPath(f as unknown as d3.GeoPermissibleObjects) || ""}
                      fill={countryColor(id)}
                      stroke={COUNTRIES[id] ? "#c0c8d4" : "#dde1e7"}
                      strokeWidth={strokeWidth}
                      className="cursor-pointer"
                      onMouseEnter={() => {
                        if (!isUS) {
                          const d = COUNTRIES[id];
                          setTip(
                            d
                              ? { name: COUNTRY_NAMES[id], m: d[0], pv: pct(d[0], d[1]) }
                              : { name: COUNTRY_NAMES[id] || "Unknown" },
                          );
                        }
                      }}
                      onMouseLeave={() => setTip(null)}
                    />
                  );
                })}

                {us?.features.map((f, i) => {
                  const name = FIPS_TO_STATE[String(f.id).padStart(2, "0")];
                  if (!name) return null;
                  const d = geoPath(f as unknown as d3.GeoPermissibleObjects);
                  if (!d) return null;
                  return (
                    <path
                      key={"s" + i}
                      d={d}
                      fill={stateColor(name)}
                      stroke="#c0c8d4"
                      strokeWidth={Math.max(0.04, 0.18 / Math.sqrt(zoom))}
                      className="cursor-pointer"
                      onMouseEnter={() => {
                        const dd = US_STATES[name];
                        setTip(
                          dd ? { name, m: dd[0], pv: pct(dd[0], dd[1]), state: true } : { name },
                        );
                      }}
                      onMouseLeave={() => setTip(null)}
                    />
                  );
                })}
              </g>
            </svg>
          )}

          {/* Legend */}
          <div
            className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5"
            style={{
              background: "rgba(255,255,255,0.92)",
              padding: "5px 10px",
              borderRadius: 6,
              border: "1px solid #dde1e7",
              backdropFilter: "blur(6px)",
            }}
          >
            <span className="font-mono" style={{ fontSize: 8, color: "#999" }}>
              {isPct ? "0%" : "FEW"}
            </span>
            <div
              style={{
                width: 80,
                height: 7,
                borderRadius: 3,
                background: `linear-gradient(90deg,${palette.join(",")})`,
              }}
            />
            <span className="font-mono" style={{ fontSize: 8, color: "#999" }}>
              {isPct ? "65%+" : "MILLIONS"}
            </span>
          </div>
          <div
            className="absolute bottom-2.5 right-2.5 font-mono"
            style={{
              background: "rgba(255,255,255,0.92)",
              padding: "3px 8px",
              borderRadius: 4,
              border: "1px solid #dde1e7",
              fontSize: 9,
              color: "#aaa",
            }}
          >
            {zoom.toFixed(1)}&times; &middot; scroll / drag
          </div>
        </div>

        {/* Sidebar */}
        <div
          className="shrink-0 overflow-y-auto"
          style={{
            width: 225,
            padding: "6px 14px 14px 10px",
            borderLeft: "1px solid #e5e8ed",
            background: "#fff",
          }}
        >
          <Rank title="Countries" items={ranked} max={topVal(ranked)} mode={mode} />
          <Rank title="US States" items={stateRanked} max={topVal(stateRanked)} mode={mode} hasBorder />
          <Rank title="Canadian Provinces" items={caRanked} max={topVal(caRanked)} mode={mode} hasBorder />
          <div className="font-mono" style={{ marginTop: 12, fontSize: 7.5, color: "#bbb", lineHeight: 1.5 }}>
            Source: Church of Jesus Christ Newsroom, World Population Review, Statistics Canada. Dec
            31 2024. Canadian province figures are estimates based on ~40% Alberta share of 205K
            national total.
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tip && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: Math.min(mouse.x + 14, (boxRef.current?.clientWidth || 800) - 195),
            top: Math.max(mouse.y - 55, 10),
            background: "#fff",
            border: "1px solid #dde1e7",
            borderRadius: 8,
            padding: "8px 12px",
            zIndex: 100,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            minWidth: 120,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 12, color: "#1a1a2e" }}>{tip.name}</div>
          {tip.m ? (
            <>
              <div className="font-mono" style={{ fontSize: 11, color: "#2d7fc0" }}>
                {tip.m.toLocaleString()} members
              </div>
              <div className="font-mono" style={{ fontSize: 10, color: "#666" }}>
                {tip.pv?.toFixed(2)}% of population
              </div>
              {tip.state && (
                <div style={{ fontSize: 8, color: "#bbb", marginTop: 1 }}>U.S. State</div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 10, color: "#bbb" }}>No reported presence</div>
          )}
        </div>
      )}
    </div>
  );
}

function Rank({
  title,
  items,
  max,
  mode,
  hasBorder,
}: {
  title: string;
  items: RankedItem[];
  max: number;
  mode: "total" | "pct";
  hasBorder?: boolean;
}) {
  return (
    <div style={hasBorder ? { marginTop: 10, borderTop: "1px solid #eef1f5", paddingTop: 8 } : undefined}>
      <div
        className="font-mono uppercase"
        style={{ fontSize: 9, letterSpacing: 2, color: "#aaa", marginBottom: 6 }}
      >
        {title}
      </div>
      {items.map((it, i) => {
        const v = mode === "pct" ? it.pv : it.m;
        const barW = Math.max(1.5, (v / max) * 100);
        return (
          <div key={i} className="flex items-center gap-1.5" style={{ padding: "2.5px 0" }}>
            <span
              className="font-mono text-right"
              style={{
                fontSize: 8.5,
                color: i < 3 ? "#1d4e89" : "#ccc",
                width: 14,
                fontWeight: i < 3 ? 600 : 400,
              }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between" style={{ marginBottom: 1 }}>
                <span
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ color: i < 3 ? "#1a1a2e" : "#666", fontSize: 10 }}
                >
                  {it.n}
                </span>
                <span
                  className="font-mono whitespace-nowrap"
                  style={{ fontSize: 8.5, color: "#1d4e89", marginLeft: 3 }}
                >
                  {mode === "pct" ? it.pv.toFixed(1) + "%" : fmt(it.m)}
                </span>
              </div>
              <div className="overflow-hidden" style={{ height: 2.5, background: "#f0f2f5", borderRadius: 2 }}>
                <div
                  style={{
                    height: "100%",
                    width: barW + "%",
                    background:
                      i === 0
                        ? "linear-gradient(90deg,#2d7fc0,#1d4e89)"
                        : i < 5
                          ? "#2d7fc0"
                          : "#1d4e89",
                    borderRadius: 2,
                    opacity: i < 3 ? 1 : 0.6,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
