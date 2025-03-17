/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";
import type { DaisyUiThemes } from "../types";

type ThemeContextType = {
  currentTheme: DaisyUiThemes;
  setCurrentTheme: React.Dispatch<React.SetStateAction<DaisyUiThemes>>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

type ThemeContextProviderProps = {
  children: React.ReactNode;
};

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<DaisyUiThemes>(() => {
    return getThemeValue();
  });

  useEffect(() => {
    localStorage.setItem("local-theme", currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext error");
  }

  return context;
}

export function getThemeValue() {
  const value = window?.localStorage.getItem("local-theme");

  if (value === undefined || value === null) {
    return "dark" as DaisyUiThemes;
  }

  return value as DaisyUiThemes;
}
