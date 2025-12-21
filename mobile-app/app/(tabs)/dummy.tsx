// app/(tabs)/dummy.tsx
import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/context/ThemeContext";

export default function DummyProfile() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    router.push("/profile");
  }, []);

  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}
