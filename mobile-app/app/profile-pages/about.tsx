import { SafeAreaView, Text, StyleSheet } from "react-native";
import { useTheme } from "../../src/context/ThemeContext";


export default function AboutPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>About This App</Text>
      <Text style={styles.text}>
        This app helps you track expenses, habits, and improve your financial discipline.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071025", padding: 20 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  text: { color: "#aaa", fontSize: 16 },
});
