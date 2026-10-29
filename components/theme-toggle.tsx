"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { currentTheme, toggleTheme, type Theme } from "@/lib/client-events";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  // Rendered as "light" on the server; corrected after mount from the attribute the init script set.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(currentTheme());
    const onChange = (event: Event) => setThemeState((event as CustomEvent<Theme>).detail);
    window.addEventListener("portfolio:theme", onChange);
    return () => window.removeEventListener("portfolio:theme", onChange);
  }, []);

  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "focus-ring", className)}
    >
      {theme === "dark" ? <Sun aria-hidden="true" className="h-4 w-4" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
    </button>
  );
}
