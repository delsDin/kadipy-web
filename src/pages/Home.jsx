import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Cloud, Database, ArrowRight, Github,
  Zap, CheckCircle, XCircle,
  Users, Code2, Microscope, Handshake, Leaf
} from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import CodeBlock from '../components/ui/CodeBlock'
import arbitrageData from '../data/real-outputs/market-arbitrage.json'
import kadipyVideo from '../images/kadipy.mp4'
import './Home.css'

/* ============================================================
   CODE D'EXEMPLE POUR LE HERO
   ============================================================ */
const HERO_CODE = `from kadi.weather import WeatherSession
from kadi.market import Market

# Initialisation — détection automatique de la zone agro-écologique
session = WeatherSession(latitude=9.33, longitude=2.63, name="Parakou")
marche  = Market(latitude=9.30, longitude=2.08,
                 location="Parakou", weather_session=session)

# Recommandation d'arbitrage spatial avec intégration météo
resultat = marche.decision_support.arbitrage_decision(
    crop="maize",         # Culture : maïs
    origine="Parakou",    # Marché de départ
    destination="Cotonou",# Marché cible
    qty_tons=10.0,        # Quantité en tonnes
)

print(resultat["recommandation"])       # VENDRE — Le transfert est rentable.
print(f"Confiance : {resultat['confidence_score']:.0%}")  # Confiance : 74%
print(f"Gain net  : {resultat['gain_net_xof']:,} XOF")    # 185 000 XOF`

/* ============================================================
   STATISTIQUES ANIMÉES
   ============================================================ */
function AnimatedCounter({ target, suffix = '', label }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    // Observer pour déclencher l'animation quand l'élément est visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const steps = 50
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} className="stat-item">
      <span className="stat-number">
        {count.toLocaleString('fr-FR')}{suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

/* ============================================================
   CARTE DE MODULE
   ============================================================ */
function ModuleCard({ icon: Icon, title, desc, to, color, codeSnippet }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      to={to}
      className="module-card"
      style={{ '--module-color': color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="module-card__icon">
        <Icon size={28} aria-hidden="true" />
      </div>
      <h3 className="module-card__title">{title}</h3>
      <p className="module-card__desc">{desc}</p>
      {hovered && codeSnippet && (
        <pre className="module-card__snippet">{codeSnippet}</pre>
      )}
      <div className="module-card__arrow">
        En savoir plus <ArrowRight size={14} aria-hidden="true" />
      </div>
    </Link>
  )
}

/* ============================================================
   CARTE DE PROFIL UTILISATEUR
   ============================================================ */
function ProfileCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="profile-card" style={{ '--profile-color': color }}>
      <div className="profile-card__icon">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h4 className="profile-card__title">{title}</h4>
      <p className="profile-card__desc">{desc}</p>
    </div>
  )
}

/* ============================================================
   CARTE AVANT / APRÈS
   ============================================================ */
function BeforeAfterCard({ before, after }) {
  const { t } = useLang()
  return (
    <div className="ba-grid">
      <div className="ba-col ba-col--before">
        <div className="ba-col__header">
          <XCircle size={16} aria-hidden="true" />
          {t('home.before_title')}
        </div>
        <ul className="ba-list">
          {before.map((item, i) => (
            <li key={i} className="ba-list__item ba-list__item--before">
              <XCircle size={14} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="ba-col ba-col--after">
        <div className="ba-col__header">
          <CheckCircle size={16} aria-hidden="true" />
          {t('home.after_title')}
        </div>
        <ul className="ba-list">
          {after.map((item, i) => (
            <li key={i} className="ba-list__item ba-list__item--after">
              <CheckCircle size={14} aria-hidden="true" />
              <code>{item}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ============================================================
   CARTE SVG — BÉNIN (simplifiée)
   ============================================================ */
function BeninMap() {
  // Marchés principaux avec coordonnées relatives pour le SVG
  const markets = [
    { name: 'Malanville',  x: 68, y: 4,  zone: 'nord' },
    { name: 'Kandi',       x: 60, y: 14, zone: 'nord' },
    { name: 'Natitingou',  x: 22, y: 18, zone: 'nord' },
    { name: 'Parakou',     x: 55, y: 34, zone: 'centre' },
    { name: 'Djougou',     x: 30, y: 30, zone: 'centre' },
    { name: 'Abomey',      x: 42, y: 62, zone: 'centre' },
    { name: 'Bohicon',     x: 44, y: 68, zone: 'centre' },
    { name: 'Porto-Novo',  x: 62, y: 86, zone: 'sud' },
    { name: 'Cotonou',     x: 50, y: 92, zone: 'sud' },
    { name: 'Lokossa',     x: 28, y: 80, zone: 'sud' },
  ]

  const zoneColors = {
    nord:   'var(--module-weather-color)',
    centre: 'var(--color-primary)',
    sud:    'var(--color-accent)',
  }

  return (
    <div className="benin-map" aria-label="Carte du Bénin avec les marchés KadiPy">
      <svg viewBox="0 0 100 100" className="benin-svg" role="img" aria-hidden="true">
        {/* Fond stylisé du Bénin */}
        <rect x="10" y="2" width="75" height="96" rx="8" ry="8"
          fill="var(--color-surface-2)"
          stroke="var(--color-border)"
          strokeWidth="0.5"
        />
        {/* Zones colorées */}
        <rect x="10" y="2"  width="75" height="38" rx="8" ry="8"
          fill="hsla(210, 85%, 52%, 0.08)" />
        <rect x="10" y="40" width="75" height="28"
          fill="hsla(145, 58%, 33%, 0.08)" />
        <rect x="10" y="68" width="75" height="30" rx="0" ry="0"
          fill="hsla(38, 88%, 46%, 0.08)" />
        {/* Points des marchés */}
        {markets.map(m => (
          <g key={m.name}>
            <circle
              cx={m.x}
              cy={m.y}
              r="2.2"
              fill={zoneColors[m.zone]}
              opacity="0.9"
            />
            <circle
              cx={m.x}
              cy={m.y}
              r="4"
              fill={zoneColors[m.zone]}
              opacity="0.18"
            />
          </g>
        ))}
      </svg>
      {/* Légende */}
      <div className="benin-legend">
        <span className="benin-legend__item" style={{ '--lc': 'var(--module-weather-color)' }}>
          Nord — Sivakumar
        </span>
        <span className="benin-legend__item" style={{ '--lc': 'var(--color-primary)' }}>
          Centre — Sivakumar
        </span>
        <span className="benin-legend__item" style={{ '--lc': 'var(--color-accent)' }}>
          Sud — Walter-Anyadike
        </span>
      </div>
    </div>
  )
}

/* ============================================================
   BANDE DE LOGOS TECHNOLOGIES
   ============================================================ */
function TechBadge({ name, color }) {
  return (
    <span className="tech-badge" style={{ '--tc': color }}>
      {name}
    </span>
  )
}

/* ============================================================
   PAGE D'ACCUEIL
   ============================================================ */
export default function Home() {
  const { t } = useLang()

  // Données réelles pour l'affichage JSON
  const outputJson = JSON.stringify({
    recommandation: arbitrageData.recommandation,
    confidence_score: arbitrageData.confidence_score,
    gain_net_xof: arbitrageData.gain_net_xof,
    gain_net_percent: `${arbitrageData.gain_net_percent}%`,
    details: {
      prix_origine:    `${arbitrageData.details.prix_origine_xof_kg} XOF/kg`,
      prix_destination:`${arbitrageData.details.prix_destination_xof_kg} XOF/kg`,
      distance_km:      arbitrageData.details.distance_km,
      cout_transfert:  `${arbitrageData.details.cout_transfert_total_xof.toLocaleString('fr-FR')} XOF`,
      ajustement_pluie: arbitrageData.details.meteo.impact,
    }
  }, null, 2)

  return (
    <div className="home">

      {/* ====================================================
          HERO
          ==================================================== */}
      <section className="hero section" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__content">
            {/* Badges */}
            <div className="hero__badges">
              <span className="hero__badge hero__badge--version">
                {t('home.hero_version')}
              </span>
              <span className="hero__badge hero__badge--license">
                {t('home.hero_license')}
              </span>
              <span className="hero__badge hero__badge--python">
                {t('home.hero_python')}
              </span>
            </div>

            {/* Titre principal */}
            <h1 id="hero-title" className="hero__title">
              {t('home.hero_tagline')}
            </h1>

            {/* Sous-titre */}
            <p className="hero__sub">{t('home.hero_sub')}</p>

            {/* CTA */}
            <div className="hero__ctas">
              <Link to="/demarrage" id="hero-cta-start" className="btn btn--primary btn--lg">
                <Zap size={18} aria-hidden="true" />
                {t('home.hero_cta_start')}
              </Link>
              <Link to="/exemples" id="hero-cta-examples" className="btn btn--secondary btn--lg">
                {t('home.hero_cta_examples')}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                href="https://github.com/delsDin/kadipy"
                target="_blank"
                rel="noopener noreferrer"
                id="hero-cta-github"
                className="btn btn--ghost btn--lg"
                aria-label="Voir KadiPy sur GitHub"
              >
                <Github size={18} aria-hidden="true" />
                {t('home.hero_cta_github')}
              </a>
            </div>

            {/* Commande d'installation */}
            <div className="hero__install">
              <code className="hero__install-cmd">pip install kadipy</code>
            </div>
          </div>

          {/* Code exemple dans le hero */}
          <div className="hero__code">
            <CodeBlock
              code={HERO_CODE}
              language="python"
              output={outputJson}
              fileName="exemple_arbitrage.py"
            />
          </div>
        </div>
      </section>

      {/* ====================================================
          DÉMO VIDÉO
          ==================================================== */}
      <section className="video-section section" aria-label="Vidéo de présentation" style={{ padding: '0 0 var(--space-20) 0' }}>
        <div className="container">
          <div className="video-wrapper" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <video 
              src={kadipyVideo} 
              controls 
              autoPlay 
              muted 
              loop 
              playsInline
              style={{ width: '100%', display: 'block', backgroundColor: 'var(--color-surface)' }}
            >
              Votre navigateur ne supporte pas la balise vidéo.
            </video>
          </div>
        </div>
      </section>

      {/* ====================================================
          BANDE DE TECHNOLOGIES
          ==================================================== */}
      <section className="tech-band" aria-label="Technologies intégrées">
        <div className="container">
          <p className="tech-band__label">Intégré avec</p>
          <div className="tech-band__logos">
            <TechBadge name="WFP DataBridges" color="hsl(210, 70%, 50%)" />
            <TechBadge name="Open-Meteo"      color="hsl(195, 72%, 46%)" />
            <TechBadge name="CHIRPS"          color="hsl(145, 58%, 38%)" />
            <TechBadge name="OSRM"            color="hsl(28, 75%, 48%)" />
            <TechBadge name="scikit-learn"    color="hsl(30, 88%, 52%)" />
            <TechBadge name="pandas"          color="hsl(210, 85%, 52%)" />
            <TechBadge name="Nominatim/OSM"   color="hsl(88, 60%, 42%)" />
            <TechBadge name="SQLite"          color="hsl(220, 60%, 48%)" />
          </div>
        </div>
      </section>

      {/* ====================================================
          STATISTIQUES
          ==================================================== */}
      <section className="stats-section section--sm" aria-label="Statistiques KadiPy">
        <div className="container">
          <div className="stats-grid">
            <AnimatedCounter target={3}   label={t('home.stats_modules')} />
            <AnimatedCounter target={30}  suffix="+" label={t('home.stats_methods')} />
            <AnimatedCounter target={9}   label={t('home.stats_markets')} />
            <AnimatedCounter target={100} suffix="%" label={t('home.stats_offline')} />
          </div>
        </div>
      </section>

      {/* ====================================================
          LES 3 MODULES
          ==================================================== */}
      <section className="modules-section section" aria-labelledby="modules-title">
        <div className="container">
          <div className="section-header text-center">
            <h2 id="modules-title">{t('home.modules_title')}</h2>
            <p>{t('home.modules_sub')}</p>
          </div>
          <div className="modules-grid grid-3">
            <ModuleCard
              icon={TrendingUp}
              title="kadi.market"
              desc={t('home.market_desc')}
              to="/market"
              color="var(--module-market-color)"
              codeSnippet={`Market().decision_support\n  .arbitrage_decision(\n    crop="maize",\n    origine="Parakou",\n    destination="Cotonou"\n  )`}
            />
            <ModuleCard
              icon={Cloud}
              title="kadi.weather"
              desc={t('home.weather_desc')}
              to="/weather"
              color="var(--module-weather-color)"
              codeSnippet={`WeatherSession(lat=9.33, lon=2.63)\n  .onset()\n  .water_balance(\n    crop="maize",\n    soil_type="ferrugineux"\n  )`}
            />
            <ModuleCard
              icon={Database}
              title="kadi.kidas"
              desc={t('home.kidas_desc')}
              to="/kidas"
              color="var(--module-kidas-color)"
              codeSnippet={`DataPipeline()\n  .load_data("recoltes.xlsx")\n  .add_cleaning_step(...)\n  .add_normalization_step(...)\n  .execute(cache=True)`}
            />
          </div>
        </div>
      </section>

      {/* ====================================================
          POUR QUI — PROFILS
          ==================================================== */}
      <section className="profiles-section section" aria-labelledby="profiles-title">
        <div className="container">
          <div className="section-header text-center">
            <h2 id="profiles-title">{t('home.for_who_title')}</h2>
            <p>{t('home.for_who_sub')}</p>
          </div>
          <div className="profiles-grid grid-4">
            <ProfileCard
              icon={Code2}
              title={t('home.profile_dev_title')}
              desc={t('home.profile_dev_desc')}
              color="var(--module-market-color)"
            />
            <ProfileCard
              icon={Leaf}
              title={t('home.profile_agro_title')}
              desc={t('home.profile_agro_desc')}
              color="var(--color-primary)"
            />
            <ProfileCard
              icon={Microscope}
              title={t('home.profile_researcher_title')}
              desc={t('home.profile_researcher_desc')}
              color="var(--module-weather-color)"
            />
            <ProfileCard
              icon={Handshake}
              title={t('home.profile_advisor_title')}
              desc={t('home.profile_advisor_desc')}
              color="var(--module-kidas-color)"
            />
          </div>
        </div>
      </section>

      {/* ====================================================
          CARTE DU BÉNIN
          ==================================================== */}
      <section className="map-section section" aria-labelledby="map-title">
        <div className="container">
          <div className="map-inner">
            <div className="map-text">
              <h2 id="map-title">{t('home.map_title')}</h2>
              <p>{t('home.map_sub')}</p>
              <div className="map-markets">
                {['Dantokpa', 'Parakou', 'Bohicon', 'Kandi',
                  'Natitingou', 'Malanville', 'Abomey',
                  'Porto-Novo', 'Lokossa'].map(m => (
                  <span key={m} className="market-tag">{m}</span>
                ))}
              </div>
            </div>
            <BeninMap />
          </div>
        </div>
      </section>

      {/* ====================================================
          AVANT / APRÈS
          ==================================================== */}
      <section className="ba-section section" aria-labelledby="ba-title">
        <div className="container">
          <div className="section-header text-center">
            <h2 id="ba-title">{t('home.before_after_title')}</h2>
          </div>
          <BeforeAfterCard
            before={[
              t('home.before_1'),
              t('home.before_2'),
              t('home.before_3'),
              t('home.before_4'),
            ]}
            after={[
              t('home.after_1'),
              t('home.after_2'),
              t('home.after_3'),
              t('home.after_4'),
            ]}
          />
        </div>
      </section>

      {/* ====================================================
          CTA FINAL
          ==================================================== */}
      <section className="cta-section section" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-box">
            <h2 id="cta-title">{t('home.cta_title')}</h2>
            <p>{t('home.cta_sub')}</p>
            <div className="cta-install">
              <code>{t('home.cta_install')}</code>
            </div>
            <div className="cta-btns">
              <Link to="/demarrage" className="btn btn--primary btn--lg">
                {t('home.cta_docs')}
              </Link>
              <a
                href="https://github.com/delsDin/kadipy"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost btn--lg"
              >
                <Github size={18} aria-hidden="true" />
                {t('home.cta_github')}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
