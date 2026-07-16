import { useState, useEffect } from 'react'

/**
 * Barre de progression de lecture affichée en haut de la page.
 *
 * Calcule la proportion de la page qui a été scrollée et l'affiche
 * sous forme d'une barre colorée (vert → or) fixée au sommet.
 */
export default function ReadingProgress() {
  // Largeur de la barre en pourcentage (0 à 100)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      // Protection contre la division par zéro
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.round(pct * 10) / 10))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="reading-bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Progression de lecture"
      style={{ width: `${progress}%` }}
    />
  )
}
