import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    // Worker pools can hang on some Windows setups; run in a single
    // thread to keep things reliable.
    pool: "threads",
    singleThread: true,
  },
});
