// app/(tabs)/dummy.tsx
import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function DummyProfile() {
  const router = useRouter();

  useEffect(() => {
    // profile panel open pannum
    router.push("/profile");
  }, []);

  return <View style={{ flex: 1, backgroundColor: "#020617" }} />;
}
