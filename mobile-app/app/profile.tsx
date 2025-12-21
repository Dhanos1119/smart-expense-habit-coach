import React, { useEffect, useRef, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import api from "../src/api/api";
import { AuthContext } from "../src/context/AuthContext";
import { API_BASE } from "../src/constants/api";
import { useTheme } from "../src/context/ThemeContext";

const { width: SCREEN_W } = Dimensions.get("window");
const PANEL_WIDTH = Math.round(SCREEN_W * 0.75);
const TAB_BAR_HEIGHT = 70;

export default function ProfilePanel() {
  const router = useRouter();
  const { token, loading: authLoading, logout } = useContext(AuthContext);
  const { colors } = useTheme(); // ✅ CORRECT PLACE

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  const closingRef = useRef(false);
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    let alive = true;

    const fetchProfile = async () => {
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await api.get("/api/me");
        if (!alive) return;

        const user = res.data?.user || {};
        setProfile(user);
        setLocalAvatarUri(
          user.avatarUrl ? `${API_BASE}${user.avatarUrl}` : null
        );
      } catch (e) {
        console.log("PROFILE ERROR", e);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      alive = false;
    };
  }, [token]);

  /* ---------------- OPEN ANIMATION ---------------- */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        speed: 18,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* ---------------- PICK IMAGE ---------------- */
  const pickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setLocalAvatarUri(uri);

    const form = new FormData();
    form.append("avatar", {
      uri,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any);

    await api.post("/profile/upload-avatar", form);
  };

  if (loading || authLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.full, { backgroundColor: colors.background }]}>
      {/* OVERLAY */}
      <Animated.View
        pointerEvents="auto"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "#000", opacity: overlayOpacity },
        ]}
      />

      {/* PANEL */}
      <Animated.View
        style={[
          styles.panel,
          {
            backgroundColor: colors.card,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
            {localAvatarUri ? (
              <Image source={{ uri: localAvatarUri }} style={styles.avatar} />
            ) : (
              <Ionicons name="person" size={48} color={colors.text} />
            )}
          </TouchableOpacity>

          <Text style={[styles.name, { color: colors.text }]}>
            {profile?.name || "User"}
          </Text>
          <Text style={{ color: colors.subText }}>
            {profile?.email || "---"}
          </Text>
        </View>

        <View style={styles.section}>
  {/* THEME */}
  <TouchableOpacity
    style={styles.row}
    onPress={() => router.push("/profile-pages/theme")}
  >
    <Ionicons name="moon-outline" size={22} color={colors.text} />
    <Text style={[styles.rowText, { color: colors.text }]}>
      Theme
    </Text>
  </TouchableOpacity>

  {/* TERMS */}
  <TouchableOpacity
    style={styles.row}
    onPress={() => router.push("/profile-pages/terms")}
  >
    <Ionicons
      name="document-text-outline"
      size={22}
      color={colors.text}
    />
    <Text style={[styles.rowText, { color: colors.text }]}>
      Terms & Conditions
    </Text>
  </TouchableOpacity>

  {/* ABOUT */}
  <TouchableOpacity
    style={styles.row}
    onPress={() => router.push("/profile-pages/about")}
  >
    <Ionicons
      name="information-circle-outline"
      size={22}
      color={colors.text}
    />
    <Text style={[styles.rowText, { color: colors.text }]}>
      About App
    </Text>
  </TouchableOpacity>
</View>


        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  full: { flex: 1 },
  
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  name: {
  fontSize: 20,
  fontWeight: "700",
  marginTop: 6,
},

  panel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0, // ✅ KEY FIX
    width: PANEL_WIDTH,
    paddingTop: 60,
    paddingHorizontal: 18,
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },

  header: { alignItems: "center", marginBottom: 16 },

  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 8,
  },

  avatar: { width: 100, height: 100, borderRadius: 999 },

  section: { marginTop: 16 },

  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },

  rowText: { marginLeft: 12, fontSize: 16 },

  logoutBtn: { flexDirection: "row", alignItems: "center", marginTop: 24 },

  logoutText: { marginLeft: 10, fontSize: 16, fontWeight: "600" },
});
