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
import api from "../src/api/api"; // <- ensure this file exports default axios instance
import { AuthContext } from "../src/context/AuthContext";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const PANEL_WIDTH = Math.round(SCREEN_W * 0.75); // 3/4 width

export default function ProfilePanel() {
  const router = useRouter();
  const { token, loading: authLoading, logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name?: string; email?: string; avatarUrl?: string } | null>(null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  // animation values
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current; // off-screen left
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // prevent accidental close until animation finished
  const [interactive, setInteractive] = useState(false);
  // guard so close runs only once
  const closingRef = useRef(false);

  // fetch profile on mount
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
        // optional debug: console.log('[PROFILE] auth header:', api.defaults.headers.common?.Authorization?.slice?.(0,40));
        const res = await api.get("/api/me");
        if (!alive) return;
        setProfile(res.data?.user ?? null);
        if (res.data?.user?.avatarUrl) setLocalAvatarUri(res.data.user.avatarUrl);
      } catch (e) {
        console.warn("profile fetch error", e);
        Alert.alert("Profile failed", "Could not load profile. Try again.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [authLoading, token]);

  // open animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0.6, duration: 260, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 6 }),
    ]).start(() => {
      setInteractive(true);
    });
  }, []);

  // close panel only once
  const closePanel = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setInteractive(false);

    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -PANEL_WIDTH, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      router.back();
    });
  };

  // image picker
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow gallery access to choose a profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });

      // handle both old/new shapes:
      if ((result as any).cancelled || (result as any).canceled) return;
      const uri = (result as any).uri ?? (result as any)?.assets?.[0]?.uri;
      if (!uri) return;

      // show immediately
      setLocalAvatarUri(uri);

      // optional: upload to backend if endpoint exists
      // await uploadAvatar(uri);
    } catch (e) {
      console.warn("pickImage error", e);
      Alert.alert("Error", "Could not open gallery");
    }
  };

  // optional uploader (uncomment if backend endpoint exists)
  async function uploadAvatar(uri: string) {
    try {
      const form = new FormData();
      const filename = uri.split("/").pop() ?? "avatar.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1].toLowerCase() : "jpg";
      const mimeType = ext === "png" ? "image/png" : "image/jpeg";

      form.append("avatar", {
        uri,
        name: filename,
        type: mimeType,
      } as any);

      const res = await api.post("/api/users/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.avatarUrl) setLocalAvatarUri(res.data.avatarUrl);
      Alert.alert("Success", "Profile picture updated.");
    } catch (err) {
      console.warn("uploadAvatar error", err);
      Alert.alert("Upload failed", "Couldn't upload avatar. Try again later.");
    }
  }

  // logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn("logout err", e);
    } finally {
      router.replace("/login");
    }
  };

  if (authLoading || loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.full}>
      {/* overlay - only react if interactive true */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => {
          if (!interactive) return;
          closePanel();
        }}
      >
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>

      {/* sliding panel */}
      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
        {/* header: close button */}
        <View style={styles.handleRow}>
          <TouchableOpacity onPress={() => interactive && closePanel()} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* avatar + info */}
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrap} activeOpacity={0.8}>
            {localAvatarUri ? <Image source={{ uri: localAvatarUri }} style={styles.avatar} /> : <Ionicons name="person-circle-outline" size={86} color="#fff" />}
          </TouchableOpacity>

          <Text style={styles.name}>{profile?.name ?? "User"}</Text>
          <Text style={styles.email}>{profile?.email ?? "—"}</Text>
        </View>

        <View style={styles.sep} />

        {/* list */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={() => Alert.alert("Theme", "Theme toggle here")}>
            <Ionicons name="moon-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Theme</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => router.push("/login")}>
            <Ionicons name="document-text-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => router.push("/login")}>
            <Ionicons name="information-circle-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>About App</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: Platform.OS === "ios" ? 34 : 18 }} />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: "transparent" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  overlay: { flex: 1, backgroundColor: "#000" },

  panel: {
    position: "absolute",
    left: 0,
    top: 0,
    height: SCREEN_H,
    width: PANEL_WIDTH,
    backgroundColor: "#071025",
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },

  handleRow: { height: 36, justifyContent: "center", alignItems: "flex-end" },
  closeBtn: { padding: 6, borderRadius: 8 },

  header: { alignItems: "center", marginTop: 4, marginBottom: 18 },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#0f1720",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatar: { width: 96, height: 96, borderRadius: 999 },
  name: { color: "#fff", fontSize: 20, fontWeight: "700" },
  email: { color: "#9CA3AF", marginTop: 6 },

  sep: { height: 8 },

  section: {
    marginTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#0f1728",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#0f1728",
  },
  rowText: { color: "#fff", marginLeft: 12, fontSize: 16 },

  logoutBtn: { marginTop: 16, alignItems: "center", paddingVertical: 14 },
  logoutText: { color: "#ff6b6b", fontSize: 17, fontWeight: "700" },
});
