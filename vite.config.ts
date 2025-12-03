import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: { "@": resolve("src") },
    },
    define: {
      __APP_URL__: JSON.stringify(
        isProd ? "https://portfoliogenerator.com" : "http://localhost:8080"
      ),
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      minify: "terser",
      rollupOptions: {
        output: {
          manualChunks: { vendor: ["react", "react-dom"], router: ["react-router-dom"] },
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
    },
  };
});
