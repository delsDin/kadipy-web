import { useLang } from '../context/LanguageContext'
import { Wifi, RefreshCw, Puzzle, Globe, BarChart, WifiOff, Repeat } from 'lucide-react'
import CodeBlock from '../components/ui/CodeBlock'
import './PageModule.css'

/**
 * Page "Pourquoi KadiPy" — contexte, problème résolu, vision,
 * profils utilisateurs et chronologie de développement.
 */
export default function Pourquoi() {
  const { t } = useLang()

  // Chronologie des phases de développement
  const timeline = [
    { phase: 'Phase 1', title: 'kadi.weather', date: '2026 Q2',
      desc: 'Première version du module météo. WeatherSession, prévisions Open-Meteo, phénologie Sivakumar.',
      status: 'done' },
    { phase: 'Phase 2', title: 'kadi.market', date: '2026 Q3',
      desc: 'Module marché : WFP DataBridges, pricing, forecasting, logistics OSRM.',
      status: 'done' },
    { phase: 'Phase 3', title: 'kadi.kidas', date: '2026 Q3',
      desc: 'Pipeline de traitement des données : sources multiples, nettoyage, validation, normalisation.',
      status: 'done' },
    { phase: 'Phase 4', title: 'Intégration météo × marché', date: '2026 Q3',
      desc: 'Couplage weather et market : gamma_route météo, confidence_score composite, backtesting.',
      status: 'done' },
    { phase: 'v1.0.0', title: 'Publication PyPI', date: '2026 Q3',
      desc: 'Première version stable publiée sur PyPI. Documentation complète et tests complets.',
      status: 'done' },
  ]

  // Principes de conception
  const principles = [
    {
      icon: Wifi,
      title: t('why.offline_title'),
      desc: t('why.offline_desc'),
    },
    {
      icon: RefreshCw,
      title: t('why.fallback_title'),
      desc: t('why.fallback_desc'),
    },
    {
      icon: Puzzle,
      title: t('why.intuitive_title'),
      desc: t('why.intuitive_desc'),
    },
    {
      icon: Globe,
      title: t('why.benin_title'),
      desc: t('why.benin_desc'),
    },
  ]

  return (
    <div className="page-module">

      {/* En-tête de page */}
      <div className="page-header">
        <div className="container">
          <span className="page-header__eyebrow">Vision</span>
          <h1 className="page-header__title">{t('why.title')}</h1>
        </div>
      </div>

      <div className="container page-content">

        {/* Le problème */}
        <section className="content-section" id="probleme">
          <h2>{t('why.problem_title')}</h2>
          <p className="lead-text">{t('why.problem_desc')}</p>
          <div className="problem-grid">
            {[
              { icon: BarChart, title: 'Données fragmentées',
                desc: 'WFP VAM, Open-Meteo, CHIRPS, MAEP : quatre APIs, quatre formats, quatre pipelines à maintenir.' },
              { icon: WifiOff, title: 'Connectivité limitée',
                desc: 'Dans les zones rurales du Nord-Bénin, la connexion internet est intermittente. Les outils existants ne gèrent pas cela.' },
              { icon: Repeat, title: 'Travail répété',
                desc: 'Chaque chercheur et chaque startup AgriTech recrée les mêmes outils de normalisation des cultures et des unités.' },
              { icon: Globe, title: 'Hors contexte africain',
                desc: 'Les outils agricoles génériques ne connaissent pas le tiya, le sac de 80 kg, ni les marchés de Malanville ou Kandi.' },
            ].map(item => (
              <div key={item.title} className="problem-card">
                <item.icon className="problem-card__icon" size={28} aria-hidden="true" />
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* La solution */}
        <section className="content-section" id="solution">
          <h2>{t('why.solution_title')}</h2>
          <p className="lead-text">{t('why.solution_desc')}</p>
          <CodeBlock
            code={`# Une seule ligne pour accéder aux données météo offline-first
from kadi.weather import WeatherSession
session = WeatherSession(latitude=9.33, longitude=2.63, name="Parakou")

# La même chose pour les marchés agricoles
from kadi.market import Market
marche = Market(latitude=9.30, longitude=2.08, location="Parakou")

# Et pour nettoyer des données de terrain
import kadi.kidas as kidas
df, rapport = kidas.load_and_clean("recoltes_maep_2024.csv")`}
            language="python"
            title="Philosophie : une API unifiée"
          />
        </section>

        {/* Principes */}
        <section className="content-section" id="principes">
          <h2>{t('why.principles_title')}</h2>
          <div className="principles-grid">
            {principles.map(p => (
              <div key={p.title} className="principle-card">
                <p.icon className="principle-card__icon" size={28} aria-hidden="true" />
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Chronologie */}
        <section className="content-section" id="chronologie">
          <h2>{t('why.timeline_title')}</h2>
          <div className="timeline">
            {timeline.map((item, idx) => (
              <div key={idx} className={`timeline-item timeline-item--${item.status}`}>
                <div className="timeline-item__marker">
                  <span className="timeline-item__phase">{item.phase}</span>
                </div>
                <div className="timeline-item__content">
                  <div className="timeline-item__header">
                    <h4>{item.title}</h4>
                    <span className="timeline-item__date">{item.date}</span>
                  </div>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
