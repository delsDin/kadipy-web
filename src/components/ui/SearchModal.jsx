import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight, Hash } from 'lucide-react'
import { useLang } from '../../context/LanguageContext'
import searchIndex from '../../data/search-index'
import './SearchModal.css'

/**
 * Modale de recherche dynamique globale.
 *
 * S'ouvre via Ctrl+K ou Cmd+K. Filtre en temps réel l'index de
 * recherche statique (modules, méthodes, exemples). Supporte la
 * navigation clavier (flèches haut/bas, Entrée, Échap).
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Visibilité de la modale
 * @param {function} props.onClose - Callback de fermeture
 */
export default function SearchModal({ isOpen, onClose }) {
  const { t } = useLang()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // État de la requête et des résultats filtrés
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)

  // Filtrage en temps réel dans l'index statique
  useEffect(() => {
    if (!query.trim()) {
      // Sans requête, afficher les résultats populaires
      setResults(searchIndex.filter(item => item.featured).slice(0, 8))
      return
    }
    const q = query.toLowerCase().trim()
    const filtered = searchIndex
      .filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags?.some(tag => tag.toLowerCase().includes(q))
      )
      .slice(0, 12)
    setResults(filtered)
    setActiveIndex(0)
  }, [query])

  // Focus automatique à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
    }
  }, [isOpen])

  // Navigation clavier
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, results.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, 0))
    }
    if (e.key === 'Enter' && results[activeIndex]) {
      navigateToResult(results[activeIndex])
    }
  }, [isOpen, results, activeIndex, onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  /**
   * Navigation vers le résultat sélectionné.
   * @param {object} result - Entrée de l'index de recherche
   */
  const navigateToResult = (result) => {
    navigate(result.path)
    onClose()
    // Scroll vers l'ancre si présente
    if (result.anchor) {
      setTimeout(() => {
        const el = document.getElementById(result.anchor)
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }

  // Couleurs par module
  const moduleColors = {
    market:  'var(--module-market-color)',
    weather: 'var(--module-weather-color)',
    kidas:   'var(--module-kidas-color)',
    general: 'var(--color-muted)',
  }

  if (!isOpen) return null

  return (
    <div className="search-overlay" onClick={onClose}>
      <div
        className="search-modal-content"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Recherche"
      >
        {/* Champ de recherche */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            className="search-input"
            placeholder={t('navbar.search_placeholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Recherche"
            autoComplete="off"
          />
          {query && (
            <button
              className="search-clear"
              onClick={() => setQuery('')}
              aria-label="Effacer"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="search-kbd" aria-label="Échapper pour fermer">Esc</kbd>
        </div>

        {/* Liste des résultats */}
        <div className="search-results" ref={listRef} role="listbox">
          {results.length === 0 && query ? (
            <div className="search-empty">
              <span>{t('common.search_no_results')} </span>
              <strong>"{query}"</strong>
            </div>
          ) : (
            <>
              {!query && (
                <div className="search-section-label">Suggestions</div>
              )}
              {query && results.length > 0 && (
                <div className="search-section-label">
                  {results.length} {t('common.search_results')}
                </div>
              )}
              {results.map((result, idx) => (
                <button
                  key={result.id}
                  className={`search-result-item ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => navigateToResult(result)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  role="option"
                  aria-selected={idx === activeIndex}
                >
                  {/* Icône du module */}
                  <span
                    className="result-module-dot"
                    style={{ background: moduleColors[result.module] || moduleColors.general }}
                    aria-hidden="true"
                  />
                  <div className="result-content">
                    <div className="result-title">
                      {/* Mise en évidence du terme recherché */}
                      <HighlightedText text={result.title} query={query} />
                    </div>
                    <div className="result-description">
                      <HighlightedText text={result.description} query={query} />
                    </div>
                  </div>
                  <div className="result-meta">
                    {result.type && (
                      <span className="result-type">{result.type}</span>
                    )}
                    <ArrowRight size={14} className="result-arrow" />
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Aide clavier */}
        <div className="search-footer">
          <span className="search-key-hint">
            <kbd>↑↓</kbd> Naviguer
          </span>
          <span className="search-key-hint">
            <kbd>↵</kbd> Ouvrir
          </span>
          <span className="search-key-hint">
            <kbd>Esc</kbd> Fermer
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Composant interne : surligne le terme recherché dans un texte.
 *
 * @param {object} props
 * @param {string} props.text - Texte à afficher
 * @param {string} props.query - Terme recherché à surligner
 */
function HighlightedText({ text, query }) {
  if (!query) return <span>{text}</span>
  // Découpage du texte autour des occurrences du terme
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="search-highlight">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}
