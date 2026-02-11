import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testIgnore: ["**/src/__tests__/**"],
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },
});