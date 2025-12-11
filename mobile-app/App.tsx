// App.tsx (project root)
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // optional but common
import { AuthProvider } from "./src/context/AuthContext";
// your react-navigation setupimport AppNav from "./src/navigation/AppNav"; 

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
