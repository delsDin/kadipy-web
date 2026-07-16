import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Import des styles globaux dans l'ordre de cascade
import './styles/themes.css'   // Variables de couleur (clair/sombre en premier)
import './styles/globals.css'  // Reset, typographie, utilitaires
import './styles/animations.css' // Keyframes et micro-animations
import './styles/extra.css'      // Styles complémentaires (Contact, Evolutions, Exemples)

/**
 * Point d'entrée de la plateforme KadiPy.
 *
 * Monte le composant racine React sur l'élément #root du HTML.
 * StrictMode est activé pour détecter les problèmes potentiels.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
