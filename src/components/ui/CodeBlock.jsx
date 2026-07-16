import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Terminal } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useLang } from '../../context/LanguageContext'
import './CodeBlock.css'

/**
 * Bloc de code avec coloration syntaxique Python, bouton copier
 * et affichage optionnel d'une sortie JSON.
 *
 * @param {object} props
 * @param {string}  props.code        - Code Python à afficher
 * @param {string}  [props.language]  - Langage de coloration (défaut: 'python')
 * @param {string}  [props.output]    - Sortie JSON à afficher sous le code
 * @param {string}  [props.title]     - Titre du bloc (ex: "Arbitrage spatial")
 * @param {boolean} [props.showLines] - Afficher les numéros de lignes
 * @param {string}  [props.fileName]  - Nom de fichier affiché en en-tête
 */
export default function CodeBlock({
  code,
  language = 'python',
  output,
  title,
  showLines = false,
  fileName,
}) {
  const { isDark } = useTheme()
  const { t } = useLang()
  // État du bouton copier (false = normal, true = copié)
  const [copied, setCopied] = useState(false)

  /**
   * Copie le code dans le presse-papier et affiche le feedback.
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback pour les navigateurs sans clipboard API
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Sélection du thème de coloration selon le thème UI
  const highlightTheme = isDark ? oneDark : oneLight

  return (
    <div className="code-block">
      {/* En-tête : titre/nom de fichier + bouton copier */}
      <div className="code-block__header">
        <div className="code-block__meta">
          <Terminal size={14} className="code-block__lang-icon" aria-hidden="true" />
          <span className="code-block__lang">
            {fileName || language}
          </span>
          {title && <span className="code-block__title">{title}</span>}
        </div>
        <button
          className={`code-block__copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? t('common.copied') : t('common.copy_code')}
          title={copied ? t('common.copied') : t('common.copy_code')}
        >
          {copied
            ? <><Check size={14} /> {t('common.copied')}</>
            : <><Copy size={14} /> {t('common.copy_code')}</>
          }
        </button>
      </div>

      {/* Corps : code coloré */}
      <div className="code-block__body">
        <SyntaxHighlighter
          language={language}
          style={highlightTheme}
          showLineNumbers={showLines}
          customStyle={{
            margin: 0,
            padding: '1.25rem 1.5rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: 1.7,
          }}
          codeTagProps={{
            style: { fontFamily: 'var(--font-mono)' }
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>

      {/* Sortie optionnelle */}
      {output && (
        <div className="code-block__output">
          <div className="code-block__output-header">
            <span className="code-block__output-label">
              {t('common.output_label')}
            </span>
          </div>
          <SyntaxHighlighter
            language="json"
            style={highlightTheme}
            customStyle={{
              margin: 0,
              padding: '1rem 1.5rem',
              background: 'transparent',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
            }}
            codeTagProps={{
              style: { fontFamily: 'var(--font-mono)' }
            }}
          >
            {output.trim()}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  )
}
