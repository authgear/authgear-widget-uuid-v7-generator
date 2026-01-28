import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for GitHub Pages and iframe compatibility
  server: {
    port: 3000,
    host: true,
    open: true,
    strictPort: false, // if 3000 is in use, Vite will try 3001, 3002, etc.
  },
  preview: {
    port: 4173,
    host: true,
    open: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable code splitting for iframe compatibility
      }
    }
  }
})
