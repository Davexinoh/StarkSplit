import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/StarkSplit/',
  define: { global: 'globalThis' },
  resolve: { alias: { '@': '/src' } },
})
