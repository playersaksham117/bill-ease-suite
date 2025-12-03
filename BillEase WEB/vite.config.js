import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Enable source maps for production debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Better code splitting for performance
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('react-router')) {
              return 'router-vendor'
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor'
            }
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-vendor'
            }
            // Other vendor libraries
            return 'vendor'
          }
          // Module-based chunks for lazy loading
          if (id.includes('/modules/POS/')) {
            return 'pos-module'
          }
          if (id.includes('/modules/CRM/')) {
            return 'crm-module'
          }
          if (id.includes('/modules/Invento/')) {
            return 'invento-module'
          }
          if (id.includes('/modules/AccountsPlus/')) {
            return 'accounts-module'
          }
          if (id.includes('/modules/IncomeExpense/')) {
            return 'income-expense-module'
          }
        },
        // Optimize asset file names
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})

