import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    })],
  resolve:{
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './../shared'),
      '@back': path.resolve(__dirname, './../back-core/src'),
      '@stores': path.resolve(__dirname, './src/store'),
    },
  }
})
