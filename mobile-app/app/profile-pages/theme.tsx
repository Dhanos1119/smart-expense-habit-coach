import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ScrollView,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../src/context/ThemeContext";

/* ================= UTILS ================= */

function formatTime(date: Date) {
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function toDate(time: string) {
  const [t, ap] = time.split(" ");
  let [h, m] = t.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  const d = new Date();
  d.setHours(h, m, 0);
  return d;
}

/* ================= PAGE ================= */

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

  const [picker, setPicker] = useState<"dark" | "light" | null>(null);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>
          Appearance
        </Text>

        {/* ===== THEME PREVIEW ===== */}
        <Text style={[styles.sectionLabel, { color: colors.text }]}>
          Theme
        </Text>

        <View style={styles.previewRow}>
          <ThemePreview
            label="Dark"
            active={mode === "dark"}
            onPress={() => setMode("dark")}
            bg="#020617"
            card="#071025"
            text="#fff"
          />

          <ThemePreview
            label="Light"
            active={mode === "light"}
            onPress={() => setMode("light")}
            bg="#f8fafc"
            card="#ffffff"
            text="#020617"
          />
        </View>

        {/* ===== AUTO THEME ===== */}
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.text, marginTop: 22 },
          ]}
        >
          Automatic
        </Text>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.rowBetween}>
            <Text style={{ color: colors.text, fontSize: 16 }}>
              Auto Theme by Time
            </Text>
            <Switch
              value={autoTheme}
              onValueChange={setAutoTheme}
              trackColor={{ false: "#94a3b8", true: colors.primary }}
            />
          </View>

          {autoTheme && (
            <>
              <TimeRow
                label="Dark from"
                value={darkFrom}
                onPress={() => setPicker("dark")}
                colors={colors}
              />

              <TimeRow
                label="Light from"
                value={lightFrom}
                onPress={() => setPicker("light")}
                colors={colors}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* ===== TIME PICKER MODAL ===== */}
      {picker && (
        <Modal transparent animationType="fade">
          <Pressable
            style={styles.backdrop}
            onPress={() => setPicker(null)}
          />

          <View
            style={[
              styles.pickerSheet,
              { backgroundColor: colors.card },
            ]}
          >
            <DateTimePicker
  value={toDate(picker === "dark" ? darkFrom : lightFrom)}
  mode="time"
  display="spinner"
  is24Hour={false}
  themeVariant={mode === "light" ? "light" : "dark"}  // 🔥 FIX
  onChange={(event, date) => {
    if (!date) return;

    const t = formatTime(date);
    picker === "dark" ? setDarkFrom(t) : setLightFrom(t);

    if (Platform.OS === "android") {
      setPicker(null);
    }
  }}
/>


            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => setPicker(null)}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "600",
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

function ThemePreview({
  label,
  active,
  onPress,
  bg,
  card,
  text,
}: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.previewCard,
        {
          backgroundColor: bg,
          borderColor: active ? "#22c55e" : "transparent",
        },
      ]}
    >
      <View
        style={[styles.fakeHeader, { backgroundColor: card }]}
      />
      <View style={styles.fakeBubble} />
      <View style={styles.fakeBubbleSmall} />

      <Text style={[styles.previewLabel, { color: text }]}>
        {label}
      </Text>

      {active && (
        <View style={styles.check}>
          <Ionicons
            name="checkmark"
            size={16}
            color="#fff"
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

function TimeRow({ label, value, onPress, colors }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.timeRow,
        {
          backgroundColor: colors.card,
          borderColor: colors.muted + "33",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={{ color: colors.text }}>{label}</Text>
      <Text
        style={{ color: colors.primary, fontWeight: "600" }}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

title: {
  fontSize: 28,
  fontWeight: "700",
  marginTop: 22,     // 🔥 add this
  marginBottom: 32, // 🔥 increase spacing below
},


sectionLabel: {
  fontSize: 13,
  opacity: 0.7,
  marginTop: 8,      // 🔥 new
  marginBottom: 28, // 🔥 more space
},


previewRow: {
  flexDirection: "row",
  gap: 14,
  marginBottom: 24, // 🔥 space before “Automatic”
},


  previewCard: {
    flex: 1,
    height: 160, // 🔥 compact height
    borderRadius: 18,
    padding: 12,
    justifyContent: "flex-end",
    borderWidth: 2,
  },

  fakeHeader: {
    height: 14,
    borderRadius: 6,
    marginBottom: 6,
  },

  fakeBubble: {
    height: 12,
    width: "70%",
    borderRadius: 8,
    backgroundColor: "#22c55e",
    marginBottom: 5,
  },

  fakeBubbleSmall: {
    height: 10,
    width: "50%",
    borderRadius: 8,
    backgroundColor: "#334155",
    opacity: 0.6,
  },

  previewLabel: {
    marginTop: 8,
    fontWeight: "600",
  },

  check: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },

section: {
  borderRadius: 16,
  paddingVertical: 16, // 🔥 more vertical breathing
  paddingHorizontal: 14,
  marginTop: 8,
},


  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  pickerSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },

  doneBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
