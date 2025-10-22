"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe2 } from "lucide-react";
import { useMemo } from "react";
import { useLocaleSelector } from "gt-next/client";

type LocaleOrbitProps = {
  className?: string;
  size?: number;
};

// Desktop-only orbit language selector with a globe in the center and
// locale buttons positioned around a circle. Uses gt-next hooks to switch
// locales client-side.
export function LocaleOrbit({ className, size = 128 }: LocaleOrbitProps) {
  const { locale, locales, setLocale } = useLocaleSelector();

  // Place buttons slightly OUTSIDE the edge ring so they sit on the perimeter
  // as if orbiting it. We offset by 10px beyond the visual ring radius.
  const edgeRadius = size / 2; // visual ring radius
  const radius = edgeRadius - 6;

  const positions = useMemo(() => {
    if (!locales || locales.length === 0) return [] as Array<{
      code: string;
      left: number;
      top: number;
    }>;
    const step = (2 * Math.PI) / locales.length;
    const center = size / 2;
    return locales.map((code, index) => {
      const angle = index * step - Math.PI / 2; // start at top
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { code, left: x, top: y };
    });
  }, [locales, radius, size]);

  if (!locales?.length) return null;

  return (
    <div
      className={cn(
        "relative select-none",
        "rounded-full",
        className
      )}
      style={{ width: size, height: size }}
      aria-label="Language selector"
    >
      {/* Orbit guide ring */}
      <div
        className="absolute inset-0 rounded-full border border-border"
        aria-hidden
      />

      {/* Center globe button */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <div className="flex items-center justify-center size-12 rounded-full">
          <Globe2 className="size-8 text-muted-foreground" />
        </div>
      </div>

      {/* Locale buttons */}
      {positions.map(({ code, left, top }) => {
        const active = code === locale;
        return (
          <Button
            key={code}
            size="sm"
            variant={active ? "default" : "outline"}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 h-8",
              active
                ? "shadow-xs"
                : "bg-background/80 backdrop-blur border-border/60"
            )}
            style={{ left, top }}
            onClick={() => setLocale(code)}
            aria-pressed={active}
            aria-label={`Switch language to ${code}`}
          >
            {code.toUpperCase()}
          </Button>
        );
      })}
    </div>
  );
}

export default LocaleOrbit;


