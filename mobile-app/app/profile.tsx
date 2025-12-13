// app/profile.tsx
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
  Pressable,
  Platform,
  Image,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import api from "../src/api/api";
import { AuthContext } from "../src/context/AuthContext";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const PANEL_WIDTH = Math.round(SCREEN_W * 0.75);

export default function ProfilePanel() {
  const router = useRouter();
  const { token, loading: authLoading, logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name?: string; email?: string; avatarUrl?: string } | null>(null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  // animation values
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const [interactive, setInteractive] = useState(false);
  const closingRef = useRef(false);

  // ---------------------------
  // FETCH PROFILE
  // ---------------------------
  useEffect(() => {
    let alive = true;
    (async () => {
      if (authLoading) return;

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        setLoading(true);
        const res = await api.get("/api/me");
        if (!alive) return;

        setProfile(res.data?.user ?? null);
        setLocalAvatarUri(res.data?.user?.avatarUrl || null);

      } catch (e) {
        console.warn("profile fetch error", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [authLoading, token]);

  // ---------------------------
  // OPEN PANEL ANIMATION (WITH RESET)
  // ---------------------------
  useEffect(() => {
    // Reset all animation values
    translateX.setValue(-PANEL_WIDTH);
    overlayOpacity.setValue(0);
    closingRef.current = false;
    setInteractive(false);

    // Animate open
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0.6,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
    ]).start(() => setInteractive(true));
  }, []);

  // ---------------------------
  // CLOSE PANEL
 // CLOSE PANEL
const closePanel = () => {
  if (closingRef.current) return;
  closingRef.current = true;

  setInteractive(false);

  Animated.parallel([
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }),
    Animated.timing(translateX, {
      toValue: -PANEL_WIDTH,
      duration: 180,
      useNativeDriver: true,
    }),
  ]).start(() => {
    translateX.setValue(-PANEL_WIDTH);
    overlayOpacity.setValue(0);

    // FIX: use replace instead of back
   router.replace("/(tabs)")

  });
};


  // ---------------------------
  // PICK AVATAR
  // ---------------------------
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.7,
      allowsEditing: true,
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (uri) setLocalAvatarUri(uri);
  };

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn("logout error", e);
    } finally {
      router.replace("/login");
    }
  };

  // ---------------------------
  // LOADING
  // ---------------------------
  if (authLoading || loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <SafeAreaView style={styles.full}>

      {/* OVERLAY CLICK → CLOSE */}
      <Pressable style={StyleSheet.absoluteFill} onPress={() => interactive && closePanel()}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>

      {/* SLIDE PANEL */}
      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>

        <View style={styles.closeRow}>
          <TouchableOpacity onPress={() => interactive && closePanel()}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
            {localAvatarUri ? (
              <Image source={{ uri: localAvatarUri }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={90} color="#fff" />
            )}
          </TouchableOpacity>

          <Text style={styles.name}>{profile?.name ?? "User"}</Text>
          <Text style={styles.email}>{profile?.email ?? "---"}</Text>
        </View>

        {/* List */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="moon-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Ionicons name="document-text-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <Ionicons name="information-circle-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>About App</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </Animated.View>
    </SafeAreaView>
  );
}

/* ------------------- STYLES ------------------- */

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: "transparent" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  overlay: { flex: 1, backgroundColor: "#000" },

  panel: {
    position: "absolute",
    left: 0,
    top: 0,
    width: PANEL_WIDTH,
    height: SCREEN_H,
    backgroundColor: "#071025",
    paddingTop: 20,
    paddingHorizontal: 18,
  },

  closeRow: {
    alignItems: "flex-end",
    marginBottom: 10,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#0e1726",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatar: { width: 100, height: 100, borderRadius: 999 },

  name: { color: "#fff", fontSize: 20, fontWeight: "700" },
  email: { color: "#9CA3AF", marginTop: 4 },

  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#123",
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#123",
  },

  rowText: { color: "#fff", marginLeft: 12, fontSize: 16 },

  logoutBtn: {
    marginTop: 30,
    paddingVertical: 14,
    alignItems: "center",
  },

  logoutText: { color: "#ff6b6b", fontSize: 17, fontWeight: "600" },
});
