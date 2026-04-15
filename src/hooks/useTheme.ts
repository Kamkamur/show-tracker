import { useState, useEffect, useCallback } from "react";

export type ThemeName = "dark" | "light" | "accent" | "custom";

interface ThemeColors {
  [key: string]: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

const THEMES: Record<Exclude<ThemeName, "custom">, ThemeColors> = {
  dark: {
    background: "222.2 84% 4.9%",
    foreground: "210 40% 98%",
    card: "222.2 84% 6.5%",
    cardForeground: "210 40% 98%",
    primary: "217 91% 60%",
    primaryForeground: "210 40% 98%",
    accent: "217.2 32.6% 17.5%",
    accentForeground: "210 40% 98%",
    muted: "217.2 32.6% 17.5%",
    mutedForeground: "215 20.2% 65.1%",
    border: "217.2 32.6% 17.5%",
  },
  light: {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    card: "0 0% 100%",
    cardForeground: "222.2 84% 4.9%",
    primary: "222.2 47.4% 11.2%",
    primaryForeground: "210 40% 98%",
    accent: "210 40% 96.1%",
    accentForeground: "222.2 47.4% 11.2%",
    muted: "210 40% 96.1%",
    mutedForeground: "215.4 16.3% 46.9%",
    border: "214.3 31.8% 91.4%",
  },
  accent: {
    background: "270 50% 5%",
    foreground: "270 20% 95%",
    card: "270 40% 8%",
    cardForeground: "270 20% 95%",
    primary: "270 70% 60%",
    primaryForeground: "270 20% 98%",
    accent: "270 30% 18%",
    accentForeground: "270 20% 95%",
    muted: "270 30% 15%",
    mutedForeground: "270 15% 60%",
    border: "270 30% 18%",
  },
};

const STORAGE_KEY = "tv-show-manager-theme";

interface StoredTheme {
  name: ThemeName;
  custom?: ThemeColors;
}

function applyColors(colors: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty("--background", colors.background);
  root.style.setProperty("--foreground", colors.foreground);
  root.style.setProperty("--card", colors.card);
  root.style.setProperty("--card-foreground", colors.cardForeground);
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--primary-foreground", colors.primaryForeground);
  root.style.setProperty("--accent", colors.accent);
  root.style.setProperty("--accent-foreground", colors.accentForeground);
  root.style.setProperty("--muted", colors.muted);
  root.style.setProperty("--muted-foreground", colors.mutedForeground);
  root.style.setProperty("--border", colors.border);
  root.style.setProperty("--input", colors.border);
  root.style.setProperty("--ring", colors.primary);
  root.style.setProperty("--popover", colors.card);
  root.style.setProperty("--popover-foreground", colors.cardForeground);
  root.style.setProperty("--secondary", colors.muted);
  root.style.setProperty("--secondary-foreground", colors.foreground);
  root.style.setProperty("--destructive", "0 84.2% 60.2%");
  root.style.setProperty("--destructive-foreground", "210 40% 98%");
}

function loadStored(): StoredTheme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { name: "dark" };
  } catch {
    return { name: "dark" };
  }
}

export function useTheme() {
  const [stored, setStored] = useState<StoredTheme>(loadStored);

  const currentColors = stored.name === "custom" && stored.custom ? stored.custom : THEMES[stored.name as Exclude<ThemeName, "custom">] ?? THEMES.dark;

  useEffect(() => {
    applyColors(currentColors);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }, [stored, currentColors]);

  const setTheme = useCallback((name: ThemeName) => {
    setStored((prev) => ({ ...prev, name }));
  }, []);

  const setCustomColor = useCallback((key: keyof ThemeColors, value: string) => {
    setStored((prev) => {
      const base = prev.custom ?? THEMES.dark;
      return { name: "custom", custom: { ...base, [key]: value } };
    });
  }, []);

  return { themeName: stored.name, currentColors, setTheme, setCustomColor };
}
