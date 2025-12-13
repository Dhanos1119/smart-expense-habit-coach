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
  const { token, loading: authLoading } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  // Animation
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // FETCH PROFILE
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await api.get("/api/me");

        if (!alive) return;

        const user = res.data?.user || {};
        setProfile(user);
        setLocalAvatarUri(user.avatarUrl || null);
      } catch (e) {
        console.log("PROFILE API ERROR:", e);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  // PANEL OPEN ANIMATION
  useEffect(() => {
    translateX.setValue(-PANEL_WIDTH);
    overlayOpacity.setValue(0);

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
    router.replace("/(tabs)");
  });
};

  // PICK IMAGE
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission required", "Allow gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setLocalAvatarUri(uri);
  };

  // LOADING UI
  if (authLoading || loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.full}>
      {/* OVERLAY CLICK TO CLOSE */}
      <Pressable style={StyleSheet.absoluteFill} onPress={closePanel}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>

      {/* SLIDE PANEL */}
      <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
            {localAvatarUri ? (
              <Image source={{ uri: localAvatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.plusWrap}>
                <Ionicons name="add" size={34} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.name}>{profile?.name || "User"}</Text>
          <Text style={styles.email}>{profile?.email || "---"}</Text>
        </View>

        {/* MENU OPTIONS */}
        <View style={styles.section}>
          {/* THEME */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/profile-pages/theme")}
          >
            <Ionicons name="moon-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Theme</Text>
          </TouchableOpacity>

          {/* TERMS */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/profile-pages/terms")}
          >
            <Ionicons name="document-text-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Terms & Conditions</Text>
          </TouchableOpacity>

          {/* ABOUT */}
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/profile-pages/about")}
          >
            <Ionicons name="information-circle-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>About App</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 100,
    paddingHorizontal: 18,
  },

  header: { alignItems: "center", marginBottom: 25 },

  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: "#0e1726",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 12,
  },

  avatar: { width: 100, height: 100, borderRadius: 999 },

  plusWrap: {
    width: 100,
    height: 100,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  name: { color: "#fff", fontSize: 20, fontWeight: "700" },
  email: { color: "#9CA3AF", marginTop: 4 },

  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#123",
    marginTop: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#123",
  },

  rowText: { color: "#fff", marginLeft: 12, fontSize: 16 },
});
