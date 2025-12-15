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
import { API_BASE } from "../src/constants/api";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const PANEL_WIDTH = Math.round(SCREEN_W * 0.75);
const TAB_BAR_HEIGHT = 70; // 🔥 real bottom tab bar height

export default function ProfilePanel() {
  const router = useRouter();
  const { token, loading: authLoading, logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  const closingRef = useRef(false);
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  /* ---------------------------------------------
     FETCH USER
  --------------------------------------------- */
  useEffect(() => {
    let isAlive = true;

    const fetchProfile = async () => {
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await api.get("/api/me");
        if (!isAlive) return;

        const user = res.data?.user || {};
        setProfile(user);
        setLocalAvatarUri(
  user.avatarUrl ? `${API_BASE}${user.avatarUrl}` : null
);
      } catch (err) {
        console.log("PROFILE API ERROR:", err);
      } finally {
        if (isAlive) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isAlive = false;
    };
  }, [token]);

  /* ---------------------------------------------
     OPEN ANIMATION
  --------------------------------------------- */
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

  /* ---------------------------------------------
     CLOSE PANEL
  --------------------------------------------- */
  const closePanel = () => {
    if (closingRef.current) return;
    closingRef.current = true;

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -PANEL_WIDTH,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const closePanel = () => {
  router.back(); // 🔥 tabs alive irukkum
};

    });
  };

  /* ---------------------------------------------
     PICK IMAGE
  --------------------------------------------- */
const pickImage = async () => {
  const { status } =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    Alert.alert("Permission required");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled) return;

  const localUri = result.assets[0].uri;
  setLocalAvatarUri(localUri); // instant preview

  const form = new FormData();
  form.append("avatar", {
    uri: localUri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  try {
    await api.post("/profile/upload-avatar", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // re-fetch user
    const res = await api.get("/api/me");
    const user = res.data.user;

    setProfile(user);
    setLocalAvatarUri(
      user.avatarUrl ? `${API_BASE}${user.avatarUrl}` : null
    );
  } catch (err) {
    console.log("UPLOAD ERROR", err);
    Alert.alert("Upload failed");
  }
};


    

  if (loading || authLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.full}>
      {/* OVERLAY */}
      <Pressable style={StyleSheet.absoluteFill} onPress={closePanel}>
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity }]}
        />
      </Pressable>

      {/* SIDE PANEL */}
      <Animated.View
        style={[styles.panel, { transform: [{ translateX }] }]}
      >
        {/* HEADER */}
        <View style={styles.header}>
 <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
  {localAvatarUri ? (
    <Image
      source={{ uri: localAvatarUri }}
      style={styles.avatar}
    />
  ) : (
    <Ionicons name="person" size={48} color="#fff" />
  )}
</TouchableOpacity>



          <Text style={styles.name}>{profile?.name || "User"}</Text>
          <Text style={styles.email}>{profile?.email || "---"}</Text>
        </View>

        {/* MENU */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/profile-pages/theme")}
          >
            <Ionicons name="moon-outline" size={22} color="#fff" />
            <Text style={styles.rowText}>Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/profile-pages/terms")}
          >
            <Ionicons
              name="document-text-outline"
              size={22}
              color="#fff"
            />
            <Text style={styles.rowText}>Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/profile-pages/about")}
          >
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#fff"
            />
            <Text style={styles.rowText}>About App</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#ff4d4d" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

/* ---------------------------------------------
   STYLES
--------------------------------------------- */
const styles = StyleSheet.create({
  full: {
    flex: 1,
    backgroundColor: "transparent",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#020617",
  },

  overlay: {
    flex: 1,
    backgroundColor: "#000",
  },

  panel: {
    position: "absolute",
    left: 0,
    top: 0,
    width: PANEL_WIDTH,
    height: SCREEN_H,
    backgroundColor: "#071025",
    paddingTop: 60,
    paddingHorizontal: 18,

    // 🔥 important for bottom tab bar
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 16,
  },

  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: "#0e1726",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 8,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 999,
  },

  plusWrap: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
  },

  email: {
    color: "#9CA3AF",
    marginTop: 2,
  },

  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#123",
    marginTop: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#123",
  },

  rowText: {
    color: "#fff",
    marginLeft: 12,
    fontSize: 16,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 24,
  },

  logoutText: {
    color: "#ff4d4d",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
