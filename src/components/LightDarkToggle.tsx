"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ComputerIcon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function LightDarkToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn("mt-auto justify-start px-4", className)}
        >
          <SunIcon className="mr-2 h-4 w-4 dark:hidden" />
          <MoonIcon className="mr-2 h-4 w-4 hidden dark:block" />
          Change Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dropdown-content-width-full">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mx-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonIcon className="mx-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <ComputerIcon className="mx-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
