import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { useLang } from '../../context/LanguageContext'

/**
 * Bouton flottant "retour en haut" qui apparaît après 300px de scroll.
 *
 * Positionné en bas à droite de l'écran, il scroll vers le sommet
 * de la page avec un comportement fluide.
 */
export default function BackToTop() {
  const { t } = useLang()
  // Visibilité du bouton
  const [visible, setVisible] = useState(false)

  // Afficher le bouton après 300px de scroll
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /**
   * Fait défiler la page vers le haut en douceur.
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label={t('common.back_to_top')}
      title={t('common.back_to_top')}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  )
}
