import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import viteReact from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173, // frontend sur un port différent du backend
  },
})
