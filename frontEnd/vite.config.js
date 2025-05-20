import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],


export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000'
    },
    historyApiFallback: true
  }

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],


})
