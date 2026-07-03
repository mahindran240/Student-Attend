import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api.js";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const value = localStorage.getItem("sams_user");
  return value ? JSON.parse(value) : null;
};

const demoUsers = {
  student: { name: "Student Demo", role: "student", demo: true },
  teacher: { name: "Teacher Demo", role: "teacher", demo: true },
  hod: { name: "HOD Demo", role: "hod", demo: true }
};

const getDemoUser = () => {
  const enabled = sessionStorage.getItem("demoMode") === "true";
  const role = sessionStorage.getItem("demoRole");
  return enabled ? demoUsers[role] || null : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [demoUser, setDemoUser] = useState(getDemoUser);
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
      sessionStorage.removeItem("demoMode");
      sessionStorage.removeItem("demoRole");
      localStorage.setItem("sams_token", data.token);
      localStorage.setItem("sams_user", JSON.stringify(data.user));
      setDemoUser(null);
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
    sessionStorage.removeItem("demoMode");
    sessionStorage.removeItem("demoRole");
    setUser(null);
    setDemoUser(null);
    toast.success("Signed out");
  };

  const enterDemoMode = (role) => {
    const selectedDemoUser = demoUsers[role];
    if (!selectedDemoUser) return null;
    sessionStorage.setItem("demoMode", "true");
    sessionStorage.setItem("demoRole", role);
    setDemoUser(selectedDemoUser);
    return selectedDemoUser;
  };

  const activeUser = user || demoUser;
  const value = useMemo(
    () => ({ user: activeUser, realUser: user, demoUser, loading, login, logout, enterDemoMode, isAuthenticated: Boolean(user), isDemoMode: Boolean(demoUser) }),
    [activeUser, demoUser, loading, user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
