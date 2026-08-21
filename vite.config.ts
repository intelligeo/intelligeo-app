import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    // Render static service is currently configured to publish the "build" directory.
    outDir: "build",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  server: {
    port: 5173,
  },
});
