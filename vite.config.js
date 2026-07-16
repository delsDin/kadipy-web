import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite pour la plateforme KadiPy
export default defineConfig({
  plugins: [react()],
  // Dossier de base pour le déploiement GitHub Pages
  base: './',
})
