import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load envs (both VITE_* and non-prefixed, since you passed empty prefix)
  const env = loadEnv(mode, process.cwd(), "");

  const API_URL = env.VITE_API_URL || "http://localhost:5000";

  return {
    plugins: [
      react(),
      tailwindcss(), // enables Tailwind in Vite (Tailwind v4 plugin)
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // If you want to expose specific envs at build time:
      __VITE_API_URL__: JSON.stringify(API_URL),
    },
    server: {
      host: true,
      port: 5173,
      open: true,
      cors: true,
      // Dev proxy so calls like fetch('/api/...') hit your backend
      proxy: {
        "/api": {
          target: API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: true,
      port: 4173,
    },
    build: {
      sourcemap: true,
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  };
});
