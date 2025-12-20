import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Appearance, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "dark" | "light" | "system";

const DarkColors = {
  background: "#0B1020",
  card: "#111827",
  text: "#ffffff",
  muted: "#94a3b8",
  primary: "#22c55e",
};

const LightColors = {
  background: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
  primary: "#16a34a",
};

type ThemeContextType = {
  mode: ThemeMode;
  colors: typeof DarkColors;
  setMode: (m: ThemeMode) => void;

  autoTheme: boolean;
  setAutoTheme: (v: boolean) => void;

  darkFrom: string;   // "19:00"
  lightFrom: string;  // "06:00"
  setDarkFrom: (t: string) => void;
  setLightFrom: (t: string) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function isNowInDarkTime(darkFrom: string, lightFrom: string) {
  const now = new Date();
  const [dh, dm] = darkFrom.split(":").map(Number);
  const [lh, lm] = lightFrom.split(":").map(Number);

  const darkTime = new Date();
  darkTime.setHours(dh, dm, 0);

  const lightTime = new Date();
  lightTime.setHours(lh, lm, 0);

  if (darkTime < lightTime) {
    return now >= darkTime && now < lightTime;
  } else {
    return now >= darkTime || now < lightTime;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = Appearance.getColorScheme();

  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [autoTheme, setAutoThemeState] = useState(false);
  const [darkFrom, setDarkFromState] = useState("19:00");
  const [lightFrom, setLightFromState] = useState("06:00");

  useEffect(() => {
    (async () => {
      const storedMode = await AsyncStorage.getItem("themeMode");
      const storedAuto = await AsyncStorage.getItem("autoTheme");
      const df = await AsyncStorage.getItem("darkFrom");
      const lf = await AsyncStorage.getItem("lightFrom");

      if (storedMode) setModeState(storedMode as ThemeMode);
      if (storedAuto) setAutoThemeState(storedAuto === "true");
      if (df) setDarkFromState(df);
      if (lf) setLightFromState(lf);
    })();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", () => {
      applyAutoTheme();
    });
    applyAutoTheme();
    return () => sub.remove();
  }, [autoTheme, darkFrom, lightFrom]);

  function applyAutoTheme() {
    if (!autoTheme) return;

    const shouldDark = isNowInDarkTime(darkFrom, lightFrom);
    setModeState(shouldDark ? "dark" : "light");
  }

  function setMode(m: ThemeMode) {
    setModeState(m);
    AsyncStorage.setItem("themeMode", m);
  }

  function setAutoTheme(v: boolean) {
    setAutoThemeState(v);
    AsyncStorage.setItem("autoTheme", String(v));
  }

  function setDarkFrom(t: string) {
    setDarkFromState(t);
    AsyncStorage.setItem("darkFrom", t);
  }

  function setLightFrom(t: string) {
    setLightFromState(t);
    AsyncStorage.setItem("lightFrom", t);
  }

  const effectiveMode =
    mode === "system" ? systemScheme ?? "dark" : mode;

  const colors =
    effectiveMode === "dark" ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colors,
        setMode,
        autoTheme,
        setAutoTheme,
        darkFrom,
        lightFrom,
        setDarkFrom,
        setLightFrom,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
