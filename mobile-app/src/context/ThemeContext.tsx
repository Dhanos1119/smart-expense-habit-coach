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
  background: "#020617",
  card: "#020617",
  text: "#E5E7EB",
  subText: "#94A3B8",
  border: "#1E293B",

  primary: "#60A5FA",
  success: "#34D399",
  warning: "#FACC15",
  danger: "#F87171",
};

const LightColors = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  text: "#0F172A",
  subText: "#475569",
  border: "#E2E8F0",

  primary: "#2563EB",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
};


type ThemeContextType = {
  mode: ThemeMode;
  colors: typeof DarkColors;
  setMode: (m: ThemeMode) => void;

  autoTheme: boolean;
  setAutoTheme: (v: boolean) => void;

  darkFrom: string;
  lightFrom: string;
  setDarkFrom: (t: string) => void;
  setLightFrom: (t: string) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

/* ================= TIME LOGIC ================= */

function isNowInDarkTime(darkFrom: string, lightFrom: string) {
  const now = new Date();

  const toMinutes = (t: string) => {
    const [time, ap] = t.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (ap === "PM" && h !== 12) h += 12;
    if (ap === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const darkMin = toMinutes(darkFrom);
  const lightMin = toMinutes(lightFrom);

  if (darkMin < lightMin) {
    return nowMin >= darkMin && nowMin < lightMin;
  } else {
    return nowMin >= darkMin || nowMin < lightMin;
  }
}

/* ================= PROVIDER ================= */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = Appearance.getColorScheme();

  const [mode, setModeState] = useState<ThemeMode>("dark"); // ✅ default dark
  const [autoTheme, setAutoThemeState] = useState(false);
  const [darkFrom, setDarkFromState] = useState("7:00 PM");
  const [lightFrom, setLightFromState] = useState("6:00 AM");

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
    if (!autoTheme) return;

    const apply = () => {
      const shouldDark = isNowInDarkTime(darkFrom, lightFrom);
      setModeState(shouldDark ? "dark" : "light");
    };

    apply();
    const sub = AppState.addEventListener("change", apply);
    return () => sub.remove();
  }, [autoTheme, darkFrom, lightFrom]);

  function setMode(m: ThemeMode) {
  setModeState(m);
  setAutoThemeState(false); // 🔥 IMPORTANT
  AsyncStorage.setItem("themeMode", m);
  AsyncStorage.setItem("autoTheme", "false");
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
