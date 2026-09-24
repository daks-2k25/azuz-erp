"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyUiTheme,
  persistUiTheme,
  readStoredUiTheme,
  type ThemeMode,
  type ThemePalette,
} from "@/lib/theme-utils";

interface ThemeContextValue {
  mode: ThemeMode;
  palette: ThemePalette;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePalette) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [palette, setPaletteState] = useState<ThemePalette>("emerald");

  useEffect(() => {
    const stored = readStoredUiTheme();
    setModeState(stored.mode);
    setPaletteState(stored.palette);
    applyUiTheme(stored);
  }, []);

  const setMode = useCallback(
    (nextMode: ThemeMode) => {
      setModeState(nextMode);
      const next = { mode: nextMode, palette };
      persistUiTheme(next);
      applyUiTheme(next);
    },
    [palette],
  );

  const setPalette = useCallback(
    (nextPalette: ThemePalette) => {
      setPaletteState(nextPalette);
      const next = { mode, palette: nextPalette };
      persistUiTheme(next);
      applyUiTheme(next);
    },
    [mode],
  );

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const value = useMemo(
    () => ({
      mode,
      palette,
      setMode,
      setPalette,
      toggleMode,
    }),
    [mode, palette, setMode, setPalette, toggleMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
