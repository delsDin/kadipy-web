import { Github, MessageCircle, Mail, Linkedin, Phone, Globe } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import './PageModule.css'

/**
 * Page Contact — informations de contact (LinkedIn, Email, etc.),
 * liens GitHub et informations pour les partenaires AgriTech.
 */
export default function Contact() {
  const { t } = useLang()

  return (
    <div className="page-module">
      <div className="page-header">
        <div className="container">
          <span className="page-header__eyebrow">Contact</span>
          <h1 className="page-header__title">{t('contact.title')}</h1>
          <p className="page-header__sub">{t('contact.subtitle')}</p>
        </div>
      </div>

      <div className="container page-content">
        <div className="contact-layout">

          {/* Coordonnées */}
          <section className="content-section contact-details-section">
            <div className="contact-card contact-card--main" style={{ border: 'none', background: 'transparent', padding: 0 }}>
              <h2>Mes coordonnées</h2>
              <p className="lead-text">N'hésitez pas à me contacter pour toute opportunité de collaboration, projet AgriTech, ou simplement pour échanger.</p>
              
              <div className="contact-links" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <a href="mailto:delsmarceldinla@gmail.com" className="contact-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', padding: '16px 20px' }}>
                  <Mail size={24} aria-hidden="true" />
                  Email
                </a>
                <a href="tel:+2290153024367" className="contact-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', padding: '16px 20px' }}>
                  <Phone size={24} aria-hidden="true" />
                  Téléphone
                </a>
                <a href="https://linkedin.com/in/marcel-dinla" className="contact-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', padding: '16px 20px' }}>
                  <Linkedin size={24} aria-hidden="true" />
                  LinkedIn
                </a>
                <a href="https://denflow.xyz" className="contact-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.1rem', padding: '16px 20px' }}>
                  <Globe size={24} aria-hidden="true" />
                  Portfolio
                </a>
              </div>
            </div>
          </section>

          {/* Panneau latéral */}
          <aside className="contact-sidebar">

            {/* Liens GitHub */}
            <div className="contact-card">
              <h3>GitHub</h3>
              <p>Pour les bugs et questions techniques, GitHub est le canal préféré.</p>
              <div className="contact-links">
                <a
                  href="https://github.com/delsDin/kadipy/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  id="github-issues-link"
                >
                  <Github size={16} aria-hidden="true" />
                  {t('contact.github_issues')}
                </a>
                <a
                  href="https://github.com/delsDin/kadipy/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                  id="github-discussions-link"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  {t('contact.github_discussions')}
                </a>
              </div>
            </div>

            {/* Partenaires AgriTech */}
            <div className="contact-card contact-card--accent">
              <span className="contact-card__tag">AgriTech</span>
              <h3>{t('contact.partners_title')}</h3>
              <p>{t('contact.partners_desc')}</p>
              <div className="agritech-logos">
                <span className="agritech-badge">🌱 Startups AgriTech</span>
                <span className="agritech-badge">🏛️ ONG & Institutions</span>
                <span className="agritech-badge">🔬 Universités</span>
                <span className="agritech-badge">🤝 Coopératives</span>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}
