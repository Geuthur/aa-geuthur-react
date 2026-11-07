// Third Party
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Everything the apps install themselves (peerDependencies) stays outside of the bundle,
// including sub paths such as `react-dom/client` or `react-bootstrap/Tooltip`.
const peerDependencies = [
  "@tanstack/react-query",
  "@tanstack/react-table",
  "i18next",
  "js-cookie",
  "lucide-react",
  "nuqs",
  "openapi-fetch",
  "react",
  "react-bootstrap",
  "react-dom",
  "react-i18next",
  "react-router-dom",
];
const isExternal = (id: string) => peerDependencies.some((name) => id === name || id.startsWith(`${name}/`));

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["src/**/*.test.{ts,tsx}", "eslint-rules/**/*.test.mjs"],
  },
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      exclude: ["src/__tests__/**", "src/setupTests.ts"],
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
      cssFileName: "aa-geuthur-react",
    },
    rollupOptions: {
      external: isExternal,
    },
  },
});
