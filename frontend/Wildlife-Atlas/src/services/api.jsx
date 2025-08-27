import { useAuth } from "@/auth";

export function useApi() {
  const { authedFetch, apiUrl } = useAuth();
  return {
    apiUrl,
    fetch: authedFetch,
    get: (path) => authedFetch(path),
    post: (path, body) =>
      authedFetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
    put: (path, body) =>
      authedFetch(path, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
    del: (path) => authedFetch(path, { method: "DELETE" }),
  };
}
