import { createContext, useContext, useState, useEffect } from 'react'
import fr from '../i18n/fr.json'
import en from '../i18n/en.json'

// Dictionnaire des traductions disponibles
const TRANSLATIONS = { fr, en }

// Contexte de langue
const LanguageContext = createContext(null)

/**
 * Fournisseur du contexte de langue (FR / EN).
 *
 * Lit la préférence sauvegardée dans localStorage ou détecte la
 * langue du navigateur. Expose la fonction de traduction `t(key)`
 * qui retourne la chaîne correspondante dans la langue active.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Arbre React enfant
 */
export function LanguageProvider({ children }) {
  // Initialisation de la langue depuis localStorage ou navigateur
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('kadi-lang')
    if (saved && TRANSLATIONS[saved]) return saved
    const browserLang = navigator.language?.slice(0, 2)
    return TRANSLATIONS[browserLang] ? browserLang : 'fr'
  })

  // Mise à jour de l'attribut lang du HTML et sauvegarde
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    localStorage.setItem('kadi-lang', lang)
  }, [lang])

  /**
   * Retourne la chaîne traduite pour la clé donnée.
   * Supporte les chemins imbriqués (ex: "navbar.search").
   *
   * @param {string} key - Clé de traduction (peut contenir des points)
   * @param {object} [vars={}] - Variables à interpoler dans la chaîne
   * @returns {string} La chaîne traduite ou la clé en cas d'absence
   */
  const t = (key, vars = {}) => {
    const keys = key.split('.')
    // Parcours du dictionnaire imbriqué
    let value = TRANSLATIONS[lang]
    for (const k of keys) {
      value = value?.[k]
    }
    // Fallback sur le français si la clé est absente en anglais
    if (value === undefined && lang !== 'fr') {
      let fallback = TRANSLATIONS.fr
      for (const k of keys) {
        fallback = fallback?.[k]
      }
      value = fallback
    }
    if (typeof value !== 'string') return key

    // Interpolation des variables {{var}}
    return value.replace(/\{\{(\w+)\}\}/g, (_, v) => vars[v] ?? `{{${v}}}`)
  }

  /**
   * Bascule entre FR et EN.
   */
  const toggleLang = () => {
    setLang(prev => prev === 'fr' ? 'en' : 'fr')
  }

  /**
   * Définit la langue manuellement.
   * @param {'fr'|'en'} newLang
   */
  const setLanguage = (newLang) => {
    if (TRANSLATIONS[newLang]) setLang(newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, setLanguage, isFr: lang === 'fr' }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook pour accéder au contexte de langue.
 *
 * @returns {{ lang: string, t: function, toggleLang: function, setLanguage: function, isFr: boolean }}
 */
export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang doit être utilisé dans LanguageProvider')
  return ctx
}
