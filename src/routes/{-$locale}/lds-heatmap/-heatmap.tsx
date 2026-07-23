import { useCallback, useMemo, useState } from "@bgub/fig";
import { on } from "@bgub/fig-dom";
import * as d3 from "d3";
import { msg, Num, T, useGT, useMessages, Var } from "gt-fig-tanstack-start";
import {
  CA_PROVINCES,
  COUNTRIES,
  COUNTRY_NAMES,
  FIPS_TO_STATE,
  fmt,
  pct,
  type TipData,
  US_STATES,
} from "./-data";
import { type DecodedTopology, decodeTopo, type Topology } from "./-topojson";

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
const projection = d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" });
const geoPath = d3.geoPath().projection(projection);
const spherePath = geoPath({ type: "Sphere" }) || "";
const graticulePath = geoPath(d3.geoGraticule10()) || "";

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
  const svgRef = useMemo<{ current: SVGSVGElement | null }>(
    () => ({ current: null }),
    [],
  );
  const zoomBehaviorRef = useMemo<{
    current: d3.ZoomBehavior<SVGSVGElement, unknown> | null;
  }>(() => ({ current: null }), []);
  const boxRef = useMemo<{ current: HTMLDivElement | null }>(
    () => ({ current: null }),
    [],
  );
  const tooltipRef = useMemo<{ current: HTMLDivElement | null }>(
    () => ({ current: null }),
    [],
  );
  const mouseRef = useMemo(() => ({ current: { x: 0, y: 0 } }), []);
  const [tip, setTip] = useState<TipData | null>(null);
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

  const setSvgNode = useCallback(
    (node: SVGSVGElement) => {
      if (svgRef.current) {
        d3.select(svgRef.current).on(".zoom", null);
      }

      svgRef.current = node;
      zoomBehaviorRef.current = null;

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
    },
    [svgRef, zoomBehaviorRef],
  );

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
      bind={(element) => {
        boxRef.current = element;
        return undefined;
      }}
      role="application"
      mix={on("mousemove", (event) => {
        const rect = boxRef.current?.getBoundingClientRect();
        if (rect) {
          const mouse = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          };
          mouseRef.current = mouse;

          if (tooltipRef.current) {
            const { left, top } = getTooltipPosition(
              mouse,
              boxRef.current?.clientWidth ?? 800,
            );
            tooltipRef.current.style.left = `${left}px`;
            tooltipRef.current.style.top = `${top}px`;
          }
        }
      })}
      class="relative flex flex-col overflow-hidden select-none"
      style={{
        background: "#f8f9fb",
        color: "#1a1a2e",
        height: "calc(100vh - 64px)",
      }}
    >
      <HeatmapHeader mode={mode} onModeChange={setMode} onFly={fly} />
      <div class="flex flex-1 min-h-0">
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
      {tip && (
        <HeatmapTooltip
          tip={tip}
          mouse={mouseRef.current}
          boxWidth={boxRef.current?.clientWidth ?? 800}
          tooltipRef={tooltipRef}
        />
      )}
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
      class="flex flex-wrap items-end justify-between gap-2"
      style={{ padding: "12px 18px 8px", borderBottom: "1px solid #e5e8ed" }}
    >
      <div>
        <div
          class="font-mono uppercase"
          style={{ fontSize: "12px", letterSpacing: "0.5px", color: "#888" }}
        >
          <T>Membership Heat Map &middot; 2024</T>
        </div>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "400",
            margin: "2px 0 0",
            color: "#1a1a2e",
          }}
        >
          <T>
            Latter-day Saints{" "}
            <span
              style={{ fontWeight: "400", color: "#888", fontSize: "15px" }}
            >
              Worldwide
            </span>
          </T>
        </h1>
      </div>
      <div class="flex flex-wrap items-center gap-1 pb-0.5">
        <div
          class="flex mr-2"
          style={{ background: "#eef1f5", borderRadius: "6px", padding: "2px" }}
        >
          {MODE_LABELS.map(([key, label]) => (
            <button
              type="button"
              key={key}
              mix={on("click", () => onModeChange(key))}
              class="rounded-[5px] border-0 px-3 py-1 font-mono text-xs cursor-pointer transition-[background,color,box-shadow] duration-150"
              style={{
                background: mode === key ? "#fff" : "transparent",
                color: mode === key ? "#1a1a2e" : "#999",
                fontWeight: "400",
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
            mix={on("click", () => onFly(x, y, scale))}
            class="rounded border border-[#dde1e7] bg-white px-2.25 py-0.75 font-mono text-xs text-[#666] cursor-pointer"
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
  onSvgMount: (node: SVGSVGElement) => void;
  onTipChange: (tip: TipData | null) => void;
}) {
  const gt = useGT();
  const isPct = mode === "pct";
  const strokeWidth = Math.max(0.06, 0.25 / Math.sqrt(zoom));
  const stateStrokeWidth = Math.max(0.04, 0.18 / Math.sqrt(zoom));

  return (
    <div
      class="relative flex-1 overflow-hidden"
      style={{ background: "#eef2f6" }}
    >
      <svg
        bind={(element) => {
          onSvgMount(element);
          return undefined;
        }}
        viewBox={`0 0 ${W} ${H}`}
        class="w-full h-full cursor-grab"
        aria-label={gt("LDS membership heat map")}
      >
        <rect width={String(W)} height={String(H)} fill="#eef2f6" />
        <g id="g">
          <path
            d={spherePath}
            fill="#f8f9fb"
            stroke="#dde1e7"
            stroke-width="0.5"
          />
          <path
            d={graticulePath}
            fill="none"
            stroke="#e8ecf0"
            stroke-width="0.3"
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
                d={geoPath(feature) || ""}
                fill={id ? countryColor(id, isPct) : BG}
                stroke={id && COUNTRIES[id] ? "#c0c8d4" : "#dde1e7"}
                stroke-width={String(strokeWidth)}
                class="cursor-pointer"
                mix={[
                  on("mouseenter", () => {
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
                  }),
                  on("mouseleave", () => onTipChange(null)),
                ]}
              />
            );
          })}
          {us.features.map((feature) => {
            const fips = String(feature.id).padStart(2, "0");
            const name = FIPS_TO_STATE[fips];
            if (!name) return null;

            const path = geoPath(feature);
            if (!path) return null;

            return (
              // biome-ignore lint/a11y/noStaticElementInteractions: SVG path used for tooltip hover
              <path
                key={`s${fips}`}
                d={path}
                fill={stateColor(name, isPct)}
                stroke="#c0c8d4"
                stroke-width={String(stateStrokeWidth)}
                class="cursor-pointer"
                mix={[
                  on("mouseenter", () => {
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
                  }),
                  on("mouseleave", () => onTipChange(null)),
                ]}
              />
            );
          })}
        </g>
      </svg>
      <MapLegend isPct={isPct} />
      <ZoomBadge zoom={zoom} />
    </div>
  );
}

function MapLegend({ isPct }: { isPct: boolean }) {
  const gt = useGT();
  const palette = isPct ? PALETTE_PCT : PALETTE_TOTAL;

  return (
    <div
      class="absolute bottom-2.5 left-2.5 flex items-center gap-1.5"
      style={{
        background: "rgba(255,255,255,0.92)",
        padding: "5px 10px",
        borderRadius: "6px",
        border: "1px solid #dde1e7",
        backdropFilter: "blur(6px)",
      }}
    >
      <span class="font-mono" style={{ fontSize: "12px", color: "#999" }}>
        {isPct ? "0%" : gt("FEW")}
      </span>
      <div
        style={{
          width: "80px",
          height: "7px",
          borderRadius: "3px",
          background: `linear-gradient(90deg,${palette.join(",")})`,
        }}
      />
      <span class="font-mono" style={{ fontSize: "12px", color: "#999" }}>
        {isPct ? "65%+" : gt("MILLIONS")}
      </span>
    </div>
  );
}

function ZoomBadge({ zoom }: { zoom: number }) {
  return (
    <div
      class="absolute bottom-2.5 right-2.5 font-mono"
      style={{
        background: "rgba(255,255,255,0.92)",
        padding: "3px 8px",
        borderRadius: "4px",
        border: "1px solid #dde1e7",
        fontSize: "12px",
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
      class="shrink-0 overflow-y-auto"
      style={{
        width: "225px",
        padding: "6px 14px 14px 10px",
        borderLeft: "1px solid #e5e8ed",
        background: "#fff",
      }}
    >
      <Rank title={gt("Countries")} items={ranked} mode={mode} />
      <Rank title={gt("US States")} items={stateRanked} mode={mode} hasBorder />
      <Rank
        title={gt("Canadian Provinces")}
        items={caRanked}
        mode={mode}
        hasBorder
      />
      <div
        class="font-mono"
        style={{
          marginTop: "12px",
          fontSize: "12px",
          color: "#bbb",
          lineHeight: "1.5",
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
  boxWidth,
  tooltipRef,
}: {
  tip: TipData;
  mouse: { x: number; y: number };
  boxWidth: number;
  tooltipRef: { current: HTMLDivElement | null };
}) {
  const { left, top } = getTooltipPosition(mouse, boxWidth);

  return (
    <div
      bind={(element) => {
        tooltipRef.current = element;
        return undefined;
      }}
      class="absolute pointer-events-none z-30 min-w-30 rounded-lg border border-[#dde1e7] bg-white px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
      style={{ left: `${left}px`, top: `${top}px` }}
    >
      <div style={{ fontWeight: "700", fontSize: "12px", color: "#1a1a2e" }}>
        {tip.name}
      </div>
      {tip.m ? (
        <>
          <T>
            <div
              class="font-mono"
              style={{ fontSize: "12px", color: "#2d7fc0" }}
            >
              <Num>{tip.m}</Num> members
            </div>
          </T>
          <T>
            <div class="font-mono" style={{ fontSize: "12px", color: "#666" }}>
              <Var>{tip.pv?.toFixed(2)}</Var>% of population
            </div>
          </T>
          {tip.state && (
            <T>
              <div
                style={{ fontSize: "12px", color: "#bbb", marginTop: "1px" }}
              >
                U.S. State
              </div>
            </T>
          )}
        </>
      ) : (
        <T>
          <div style={{ fontSize: "12px", color: "#bbb" }}>
            No reported presence
          </div>
        </T>
      )}
    </div>
  );
}

function getTooltipPosition(mouse: { x: number; y: number }, boxWidth: number) {
  return {
    left: Math.min(mouse.x + 14, boxWidth - 195),
    top: Math.max(mouse.y - 55, 10),
  };
}

function Rank({
  title,
  items,
  mode,
  hasBorder,
}: {
  title: string;
  items: RankedItem[];
  mode: Mode;
  hasBorder?: boolean;
}) {
  const max =
    mode === "pct"
      ? Math.max(...items.map((item) => item.pv))
      : items[0]?.m || 1;

  return (
    <div
      style={
        hasBorder
          ? {
              marginTop: "10px",
              borderTop: "1px solid #eef1f5",
              paddingTop: "8px",
            }
          : undefined
      }
    >
      <div
        class="font-mono uppercase"
        style={{
          fontSize: "12px",
          letterSpacing: "0.5px",
          color: "#aaa",
          marginBottom: "6px",
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
            class="flex items-center gap-1.5"
            style={{ padding: "2.5px 0" }}
          >
            <span
              class="font-mono text-right"
              style={{
                fontSize: "12px",
                color: index < 3 ? "#1d4e89" : "#ccc",
                width: "14px",
                fontWeight: "400",
              }}
            >
              {index + 1}
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between" style={{ marginBottom: "1px" }}>
                <span
                  class="overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    color: index < 3 ? "#1a1a2e" : "#666",
                    fontSize: "12px",
                  }}
                >
                  {item.n}
                </span>
                <span
                  class="font-mono whitespace-nowrap"
                  style={{
                    fontSize: "12px",
                    color: "#1d4e89",
                    marginLeft: "3px",
                  }}
                >
                  {mode === "pct" ? `${item.pv.toFixed(1)}%` : fmt(item.m)}
                </span>
              </div>
              <div
                class="overflow-hidden"
                style={{
                  height: "2.5px",
                  background: "#f0f2f5",
                  borderRadius: "2px",
                }}
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
                    borderRadius: "2px",
                    opacity: index < 3 ? "1" : "0.6",
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

function createHeatScale(
  lo: number,
  hi: number,
  palette: string[],
  exp: number,
) {
  const valueScale = d3
    .scalePow()
    .exponent(exp)
    .domain([lo, hi])
    .range([0, 1])
    .clamp(true);
  const n = palette.length - 1;
  const colorScale = d3
    .scaleLinear<string>()
    .domain(palette.map((_, i) => i / n))
    .range(palette)
    .clamp(true);

  return (value: number) => (value ? colorScale(valueScale(value)) : BG);
}

const countryPctColor = createHeatScale(0.01, 65, PALETTE_PCT, 0.5);
const countryTotalColor = createHeatScale(50, 7e6, PALETTE_TOTAL, 0.15);
const statePctColor = createHeatScale(0.3, 68, PALETTE_PCT, 0.5);
const stateTotalColor = createHeatScale(2000, 2.2e6, PALETTE_TOTAL, 0.2);

function countryColor(id: string, isPct: boolean) {
  const data = COUNTRIES[id];
  if (!data) return BG;
  if (id === "840") return "#eef2f6";
  return isPct
    ? countryPctColor(pct(data[0], data[1]))
    : countryTotalColor(data[0]);
}

function stateColor(name: string, isPct: boolean) {
  const data = US_STATES[name];
  if (!data) return BG;
  return isPct
    ? statePctColor(pct(data[0], data[1]))
    : stateTotalColor(data[0]);
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
      pv: pct(members, population),
    }))
    .sort((a, b) => (mode === "pct" ? b.pv - a.pv : b.m - a.m));
}

type RankedItem = ReturnType<typeof rankItems>[number];
