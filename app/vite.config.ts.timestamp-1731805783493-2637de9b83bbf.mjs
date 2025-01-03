// vite.config.ts
import { defineConfig } from "file:///home/jawad/dev/js/JoinUsMVP/app/node_modules/vite/dist/node/index.js";
import vue from "file:///home/jawad/dev/js/JoinUsMVP/app/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import Components from "file:///home/jawad/dev/js/JoinUsMVP/app/node_modules/unplugin-vue-components/dist/vite.js";
import { PrimeVueResolver } from "file:///home/jawad/dev/js/JoinUsMVP/app/node_modules/@primevue/auto-import-resolver/index.mjs";
var __vite_injected_original_dirname = "/home/jawad/dev/js/JoinUsMVP/app";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@shared": path.resolve(__vite_injected_original_dirname, "./../shared"),
      "@back": path.resolve(__vite_injected_original_dirname, "./../back-core/src"),
      "@stores": path.resolve(__vite_injected_original_dirname, "./src/store")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9qYXdhZC9kZXYvanMvSm9pblVzTVZQL2FwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvamF3YWQvZGV2L2pzL0pvaW5Vc01WUC9hcHAvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvamF3YWQvZGV2L2pzL0pvaW5Vc01WUC9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQge1ByaW1lVnVlUmVzb2x2ZXJ9IGZyb20gJ0BwcmltZXZ1ZS9hdXRvLWltcG9ydC1yZXNvbHZlcic7XG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3Z1ZSgpLFxuICAgIENvbXBvbmVudHMoe1xuICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgIFByaW1lVnVlUmVzb2x2ZXIoKVxuICAgICAgXVxuICAgIH0pXSxcbiAgcmVzb2x2ZTp7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAnQHNoYXJlZCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLy4uL3NoYXJlZCcpLFxuICAgICAgJ0BiYWNrJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vLi4vYmFjay1jb3JlL3NyYycpLFxuICAgICAgJ0BzdG9yZXMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvc3RvcmUnKSxcbiAgICB9LFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUixTQUFTLG9CQUFvQjtBQUMvUyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVEsd0JBQXVCO0FBSi9CLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUFDLElBQUk7QUFBQSxJQUNaLFdBQVc7QUFBQSxNQUNULFdBQVc7QUFBQSxRQUNULGlCQUFpQjtBQUFBLE1BQ25CO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFBQztBQUFBLEVBQ0osU0FBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3BDLFdBQVcsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUNoRCxTQUFTLEtBQUssUUFBUSxrQ0FBVyxvQkFBb0I7QUFBQSxNQUNyRCxXQUFXLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsSUFDbEQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
