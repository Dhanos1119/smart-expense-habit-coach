import { SafeAreaView, Text, StyleSheet } from "react-native";

export default function ThemePage() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Theme Settings</Text>
      <Text style={styles.text}>Theme options coming soon.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071025", padding: 20 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  text: { color: "#aaa", fontSize: 16 },
});
