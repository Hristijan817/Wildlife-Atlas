// src/services/api.js
export function useApi() {
  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  function getToken() {
    // Look in both storages
    try {
      return (
        (typeof window !== "undefined" && (localStorage.getItem("token") || sessionStorage.getItem("token"))) ||
        null
      );
    } catch {
      return null;
    }
  }

  async function request(path, options = {}) {
    const token = getToken();

    // Ensure path starts with a slash
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    // If caller already set a body, keep it; otherwise use options.body
    const body = options.body;

    // Detect FormData to avoid clobbering headers
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

    const headers = {
      Accept: "application/json",
      // Only set Content-Type for JSON bodies; NEVER for FormData
      ...(!isFormData && body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    // Build final fetch options
    const fetchOpts = {
      ...options,
      headers,
      // Pass FormData as-is; JSON-stringify plain objects/strings
      body: isFormData ? body : body !== undefined && typeof body !== "string" ? JSON.stringify(body) : body,
    };

    // Debug (optional)
    console.log("➡️ Fetch:", `${API_URL}${cleanPath}`);
    console.log("➡️ Method:", fetchOpts.method || "GET");
    console.log("➡️ Auth:", headers.Authorization ? "Bearer present" : "none");
    console.log("➡️ Body type:", isFormData ? "FormData" : typeof fetchOpts.body);

    const res = await fetch(`${API_URL}${cleanPath}`, fetchOpts);
    return res;
  }

  return {
    get: (path, options = {}) => request(path, { method: "GET", ...options }),
    post: (path, body, options = {}) => request(path, { method: "POST", body, ...options }),
    put: (path, body, options = {}) => request(path, { method: "PUT", body, ...options }),
    del: (path, options = {}) => request(path, { method: "DELETE", ...options }),
  };
}
