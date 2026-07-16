import { useLang } from '../context/LanguageContext'
import { Bug, Lightbulb, FileText, FlaskConical } from 'lucide-react'
import './PageModule.css'

/**
 * Page Évolutions futures — roadmap par module, changelog et
 * guide de contribution.
 */
export default function Evolutions() {
  const { t } = useLang()

  // Roadmap par module
  const roadmap = {
    market: [
      { title: 'Intégration Prophet (Facebook)',
        desc: 'Remplacer la régression harmonique par Prophet pour capturer automatiquement les tendances et saisonnalités complexes.',
        status: 'progress', eta: '2026 Q3' },
      { title: 'Modèle LSTM de prévision de prix',
        desc: 'Modèle de réseau de neurones récurrents entraîné sur l\'historique WFP complet (2010–2026) pour les 20 marchés principaux.',
        status: 'planned', eta: '2026 Q4' },
      { title: 'Couverture Niger, Burkina Faso, Togo',
        desc: 'Étendre le catalogue des marchés aux pays voisins du Bénin. Données WFP disponibles pour ces pays.',
        status: 'planned', eta: '2027 Q1' },
      { title: 'API REST publique',
        desc: 'Exposer les fonctionnalités de kadi.market via une API REST (FastAPI) auto-hébergeable avec documentation OpenAPI.',
        status: 'planned', eta: '2027 Q2' },
    ],
    weather: [
      { title: 'Évapotranspiration Penman-Monteith',
        desc: 'Remplacer Hargreaves-Samani par la méthode Penman-Monteith FAO-56 complète pour plus de précision (nécessite données vent et humidité).',
        status: 'progress', eta: '2026 Q3' },
      { title: 'Données TAMSAT haute résolution',
        desc: 'Intégration de TAMSAT (3 km au lieu de 25 km pour CHIRPS) pour les prévisions sur petites parcelles.',
        status: 'planned', eta: '2026 Q4' },
      { title: 'Modèle de risque inondation',
        desc: 'Calcul du risque d\'inondation pour les zones fluviales (bassin de l\'Ouémé, Niger) à partir des données CHIRPS et MNT.',
        status: 'planned', eta: '2027 Q1' },
    ],
    kidas: [
      { title: 'Connecteur Google Sheets',
        desc: 'Source de données Google Sheets via l\'API gspread. Idéal pour les coopératives qui saisissent leurs données dans des tableurs partagés.',
        status: 'progress', eta: '2026 Q3' },
      { title: 'Détection d\'anomalies par ML',
        desc: 'Isolation Forest pour la détection d\'anomalies dans les séries de prix agricoles. Meilleure précision que IQR sur données saisonnières.',
        status: 'planned', eta: '2026 Q4' },
      { title: 'Export rapport HTML interactif',
        desc: 'Génération d\'un rapport HTML autonome (Plotly) à la place du JSON. Visualisations des tendances, boxplots, heatmaps qualité.',
        status: 'planned', eta: '2027 Q1' },
    ],
    general: [
      { title: 'Interface Web et Mobile',
        desc: 'Développement d\'une application web et mobile complète pour permettre aux acteurs sur le terrain d\'utiliser les outils KadiPy sans écrire de code.',
        status: 'planned', eta: '2026 Q4' },
      { title: 'Package R (kadipy-R)',
        desc: 'Portage des fonctionnalités principales en R pour les chercheurs. Interface reticulate + wrapper natif.',
        status: 'planned', eta: '2027 Q3' },
      { title: 'Mode microservice Docker',
        desc: 'Image Docker officielle pour déployer kadipy comme microservice dans une infrastructure AgriTech.',
        status: 'planned', eta: '2026 Q4' },
    ],
  }

  // Changelog des versions publiées
  const changelog = [
    { version: '1.0.0', date: '2026-01-15', type: 'major',
      changes: [
        'Publication initiale sur PyPI',
        'kadi.market : arbitrage, forecasting, logistics, backtesting',
        'kadi.weather : phénologie, hydrologie FAO-56, risques',
        'kadi.kidas : pipeline complet, 4 sources, cache SQLite',
        'Documentation complète (README + docstrings)',
        'Tests unitaires (92% de couverture)',
      ]},
  ]

  const statusLabel = {
    done:     t('evolutions.status_done'),
    progress: t('evolutions.status_progress'),
    planned:  t('evolutions.status_planned'),
  }

  const moduleLabel = {
    market:  'kadi.market',
    weather: 'kadi.weather',
    kidas:   'kadi.kidas',
    general: 'Général',
  }

  const moduleColor = {
    market:  'var(--module-market-color)',
    weather: 'var(--module-weather-color)',
    kidas:   'var(--module-kidas-color)',
    general: 'var(--color-muted)',
  }

  return (
    <div className="page-module">
      <div className="page-header">
        <div className="container">
          <span className="page-header__eyebrow">Roadmap</span>
          <h1 className="page-header__title">{t('evolutions.title')}</h1>
          <p className="page-header__sub">{t('evolutions.subtitle')}</p>
        </div>
      </div>

      <div className="container page-content">

        {/* Roadmap par module */}
        <section className="content-section" id="roadmap">
          <h2>{t('evolutions.roadmap_title')}</h2>
          {Object.entries(roadmap).map(([mod, items]) => (
            <div key={mod} className="roadmap-module">
              <h3 style={{ color: moduleColor[mod] }}>{moduleLabel[mod]}</h3>
              <div className="roadmap-items">
                {items.map((item, idx) => (
                  <div key={idx} className={`roadmap-item roadmap-item--${item.status}`}>
                    <div className="roadmap-item__header">
                      <span className={`badge badge--${item.status}`}>
                        {statusLabel[item.status]}
                      </span>
                      <span className="roadmap-item__eta">{item.eta}</span>
                    </div>
                    <h4 className="roadmap-item__title">{item.title}</h4>
                    <p className="roadmap-item__desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Comment contribuer */}
        <section className="content-section" id="contribuer">
          <h2>{t('evolutions.contribute_title')}</h2>
          <p className="lead-text">{t('evolutions.contribute_desc')}</p>
          <div className="contribute-grid">
            {[
              { icon: Bug, title: 'Signaler un bug',
                desc: 'Ouvrez une issue sur GitHub avec le message d\'erreur complet et un exemple reproductible.',
                link: 'https://github.com/delsDin/kadipy/issues', label: 'Ouvrir une issue' },
              { icon: Lightbulb, title: 'Suggérer une fonctionnalité',
                desc: 'Utilisez les GitHub Discussions pour proposer et débattre de nouvelles fonctionnalités.',
                link: 'https://github.com/delsDin/kadipy/discussions', label: 'Ouvrir une discussion' },
              { icon: FileText, title: 'Améliorer la documentation',
                desc: 'Corrections de typos, ajout d\'exemples, traduction. Toutes les contributions sont les bienvenues.',
                link: 'https://github.com/delsDin/kadipy/pulls', label: 'Créer une Pull Request' },
              { icon: FlaskConical, title: 'Ajouter des tests',
                desc: 'La couverture de tests est à 92%. Chaque nouveau test améliore la fiabilité du package.',
                link: 'https://github.com/delsDin/kadipy', label: 'Voir le dépôt' },
            ].map(item => (
              <div key={item.title} className="contribute-card">
                <item.icon className="contribute-card__icon" size={32} aria-hidden="true" />
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contribute-card__link"
                >
                  {item.label} →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Changelog */}
        <section className="content-section" id="changelog">
          <h2>{t('evolutions.changelog_title')}</h2>
          <div className="changelog">
            {changelog.map(entry => (
              <div key={entry.version} className={`changelog-entry changelog-entry--${entry.type}`}>
                <div className="changelog-entry__header">
                  <span className="changelog-entry__version">v{entry.version}</span>
                  <span className="changelog-entry__date">{entry.date}</span>
                  <span className={`badge badge--${entry.type === 'major' ? 'done' : 'progress'}`}>
                    {entry.type === 'major' ? 'Stable' : 'Bêta'}
                  </span>
                </div>
                <ul className="changelog-entry__changes">
                  {entry.changes.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
