import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/youthol/',
  build: {
    rollupOptions: {
      input: {
        main: '/index.html',
        login: '/login/index.html',
        taskManager: '/taskManager/index.html'
        // main: resolve(__dirname, 'index.html'),
        // login: resolve(__dirname, '/login/index.html')
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
      store: fileURLToPath(new URL('./src/store', import.meta.url)),
      router: fileURLToPath(new URL('./src/router', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      manager: fileURLToPath(new URL('./src/taskManager', import.meta.url))
    }
  }
})
