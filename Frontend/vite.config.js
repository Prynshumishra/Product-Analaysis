import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^react-router-dom$/,
        replacement: path.resolve(__dirname, 'node_modules/react-router-dom/dist/index.js'),
      },
      {
        find: /^react-router$/,
        replacement: path.resolve(__dirname, 'node_modules/react-router/dist/index.js'),
      },
    ],
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: ['react-router', 'react-router-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/recharts')) {
            return 'chartVendor'
          }

          if (
            id.includes('node_modules/react-router-dom') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react')
          ) {
            return 'reactVendor'
          }

          if (id.includes('node_modules')) {
            return 'vendor'
          }

          return undefined
        },
      },
    },
  },
})
