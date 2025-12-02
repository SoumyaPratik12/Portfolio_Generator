import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

async function loadOptional(name: string) {
  try {
    const mod = await import(name);
    return mod?.componentTagger ?? mod?.default ?? mod;
  } catch (err) {
    // plugin not available — continue without it
    return null;
  }
}

export default async ({ mode }: { mode: string }) => {
  const isProd = mode === "production";
  const componentTagger = await loadOptional("lovable-tagger");

  return defineConfig({
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      ...(componentTagger ? [componentTagger()] : []),
    ],
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
  });
};
