import { useState, useEffect, useCallback } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Search, Sun, Moon, Globe, Menu, X } from 'lucide-react'
import kadipyLogo from '../../images/kadipy.png'
import { useTheme } from '../../context/ThemeContext'
import { useLang } from '../../context/LanguageContext'
import SearchModal from '../ui/SearchModal'
import './Navbar.css'

/**
 * Barre de navigation principale de la plateforme KadiPy.
 *
 * Contient :
 * - Logo et nom du projet
 * - Liens de navigation vers toutes les pages
 * - Bouton d'ouverture de la recherche (Ctrl+K)
 * - Sélecteur de langue FR / EN
 * - Toggle thème clair / sombre
 * - Menu mobile (hamburger)
 */
export default function Navbar() {
  const { theme, toggleTheme, isDark } = useTheme()
  const { lang, toggleLang, t } = useLang()

  // État de visibilité de la modale de recherche
  const [searchOpen, setSearchOpen] = useState(false)
  // État du menu mobile
  const [mobileOpen, setMobileOpen] = useState(false)
  // Ombre de la navbar au scroll
  const [scrolled, setScrolled] = useState(false)

  // Détection du scroll pour l'ombre de la navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Raccourci clavier Ctrl+K / Cmd+K pour ouvrir la recherche
  const handleGlobalKey = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      setSearchOpen(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [handleGlobalKey])

  // Fermeture du menu mobile à la navigation
  const closeMobile = () => setMobileOpen(false)

  // Liens de navigation
  const navLinks = [
    { to: '/',          label: t('navbar.home'),       end: true },
    { to: '/pourquoi',  label: t('navbar.why') },
    { to: '/demarrage', label: t('navbar.start') },
    { to: '/market',    label: t('navbar.market'),   module: 'market' },
    { to: '/weather',   label: t('navbar.weather'),  module: 'weather' },
    { to: '/kidas',     label: t('navbar.kidas'),    module: 'kidas' },
    { to: '/exemples',  label: t('navbar.examples') },
    { to: '/evolutions',label: t('navbar.evolutions') },
    { to: '/contact',   label: t('navbar.contact') },
  ]

  return (
    <>
      {/* Barre de navigation */}
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" aria-label="KadiPy — Accueil" onClick={closeMobile}>
            <img src={kadipyLogo} alt="KadiPy Logo" className="navbar__logo-icon" style={{ height: '24px', width: 'auto', marginRight: '8px' }} />
            <span className="navbar__logo-text">KadiPy</span>
            <span className="navbar__version">v1.0</span>
          </Link>

          {/* Navigation principale (desktop) */}
          <nav className="navbar__links" aria-label="Navigation principale">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''} ${link.module ? `navbar__link--${link.module}` : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions : recherche, langue, thème */}
          <div className="navbar__actions">
            {/* Bouton de recherche */}
            <button
              id="search-trigger"
              className="navbar__search-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Ouvrir la recherche"
              title={t('navbar.search_hint')}
            >
              <Search size={16} aria-hidden="true" />
              <span className="navbar__search-hint">{t('navbar.search_hint')}</span>
            </button>

            {/* Sélecteur de langue */}
            <button
              id="lang-toggle"
              className="navbar__icon-btn"
              onClick={toggleLang}
              aria-label={`Changer la langue : actuellement ${lang.toUpperCase()}`}
              title="Changer de langue / Switch language"
            >
              <Globe size={18} aria-hidden="true" />
              <span className="navbar__lang-label">{lang.toUpperCase()}</span>
            </button>

            {/* Toggle thème */}
            <button
              id="theme-toggle"
              className="navbar__icon-btn"
              onClick={toggleTheme}
              aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
              title={isDark ? 'Thème clair' : 'Thème sombre'}
            >
              {isDark
                ? <Sun size={18} aria-hidden="true" />
                : <Moon size={18} aria-hidden="true" />
              }
            </button>

            {/* Bouton menu mobile */}
            <button
              id="mobile-menu-toggle"
              className="navbar__mobile-btn"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <nav
            id="mobile-menu"
            className="navbar__mobile-menu"
            aria-label="Navigation mobile"
          >
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                }
                onClick={closeMobile}
              >
                {link.label}
              </NavLink>
            ))}
            {/* Actions mobiles */}
            <div className="navbar__mobile-actions">
              <button className="navbar__mobile-action" onClick={() => { setSearchOpen(true); closeMobile() }}>
                <Search size={16} /> Recherche (Ctrl+K)
              </button>
              <button className="navbar__mobile-action" onClick={toggleLang}>
                <Globe size={16} /> {lang === 'fr' ? 'English' : 'Français'}
              </button>
              <button className="navbar__mobile-action" onClick={toggleTheme}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? 'Thème clair' : 'Thème sombre'}
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Modale de recherche */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
