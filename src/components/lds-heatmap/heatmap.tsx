import * as d3 from "d3";
import { msg, Num, T, useGT, useMessages, Var } from "gt-tanstack-start";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  CA_PROVINCES,
  COUNTRIES,
  COUNTRY_NAMES,
  FIPS_TO_STATE,
  fmt,
  pct,
  type RankedItem,
  type TipData,
  US_STATES,
} from "./data";
import { type DecodedTopology, decodeTopo, type Topology } from "./topojson";

// ColorBrewer Blues-7 (total members) and YlOrRd-7 (% of pop.)
// Using scalePow instead of scaleLog; log compressed the upper range too much.
const BG = "#f0f4f8";
const PALETTE_TOTAL = [
  "#f7fbff",
  "#c6dbef",
  "#6baed6",
  "#3182bd",
  "#08519c",
  "#08306b",
  "#041e42",
];
const PALETTE_PCT = [
  "#ffffcc",
  "#fed976",
  "#fd8d3c",
  "#fc4e2a",
  "#e31a1c",
  "#b10026",
  "#4a0012",
];

const W = 960;
const H = 500;

const FLY_TARGETS: [string, number, number, number][] = [
  [msg("Reset"), 0, 0, 1],
  [msg("US"), -580, -115, 4.2],
  [msg("S. America"), -420, -550, 3.2],
  [msg("Africa"), -1020, -340, 4],
  [msg("Pacific"), -1950, -350, 3.8],
];

const MODE_LABELS: [Mode, string][] = [
  ["total", msg("Total Members")],
  ["pct", msg("% of Pop.")],
];

type Mode = "total" | "pct";

interface HeatmapProps {
  worldTopology: Topology;
  usTopology: Topology;
}

export function Heatmap({ worldTopology, usTopology }: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<
    SVGSVGElement,
    unknown
  > | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<TipData | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState<Mode>("total");
  const world = useMemo(
    () => decodeTopo(worldTopology, worldTopology.objects.countries),
    [worldTopology],
  );
  const us = useMemo(
    () => decodeTopo(usTopology, usTopology.objects.states),
    [usTopology],
  );

  const setSvgNode = useCallback((node: SVGSVGElement | null) => {
    if (svgRef.current) {
      d3.select(svgRef.current).on(".zoom", null);
    }

    svgRef.current = node;
    zoomBehaviorRef.current = null;

    if (!node) return;

    const svg = d3.select(node);
    const g = svg.select<SVGGElement>("#g");
    const zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 30])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);
    zoomBehaviorRef.current = zoomBehavior;
  }, []);

  const fly = (tx: number, ty: number, scale: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity.translate(tx, ty).scale(scale),
      );
  };

  return (
    <div
      ref={boxRef}
      role="application"
      onMouseMove={(event) => {
        const rect = boxRef.current?.getBoundingClientRect();
        if (rect) {
          setMouse({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }
      }}
      className="relative flex flex-col overflow-hidden select-none"
      style={{
        background: "#f8f9fb",
        color: "#1a1a2e",
        height: "calc(100vh - 64px)",
      }}
    >
      <HeatmapHeader mode={mode} onModeChange={setMode} onFly={fly} />
      <div className="flex flex-1 min-h-0">
        <HeatmapMap
          world={world}
          us={us}
          zoom={zoom}
          mode={mode}
          onSvgMount={setSvgNode}
          onTipChange={setTip}
        />
        <HeatmapSidebar mode={mode} />
      </div>
      {tip && <HeatmapTooltip tip={tip} mouse={mouse} boxRef={boxRef} />}
    </div>
  );
}

function HeatmapHeader({
  mode,
  onModeChange,
  onFly,
}: {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onFly: (tx: number, ty: number, scale: number) => void;
}) {
  const m = useMessages();

  return (
    <div
      className="flex flex-wrap items-end justify-between gap-2"
      style={{ padding: "12px 18px 8px", borderBottom: "1px solid #e5e8ed" }}
    >
      <div>
        <div
          className="font-mono uppercase"
          style={{ fontSize: 12, letterSpacing: 0.5, color: "#888" }}
        >
          <T>Membership Heat Map &middot; 2024</T>
        </div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            margin: "2px 0 0",
            color: "#1a1a2e",
          }}
        >
          <T>
            Latter-day Saints{" "}
            <span style={{ fontWeight: 400, color: "#888", fontSize: 15 }}>
              Worldwide
            </span>
          </T>
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-1 pb-0.5">
        <div
          className="flex mr-2"
          style={{ background: "#eef1f5", borderRadius: 6, padding: 2 }}
        >
          {MODE_LABELS.map(([key, label]) => (
            <button
              type="button"
              key={key}
              onClick={() => onModeChange(key)}
              className="rounded-[5px] border-0 px-3 py-1 font-mono text-xs cursor-pointer transition-[background,color,box-shadow] duration-150"
              style={{
                background: mode === key ? "#fff" : "transparent",
                color: mode === key ? "#1a1a2e" : "#999",
                fontWeight: mode === key ? 600 : 400,
                boxShadow: mode === key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {m(label)}
            </button>
          ))}
        </div>
        {FLY_TARGETS.map(([label, x, y, scale]) => (
          <button
            type="button"
            key={label}
            onClick={() => onFly(x, y, scale)}
            className="rounded border border-[#dde1e7] bg-white px-[9px] py-[3px] font-mono text-xs text-[#666] cursor-pointer"
          >
            {m(label)}
          </button>
        ))}
      </div>
    </div>
  );
}

function HeatmapMap({
  world,
  us,
  zoom,
  mode,
  onSvgMount,
  onTipChange,
}: {
  world: DecodedTopology;
  us: DecodedTopology;
  zoom: number;
  mode: Mode;
  onSvgMount: (node: SVGSVGElement | null) => void;
  onTipChange: (tip: TipData | null) => void;
}) {
  const gt = useGT();
  const isPct = mode === "pct";
  const palette = isPct ? PALETTE_PCT : PALETTE_TOTAL;
  const proj = d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" });
  const geoPath = d3.geoPath().projection(proj);
  const strokeWidth = Math.max(0.06, 0.25 / Math.sqrt(zoom));
  const stateStrokeWidth = Math.max(0.04, 0.18 / Math.sqrt(zoom));

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{ background: "#eef2f6" }}
    >
      <svg
        ref={onSvgMount}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full cursor-grab"
        aria-label={gt("LDS membership heat map")}
      >
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
          {world.features.map((feature, index) => {
            const id =
              feature.id == null
                ? undefined
                : String(feature.id).padStart(3, "0");
            const countryKey = id ?? `unidentified-${index}`;
            const isUS = id === "840";

            return (
              // biome-ignore lint/a11y/noStaticElementInteractions: SVG path used for tooltip hover
              <path
                key={countryKey}
                d={
                  geoPath(feature as unknown as d3.GeoPermissibleObjects) || ""
                }
                fill={id ? countryColor(id, isPct) : BG}
                stroke={id && COUNTRIES[id] ? "#c0c8d4" : "#dde1e7"}
                strokeWidth={strokeWidth}
                className="cursor-pointer"
                onMouseEnter={() => {
                  if (id && !isUS) {
                    const data = COUNTRIES[id];
                    onTipChange(
                      data
                        ? {
                            name: COUNTRY_NAMES[id],
                            m: data[0],
                            pv: pct(data[0], data[1]),
                          }
                        : { name: COUNTRY_NAMES[id] || gt("Unknown") },
                    );
                  }
                }}
                onMouseLeave={() => onTipChange(null)}
              />
            );
          })}
          {us.features.map((feature) => {
            const fips = String(feature.id).padStart(2, "0");
            const name = FIPS_TO_STATE[fips];
            if (!name) return null;

            const path = geoPath(
              feature as unknown as d3.GeoPermissibleObjects,
            );
            if (!path) return null;

            return (
              // biome-ignore lint/a11y/noStaticElementInteractions: SVG path used for tooltip hover
              <path
                key={`s${fips}`}
                d={path}
                fill={stateColor(name, isPct)}
                stroke="#c0c8d4"
                strokeWidth={stateStrokeWidth}
                className="cursor-pointer"
                onMouseEnter={() => {
                  const data = US_STATES[name];
                  onTipChange(
                    data
                      ? {
                          name,
                          m: data[0],
                          pv: pct(data[0], data[1]),
                          state: true,
                        }
                      : { name },
                  );
                }}
                onMouseLeave={() => onTipChange(null)}
              />
            );
          })}
        </g>
      </svg>
      <MapLegend isPct={isPct} palette={palette} />
      <ZoomBadge zoom={zoom} />
    </div>
  );
}

function MapLegend({ isPct, palette }: { isPct: boolean; palette: string[] }) {
  const gt = useGT();

  return (
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
      <span className="font-mono" style={{ fontSize: 12, color: "#999" }}>
        {isPct ? "0%" : gt("FEW")}
      </span>
      <div
        style={{
          width: 80,
          height: 7,
          borderRadius: 3,
          background: `linear-gradient(90deg,${palette.join(",")})`,
        }}
      />
      <span className="font-mono" style={{ fontSize: 12, color: "#999" }}>
        {isPct ? "65%+" : gt("MILLIONS")}
      </span>
    </div>
  );
}

function ZoomBadge({ zoom }: { zoom: number }) {
  return (
    <div
      className="absolute bottom-2.5 right-2.5 font-mono"
      style={{
        background: "rgba(255,255,255,0.92)",
        padding: "3px 8px",
        borderRadius: 4,
        border: "1px solid #dde1e7",
        fontSize: 12,
        color: "#aaa",
      }}
    >
      <T>
        <Var>{zoom.toFixed(1)}</Var>&times; &middot; scroll / drag
      </T>
    </div>
  );
}

function HeatmapSidebar({ mode }: { mode: Mode }) {
  const gt = useGT();
  const ranked = rankItems(COUNTRIES, mode, COUNTRY_NAMES).slice(0, 20);
  const stateRanked = rankItems(US_STATES, mode).slice(0, 10);
  const caRanked = rankItems(CA_PROVINCES, mode).slice(0, 8);

  return (
    <div
      className="shrink-0 overflow-y-auto"
      style={{
        width: 225,
        padding: "6px 14px 14px 10px",
        borderLeft: "1px solid #e5e8ed",
        background: "#fff",
      }}
    >
      <Rank
        title={gt("Countries")}
        items={ranked}
        max={topVal(ranked, mode)}
        mode={mode}
      />
      <Rank
        title={gt("US States")}
        items={stateRanked}
        max={topVal(stateRanked, mode)}
        mode={mode}
        hasBorder
      />
      <Rank
        title={gt("Canadian Provinces")}
        items={caRanked}
        max={topVal(caRanked, mode)}
        mode={mode}
        hasBorder
      />
      <div
        className="font-mono"
        style={{
          marginTop: 12,
          fontSize: 12,
          color: "#bbb",
          lineHeight: 1.5,
        }}
      >
        <T>
          Source: Church of Jesus Christ Newsroom, World Population Review,
          Statistics Canada. Dec 31 2024. Canadian province figures are
          estimates based on ~40% Alberta share of 205K national total.
        </T>
      </div>
    </div>
  );
}

function HeatmapTooltip({
  tip,
  mouse,
  boxRef,
}: {
  tip: TipData;
  mouse: { x: number; y: number };
  boxRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className="absolute pointer-events-none z-30 min-w-[120px] rounded-lg border border-[#dde1e7] bg-white px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      style={{
        left: Math.min(
          mouse.x + 14,
          (boxRef.current?.clientWidth || 800) - 195,
        ),
        top: Math.max(mouse.y - 55, 10),
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 12, color: "#1a1a2e" }}>
        {tip.name}
      </div>
      {tip.m ? (
        <>
          <T>
            <div
              className="font-mono"
              style={{ fontSize: 12, color: "#2d7fc0" }}
            >
              <Num>{tip.m}</Num> members
            </div>
          </T>
          <T>
            <div className="font-mono" style={{ fontSize: 12, color: "#666" }}>
              <Var>{tip.pv?.toFixed(2)}</Var>% of population
            </div>
          </T>
          {tip.state && (
            <T>
              <div style={{ fontSize: 12, color: "#bbb", marginTop: 1 }}>
                U.S. State
              </div>
            </T>
          )}
        </>
      ) : (
        <T>
          <div style={{ fontSize: 12, color: "#bbb" }}>
            No reported presence
          </div>
        </T>
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
  mode: Mode;
  hasBorder?: boolean;
}) {
  return (
    <div
      style={
        hasBorder
          ? { marginTop: 10, borderTop: "1px solid #eef1f5", paddingTop: 8 }
          : undefined
      }
    >
      <div
        className="font-mono uppercase"
        style={{
          fontSize: 12,
          letterSpacing: 0.5,
          color: "#aaa",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      {items.map((item, index) => {
        const value = mode === "pct" ? item.pv : item.m;
        const barWidth = Math.max(1.5, (value / max) * 100);
        return (
          <div
            key={item.n}
            className="flex items-center gap-1.5"
            style={{ padding: "2.5px 0" }}
          >
            <span
              className="font-mono text-right"
              style={{
                fontSize: 12,
                color: index < 3 ? "#1d4e89" : "#ccc",
                width: 14,
                fontWeight: index < 3 ? 600 : 400,
              }}
            >
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between" style={{ marginBottom: 1 }}>
                <span
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    color: index < 3 ? "#1a1a2e" : "#666",
                    fontSize: 12,
                  }}
                >
                  {item.n}
                </span>
                <span
                  className="font-mono whitespace-nowrap"
                  style={{ fontSize: 12, color: "#1d4e89", marginLeft: 3 }}
                >
                  {mode === "pct" ? `${item.pv.toFixed(1)}%` : fmt(item.m)}
                </span>
              </div>
              <div
                className="overflow-hidden"
                style={{ height: 2.5, background: "#f0f2f5", borderRadius: 2 }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${barWidth}%`,
                    background:
                      index === 0
                        ? "linear-gradient(90deg,#2d7fc0,#1d4e89)"
                        : index < 5
                          ? "#2d7fc0"
                          : "#1d4e89",
                    borderRadius: 2,
                    opacity: index < 3 ? 1 : 0.6,
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

function heat(
  val: number,
  lo: number,
  hi: number,
  palette: string[],
  exp: number,
) {
  if (!val) return BG;
  const t = d3
    .scalePow()
    .exponent(exp)
    .domain([lo, hi])
    .range([0, 1])
    .clamp(true)(val);
  const n = palette.length - 1;
  return d3
    .scaleLinear<string>()
    .domain(palette.map((_, i) => i / n))
    .range(palette)
    .clamp(true)(t);
}

function countryColor(id: string, isPct: boolean) {
  const data = COUNTRIES[id];
  if (!data) return BG;
  if (id === "840") return "#eef2f6";
  return isPct
    ? heat(pct(data[0], data[1]), 0.01, 65, PALETTE_PCT, 0.5)
    : heat(data[0], 50, 7e6, PALETTE_TOTAL, 0.15);
}

function stateColor(name: string, isPct: boolean) {
  const data = US_STATES[name];
  if (!data) return BG;
  return isPct
    ? heat(pct(data[0], data[1]), 0.3, 68, PALETTE_PCT, 0.5)
    : heat(data[0], 2000, 2.2e6, PALETTE_TOTAL, 0.2);
}

function rankItems(
  data: Record<string, [number, number]>,
  mode: Mode,
  names?: Record<string, string>,
) {
  return Object.entries(data)
    .map(([key, [members, population]]) => ({
      n: names ? names[key] || key : key,
      m: members,
      p: population,
      pv: pct(members, population),
    }))
    .sort((a, b) => (mode === "pct" ? b.pv - a.pv : b.m - a.m));
}

function topVal(items: RankedItem[], mode: Mode) {
  return mode === "pct"
    ? Math.max(...items.map((item) => item.pv))
    : items[0]?.m || 1;
}
