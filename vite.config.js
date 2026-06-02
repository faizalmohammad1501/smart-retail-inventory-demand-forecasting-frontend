import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Raise warning threshold (recharts is large by nature)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching
        manualChunks: {
          // Core React runtime
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Charting library (heaviest dep)
          'vendor-recharts': ['recharts'],
          // Icons
          'vendor-icons': ['lucide-react'],
          // HTTP client
          'vendor-axios': ['axios'],
        },
      },
    },
  },

  preview: {
    port: 4173,
    strictPort: true,
  },
})
