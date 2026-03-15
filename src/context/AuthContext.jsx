import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("scamshield_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then((result) => setUser(result.user))
      .catch(() => {
        localStorage.removeItem("scamshield_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const result = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("scamshield_token", result.token);
    setUser(result.user);
    return result.user;
  }

  async function register(username, email, password) {
    const result = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    return result;
  }

  function logout() {
    localStorage.removeItem("scamshield_token");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
