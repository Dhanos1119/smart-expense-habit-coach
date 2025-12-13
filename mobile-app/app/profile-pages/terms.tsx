import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";

export default function TermsPage() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.text}>
          These are the terms and conditions of using the app...
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071025", padding: 20 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 10 },
  text: { color: "#aaa", fontSize: 16, lineHeight: 22 },
});
