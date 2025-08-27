import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

const AuthCtx = createContext(null);

export function AuthProvider({ apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000", children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("token") || sessionStorage.getItem("token") || ""
  );
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  const saveAuth = useCallback((t, u, remember) => {
    try {
      // clear both stores first
      localStorage.removeItem("token"); localStorage.removeItem("user");
      sessionStorage.removeItem("token"); sessionStorage.removeItem("user");

      if (t) (remember ? localStorage : sessionStorage).setItem("token", t);
      if (u) (remember ? localStorage : sessionStorage).setItem("user", JSON.stringify(u));

      setToken(t || "");
      setUser(u || null);
    } catch {
      // ignore storage errors
      setToken(t || "");
      setUser(u || null);
    }
  }, []);

  const login = useCallback(async ({ email, password, remember = false }) => {
    const res = await fetch(`${apiUrl}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (!res.ok) {
      const t = await res.text();
      let msg = t;
      try { const j = JSON.parse(t); msg = j?.message || j?.error || msg; } catch {}
      throw new Error(msg || `Login failed (${res.status})`);
    }
    const data = await res.json();
    const tkn = data?.token || data?.data?.token;
    const usr = data?.user || data?.data?.user || null; // expects { id, name, email, role }
    saveAuth(tkn, usr, remember);
    return { token: tkn, user: usr };
  }, [apiUrl, saveAuth]);

  const logout = useCallback(() => saveAuth("", null, true), [saveAuth]);

  const authedFetch = useCallback(async (path, init = {}) => {
    const headers = new Headers(init.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const url = path.startsWith("http") ? path : `${apiUrl}${path}`;
    return fetch(url, { ...init, headers, credentials: "include" });
  }, [apiUrl, token]);

  const value = useMemo(
    () => ({ token, user, ready, apiUrl, login, logout, authedFetch }),
    [token, user, ready, apiUrl, login, logout, authedFetch]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function ProtectedRoute({ children }) {
  const { token, ready } = useAuth();
  if (!ready) return null; // or a spinner
  return token ? children : <Navigate to="/login" replace />;
}
