// src/services/api.js
import { useAuth } from "@/auth";

export function useApi() {
  const { token, apiUrl } = useAuth();

  async function request(path, options = {}) {
    const url = path.startsWith("http") ? path : `${apiUrl}${path}`;
    const headers = new Headers(options.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);

    // Auto JSON for plain objects
    if (options.body && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
      if (typeof options.body !== "string") {
        options.body = JSON.stringify(options.body);
      }
    }
    const res = await fetch(url, { ...options, headers, credentials: "include" });

    // Attach a helper to always get readable message
    res.readMessage = async () => {
      try { const j = await res.clone().json(); return j?.message || j?.error || ""; }
      catch { return await res.clone().text(); }
    };

    return res;
  }

  return {
    get: (p) => request(p),
    post: (p, body) => request(p, { method: "POST", body }),
    put: (p, body) => request(p, { method: "PUT", body }),
    patch: (p, body) => request(p, { method: "PATCH", body }),
    del: (p) => request(p, { method: "DELETE" }),
  };
}
