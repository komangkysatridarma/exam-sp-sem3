import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("hl_token");
      const g = (await AsyncStorage.getItem("hl_guest")) === "1";
      setGuest(g);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: u } = await authApi.me();
        setUser(u);
        setGuest(false);
        await AsyncStorage.removeItem("hl_guest");
      } catch {
        await AsyncStorage.removeItem("hl_token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({
      user,
      guest: guest && !user,
      isAuthenticated: !!user,
      loading,
      login: async (token, userData) => {
        await AsyncStorage.setItem("hl_token", token);
        await AsyncStorage.removeItem("hl_guest");
        setUser(userData);
        setGuest(false);
      },
      logout: async () => {
        await AsyncStorage.removeItem("hl_token");
        setUser(null);
        setGuest(false);
      },
      exploreAsGuest: async () => {
        await AsyncStorage.setItem("hl_guest", "1");
        setGuest(true);
      },
    }),
    [user, guest, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus di dalam AuthProvider");
  return ctx;
}
