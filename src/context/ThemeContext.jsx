import { createContext, useContext, useState, useEffect } from 'react'

// Contexte de gestion du thème clair/sombre
const ThemeContext = createContext(null)

/**
 * Fournisseur du contexte de thème.
 *
 * Lit la préférence sauvegardée dans localStorage, puis le
 * préférence système (prefers-color-scheme). Applique l'attribut
 * data-theme sur le document HTML pour activer les variables CSS
 * du thème sombre.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Arbre React enfant
 */
export function ThemeProvider({ children }) {
  // Initialisation depuis localStorage ou préférence système
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('kadi-theme')
    if (saved) return saved
    // Détection de la préférence système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  // Application du thème sur le document HTML à chaque changement
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
    // Sauvegarde dans localStorage pour persistance
    localStorage.setItem('kadi-theme', theme)
  }, [theme])

  // Bascule entre les deux thèmes
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook pour accéder au contexte de thème.
 *
 * @returns {{ theme: string, toggleTheme: function, isDark: boolean }}
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme doit être utilisé dans ThemeProvider')
  return ctx
}
