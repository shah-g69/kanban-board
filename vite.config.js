import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Prevent duplicate React instances when node_modules are hoisted
    // outside the project (e.g. a shared parent folder).
    dedupe: ["react", "react-dom"],
  },
});