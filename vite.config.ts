import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration pour le déploiement GitHub Pages
export default defineConfig({
  plugins: [react()],
  // IMPORTANT : Correspond au nom de votre repo GitHub
  base: '/b572-guide/', 
  build: {
    outDir: 'dist',
  }
})