import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/PerSoNalReSuMe/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('remotion')) return 'remotion';
          if (id.includes('framer-motion')) return 'framer';
        },
      },
    },
  },
})
