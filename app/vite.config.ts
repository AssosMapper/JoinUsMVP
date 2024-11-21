import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import basicSsl from "@vitejs/plugin-basic-ssl";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    process.env.NODE_ENV === "development" &&
      basicSsl({
        name: "dev",
        domains: ["localhost"],
        certDir: path.resolve(__dirname, "./../configs/ssl/localhost-cert.pem"),
      }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./../shared"),
      "@back": path.resolve(__dirname, "./../back-core/src"),
      "@stores": path.resolve(__dirname, "./src/store"),
    },
  },
});
