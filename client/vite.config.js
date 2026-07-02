import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "Student-Attend";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? `/${repoName}/` : "/",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});