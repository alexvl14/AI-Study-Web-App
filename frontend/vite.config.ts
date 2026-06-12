import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 80,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': { target: 'http://backend-dotnet:8080', changeOrigin: true },
      '/manage': { target: 'http://backend-dotnet:8080', changeOrigin: true },
      '/login': { target: 'http://backend-dotnet:8080', changeOrigin: true },
      '/register': { target: 'http://backend-dotnet:8080', changeOrigin: true },
      '/logout': { target: 'http://backend-dotnet:8080', changeOrigin: true },
    },
  },
})
