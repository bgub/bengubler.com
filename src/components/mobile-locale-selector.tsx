"use client";

import { useLocaleSelector } from "gt-next/client";
import { Check, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type MobileLocaleSelectorProps = {
  className?: string;
  mode?: "default" | "compact"; // compact: icon-only trigger
};

// Compact dropdown for mobile using shadcn menu components.
export function MobileLocaleSelector({
  className,
  mode = "default",
}: MobileLocaleSelectorProps) {
  const { locale, locales, setLocale, getLocaleProperties } =
    useLocaleSelector();

  if (!locales?.length) return null;

  const active = getLocaleProperties(locale || locales[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {mode === "compact" ? (
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-8 px-2", className)}
            aria-label="Change language"
          >
            <Languages className="h-4 w-4" />
            <span className="sr-only">
              {active?.nativeNameWithRegionCode || active?.regionCode || locale}
            </span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className={cn("justify-between gap-2 h-9", className)}
            aria-label="Change language"
          >
            <Languages className="h-4 w-4" />
            <span className="font-medium tracking-wide">
              {active?.regionCode?.toUpperCase?.() ||
                (locale ?? "").toUpperCase()}
            </span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {locales.map((code) => {
          const props = getLocaleProperties(code);
          const isActive = code === locale;
          return (
            <DropdownMenuItem
              key={code}
              onSelect={() => setLocale(code)}
              className="justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs px-1.5 py-0.5 rounded border text-foreground/80">
                  {props.regionCode?.toUpperCase?.() || code.toUpperCase()}
                </span>
                <span className="truncate">
                  {props.nativeNameWithRegionCode || code}
                </span>
              </div>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MobileLocaleSelector;
