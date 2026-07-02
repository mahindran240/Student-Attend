import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const value = localStorage.getItem("sams_user");
  return value ? JSON.parse(value) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("sams_token");
    if (!token) return;
    api.get("/auth/me").then(({ data }) => {
      setUser(data.user);
      localStorage.setItem("sams_user", JSON.stringify(data.user));
    }).catch(() => {
      localStorage.removeItem("sams_token");
      localStorage.removeItem("sams_user");
    });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("sams_token", data.token);
      localStorage.setItem("sams_user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success(`Welcome, ${data.user.name}`);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("sams_token");
    localStorage.removeItem("sams_user");
    setUser(null);
    toast.success("Signed out");
  };

  const value = useMemo(() => ({ user, loading, login, logout, isAuthenticated: Boolean(user) }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
