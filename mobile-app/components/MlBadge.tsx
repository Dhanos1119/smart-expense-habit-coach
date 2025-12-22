import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  type: "STRONG" | "UNSTABLE" | "AT_RISK";
};

export default function MlBadge({ type }: Props) {
  const config = {
    STRONG: {
      label: "STRONG",
      bg: "#DCFCE7",
      color: "#166534",
    },
    UNSTABLE: {
      label: "UNSTABLE",
      bg: "#FEF3C7",
      color: "#92400E",
    },
    AT_RISK: {
      label: "AT RISK",
      bg: "#FEE2E2",
      color: "#991B1B",
    },
  }[type];

  if (!config) return null;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
