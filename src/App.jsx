import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { Suspense, lazy } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import ReadingProgress from './components/layout/ReadingProgress'
import BackToTop from './components/ui/BackToTop'

// Chargement paresseux des pages pour optimiser les performances
const Home       = lazy(() => import('./pages/Home'))
const Pourquoi   = lazy(() => import('./pages/Pourquoi'))
const Demarrage  = lazy(() => import('./pages/Demarrage'))
const Market     = lazy(() => import('./pages/Market'))
const Weather    = lazy(() => import('./pages/Weather'))
const Kidas      = lazy(() => import('./pages/Kidas'))
const Exemples   = lazy(() => import('./pages/Exemples'))
const Evolutions = lazy(() => import('./pages/Evolutions'))
const Contact    = lazy(() => import('./pages/Contact'))
const NotFound   = lazy(() => import('./pages/NotFound'))

/**
 * Écran de chargement affiché pendant le chargement paresseux.
 */
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: 'var(--color-muted)',
      fontSize: '0.875rem',
    }}>
      {/* Indicateur visuel minimal */}
      <div className="spinner" style={{
        width: 24,
        height: 24,
        border: '2px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
      }} />
    </div>
  )
}

/**
 * Composant racine de l'application KadiPy.
 *
 * Enveloppe l'application dans les fournisseurs de contexte
 * (thème, langue) et configure le routeur React Router.
 * Toutes les pages sont chargées de façon paresseuse (lazy).
 */
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          {/* Retour en haut à chaque navigation */}
          <ScrollToTop />
          {/* Barre de progression de lecture */}
          <ReadingProgress />
          {/* Navigation principale */}
          <Navbar />
          {/* Zone de contenu principal */}
          <main style={{ paddingTop: '60px' }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/"           element={<Home />} />
                <Route path="/pourquoi"   element={<Pourquoi />} />
                <Route path="/demarrage"  element={<Demarrage />} />
                <Route path="/market"     element={<Market />} />
                <Route path="/weather"    element={<Weather />} />
                <Route path="/kidas"      element={<Kidas />} />
                <Route path="/exemples"   element={<Exemples />} />
                <Route path="/evolutions" element={<Evolutions />} />
                <Route path="/contact"    element={<Contact />} />
                <Route path="*"           element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          {/* Pied de page */}
          <Footer />
          {/* Bouton retour en haut */}
          <BackToTop />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  )
}
