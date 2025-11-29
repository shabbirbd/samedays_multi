"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setThemeState(query.matches ? "dark" : "light");

    // Initialize
    updateTheme();
    // Watch for system theme changes
    query.addEventListener("change", updateTheme);
    return () => query.removeEventListener("change", updateTheme);
  }, []);

  // Keep the <html> class in sync so Tailwind's `dark:*` works
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Optional: allow manual override (you can expand this later)
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeProvider = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeProvider must be used inside a ThemeProvider");
  }
  return context;
};
