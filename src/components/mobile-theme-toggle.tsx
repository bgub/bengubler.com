"use client";

import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface MobileThemeToggleProps {
  onThemeChange?: () => void;
}

export function MobileThemeToggle({ onThemeChange }: MobileThemeToggleProps) {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    onThemeChange?.();
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleThemeChange("light")}
        className="h-8 px-2"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light theme</span>
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleThemeChange("dark")}
        className="h-8 px-2"
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark theme</span>
      </Button>
      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleThemeChange("system")}
        className="h-8 px-2"
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">System theme</span>
      </Button>
    </div>
  );
}
