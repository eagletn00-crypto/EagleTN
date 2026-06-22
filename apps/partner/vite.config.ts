import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@eagle-tn/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@eagle-tn/database': path.resolve(__dirname, '../../packages/database/src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 4174,
    strictPort: false,
  },
})
