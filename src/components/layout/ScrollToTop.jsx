import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Remonte automatiquement en haut de page à chaque changement de route.
 *
 * Ce composant ne rend rien visuellement. Il se contente d'écouter
 * les changements de pathname via React Router et de scroller vers
 * le haut avec un comportement instantané.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll instantané (pas smooth) pour éviter l'effet de traîne entre pages
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
