import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import vitePluginSvgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vitePluginSvgr()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
    strictPort: true, // fails instead of switching to 5174
  },
});
