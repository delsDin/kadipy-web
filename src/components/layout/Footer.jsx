import { Link } from 'react-router-dom'
import { Github, Heart } from 'lucide-react'
import kadipyLogo from '../../images/kadipy.png'
import { useLang } from '../../context/LanguageContext'
import './Footer.css'

/**
 * Pied de page commun de la plateforme KadiPy.
 *
 * Affiche les liens de navigation, les informations du projet
 * et les liens externes (GitHub, documentation).
 */
export default function Footer() {
  const { t } = useLang()

  // Colonnes de liens du footer
  const columns = [
    {
      title: 'Modules',
      links: [
        { to: '/market',  label: 'kadi.market' },
        { to: '/weather', label: 'kadi.weather' },
        { to: '/kidas',   label: 'kadi.kidas' },
      ],
    },
    {
      title: 'Documentation',
      links: [
        { to: '/pourquoi',  label: t('navbar.why') },
        { to: '/demarrage', label: t('navbar.start') },
        { to: '/exemples',  label: t('navbar.examples') },
      ],
    },
    {
      title: 'Projet',
      links: [
        { to: '/evolutions', label: t('navbar.evolutions') },
        { to: '/contact',    label: t('navbar.contact') },
        { href: 'https://github.com/delsDin/kadipy', label: 'GitHub', external: true },
      ],
    },
  ]

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        {/* Colonne logo + description */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src={kadipyLogo} alt="" aria-hidden="true" style={{ height: '20px', width: 'auto', marginRight: '6px' }} />
            <span>KadiPy</span>
          </Link>
          <p className="footer__tagline">{t('footer.tagline')}</p>
          <div className="footer__badges">
            <span className="footer__badge">{t('footer.version')} 1.0.0</span>
            <span className="footer__badge">{t('footer.license')}</span>
            <span className="footer__badge">Python ≥ 3.9</span>
          </div>
          <a
            href="https://github.com/delsDin/kadipy"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__github"
            aria-label="Voir KadiPy sur GitHub"
          >
            <Github size={18} aria-hidden="true" />
            GitHub
          </a>
        </div>

        {/* Colonnes de liens */}
        {columns.map(col => (
          <div key={col.title} className="footer__col">
            <h3 className="footer__col-title">{col.title}</h3>
            <ul className="footer__links">
              {col.links.map(link => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer__link"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.to} className="footer__link">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Ligne du bas */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span className="footer__copy">
            © 2026 KadiPy · {t('footer.made_by')}{' '}
            <a
              href="https://github.com/delsDin"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__author"
            >
              Dels Dinla
            </a>
          </span>
          <span className="footer__love">
            {/* Texte intentionnellement minimaliste */}
            <Heart size={12} aria-hidden="true" /> Agriculture africaine
          </span>
        </div>
      </div>
    </footer>
  )
}
