import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(() => localStorage.getItem("hl_guest") === "1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hl_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ user: u }) => {
        setUser(u);
        setGuest(false);
        localStorage.removeItem("hl_guest");
      })
      .catch(() => {
        localStorage.removeItem("hl_token");
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      guest: guest && !user,
      isAuthenticated: !!user,
      loading,
      login: (token, userData) => {
        localStorage.setItem("hl_token", token);
        localStorage.removeItem("hl_guest");
        setUser(userData);
        setGuest(false);
      },
      logout: () => {
        localStorage.removeItem("hl_token");
        setUser(null);
        setGuest(false);
      },
      exploreAsGuest: () => {
        localStorage.setItem("hl_guest", "1");
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
