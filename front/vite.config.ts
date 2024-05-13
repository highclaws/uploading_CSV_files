import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig as viteDefineConfig } from "vite";
import dotenv from "dotenv";
dotenv.config();
export default defineConfig(
  viteDefineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
    },
  })
);
