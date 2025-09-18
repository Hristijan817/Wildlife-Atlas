import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import typography from "@tailwindcss/typography";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = env.VITE_API_URL || "http://localhost:5000";

  return {
    plugins: [
      react(),
      tailwindcss({
        config: {
          content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
          theme: {
            extend: {},
          },
          plugins: [typography], // ✅ enable prose
          safelist: [
            "border-emerald-400",
            "border-amber-400",
            "border-lime-400",
            "text-emerald-600",
            "text-amber-600",
            "text-lime-600",
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __VITE_API_URL__: JSON.stringify(API_URL),
    },
    server: {
      host: true,
      port: 5173,
      open: true,
      cors: true,
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
