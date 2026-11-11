import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// npm run dev -> http://localhost:5173
// O proxy faz /api/avaliacoes (no navegador) virar http://localhost:8080/avaliacoes (o back).
// Para testar o front local contra o back da VM, troque o target por http://IP_DA_VM:8080
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
