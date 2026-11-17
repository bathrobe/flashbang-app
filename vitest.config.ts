import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Only the plain-function rules are tested (src/game and src/content); no browser tests.
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    // Same "@/..." shortcut as tsconfig.json, so tests import the way the app does.
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
