"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ComputerIcon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function LightDarkToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  // this lets us avoid the hydration mismatch error
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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
          {theme === "system" ? "System" : theme === "light" ? "Light" : "Dark"}
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
