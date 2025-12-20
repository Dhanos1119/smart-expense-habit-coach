import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/context/ThemeContext";

export default function ThemePage() {
  const {
    mode,
    setMode,
    colors,
    autoTheme,
    setAutoTheme,
    darkFrom,
    lightFrom,
    setDarkFrom,
    setLightFrom,
  } = useTheme();

  function ThemeOption({
    label,
    value,
  }: {
    label: string;
    value: "dark" | "light" | "system";
  }) {
    const active = mode === value;

    return (
      <TouchableOpacity
        style={[
          styles.optionRow,
          { backgroundColor: active ? colors.card : "transparent" },
        ]}
        onPress={() => setMode(value)}
      >
        <Text style={{ color: colors.text }}>{label}</Text>
        {active && (
          <Ionicons name="checkmark" size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Appearance
      </Text>

      {/* Theme mode */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Theme
        </Text>
        <ThemeOption label="Dark" value="dark" />
        <ThemeOption label="Light" value="light" />
        <ThemeOption label="System" value="system" />
      </View>

      {/* Auto theme */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Auto Theme by Time
          </Text>
          <Switch
            value={autoTheme}
            onValueChange={setAutoTheme}
            trackColor={{ false: "#334155", true: colors.primary }}
          />
        </View>

        {autoTheme && (
          <View style={{ marginTop: 12 }}>
            <TouchableOpacity
              style={styles.timeRow}
              onPress={() => setDarkFrom("19:00")}
            >
              <Text style={{ color: colors.text }}>Dark from</Text>
              <Text style={{ color: colors.primary }}>{darkFrom}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeRow}
              onPress={() => setLightFrom("06:00")}
            >
              <Text style={{ color: colors.text }}>Light from</Text>
              <Text style={{ color: colors.primary }}>{lightFrom}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  section: { borderRadius: 14, padding: 12, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: "#1f2933",
  },
});
