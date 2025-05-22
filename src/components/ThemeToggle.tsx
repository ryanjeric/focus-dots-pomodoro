import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ThemeToggleProps {
  initialTheme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
}

const ThemeToggle = ({
  initialTheme = "light",
  onThemeChange,
}: ThemeToggleProps) => {
  const [isDarkMode, setIsDarkMode] = useState(initialTheme === "dark");

  useEffect(() => {
    // Apply theme to document when component mounts or theme changes
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.classList.toggle("dark", isDarkMode);

    if (onThemeChange) {
      onThemeChange(theme);
    }
  }, [isDarkMode, onThemeChange]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex items-center gap-2 bg-background p-2 rounded-full shadow-sm">
      <Sun
        className={`h-4 w-4 ${isDarkMode ? "text-muted-foreground" : "text-amber-500"}`}
      />
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      />
      <Moon
        className={`h-4 w-4 ${isDarkMode ? "text-blue-400" : "text-muted-foreground"}`}
      />
    </div>
  );
};

export default ThemeToggle;
