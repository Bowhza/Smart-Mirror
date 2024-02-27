import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { hostIP } from './GetIP.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: `${hostIP}`,
    port: 5173,
    proxy: {
      // Proxy all requests
      '/api': {
        target: `http://${hostIP}:5174`, // Target server URL
        changeOrigin: true,
        //rewrite: path => path.replace(/^\//, ''), // Remove leading '/'
      },
    },
  },
})
