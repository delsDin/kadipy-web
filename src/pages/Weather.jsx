import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import CodeBlock from '../components/ui/CodeBlock'
import './PageModule.css'

/**
 * Page de documentation du module kadi.weather.
 */
export default function Weather() {
  const { t } = useLang()
  const [tab, setTab] = useState('phenology')

  const tabs = [
    { id: 'phenology',  label: t('weather.tab_phenology') },
    { id: 'hydrology',  label: t('weather.tab_hydrology') },
    { id: 'risk',       label: t('weather.tab_risk') },
    { id: 'data',       label: t('weather.tab_data') },
  ]

  // Zones agro-écologiques du Bénin
  const zones = [
    { name: 'Zone Nord', cities: ['Malanville', 'Kandi', 'Natitingou'],
      algo: 'Sivakumar', color: 'var(--module-weather-color)',
      desc: 'Climat soudano-sahélien. Une saison des pluies (mai–oct). Algorithme Sivakumar.' },
    { name: 'Zone Centre', cities: ['Parakou', 'Djougou', 'Abomey'],
      algo: 'Sivakumar', color: 'var(--color-primary)',
      desc: 'Climat soudano-guinéen. Une saison des pluies (avr–oct). Transition.' },
    { name: 'Zone Sud', cities: ['Cotonou', 'Porto-Novo', 'Lokossa'],
      algo: 'Walter-Anyadike', color: 'var(--color-accent)',
      desc: 'Climat subéquatorial. Deux saisons des pluies (avr–juil & sept–nov).' },
  ]

  return (
    <div className="page-module">
      <div className="page-header">
        <div className="container">
          <span className="page-header__module page-header__module--weather">Module</span>
          <h1 className="page-header__title">{t('weather.title')}</h1>
          <p className="page-header__sub">{t('weather.desc')}</p>
        </div>
      </div>

      <div className="container page-content">

        {/* Architecture */}
        <section className="content-section" id="architecture">
          <h2>{t('weather.arch_title')}</h2>
          <div className="arch-diagram">
{`WeatherSession(latitude, longitude, name)
├── .forecast(days=7)                           → list[dict]
├── .historical(metric, months_back=12)          → DataFrame
├── .phenology
│   ├── .onset()                                 → dict
│   ├── .cessation()                             → dict
│   ├── .growing_degree_days(crop, start_date)   → DataFrame
│   └── .sowing_window(crop)                     → dict
├── .hydrology
│   ├── .water_balance(crop, soil_type)          → dict
│   ├── .evapotranspiration()                    → float
│   └── .potential_evapotranspiration()          → float
└── .risk
    ├── .drought_index(method, window_months)    → dict
    ├── .rain_probability(days_ahead)            → float
    └── .temperature_stress(crop)               → dict`}
          </div>
        </section>

        {/* Zones agro-écologiques */}
        <section className="content-section" id="zones">
          <h2>{t('weather.zones_title')}</h2>
          <div className="zones-grid">
            {zones.map(z => (
              <div key={z.name} className="zone-card" style={{ '--zc': z.color }}>
                <div className="zone-card__header">
                  <span className="zone-card__name">{z.name}</span>
                  <span className="zone-card__algo">Algo : {z.algo}</span>
                </div>
                <p className="zone-card__desc">{z.desc}</p>
                <div className="zone-card__cities">
                  {z.cities.map(c => <span key={c} className="zone-city">{c}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Onglets */}
        <section className="content-section" id="modules-weather">
          <div className="tabs">
            <div className="tabs__nav" role="tablist">
              {tabs.map(t_item => (
                <button
                  key={t_item.id}
                  className={`tab-btn ${tab === t_item.id ? 'active' : ''}`}
                  onClick={() => setTab(t_item.id)}
                  role="tab"
                  aria-selected={tab === t_item.id}
                >
                  {t_item.label}
                </button>
              ))}
            </div>

            {tab === 'phenology' && (
              <div id="phenology" className="tab-content">
                <h3>Phénologie — Démarrage de saison et GDD</h3>
                <p className="lead-text">
                  Détecte le démarrage de la saison des pluies, estime la date de semis
                  optimale et calcule les degrés-jours de croissance.
                </p>
                <CodeBlock
                  code={`from kadi.weather import WeatherSession

# Zone nord — algorithme Sivakumar
session_nord = WeatherSession(latitude=9.33, longitude=2.63, name="Parakou")

# Démarrage de la saison des pluies
onset = session_nord.phenology.onset()
print(f"Début de saison  : {onset['date']}")
print(f"DOY              : {onset['doy']}")
print(f"Fiabilité        : {onset['reliability']}")
# → Début de saison : 2026-04-22
# → DOY : 112
# → Fiabilité : haute (critère 10mm/3j suivi de 20mm/10j satisfait)

# Fenêtre de semis optimale pour le maïs
fenetre = session_nord.phenology.sowing_window(crop="maize")
print(f"Semis optimal    : {fenetre['optimal_date']}")
print(f"Fenêtre          : {fenetre['window_start']} → {fenetre['window_end']}")

# Degrés-Jours de Croissance maïs (base 10°C)
gdd_df = session_nord.phenology.growing_degree_days(
    crop="maize",
    start_date="2026-05-01"
)
print(gdd_df[['date', 'gdd_cumul', 'stage']].head(10))`}
                  language="python"
                  output={`date          gdd_cumul  stage
2026-05-01     12.4       Germination
2026-05-05     58.2       Levée
2026-05-15    148.7       Tallage
2026-05-25    274.1       Montaison
...`}
                />
              </div>
            )}

            {tab === 'hydrology' && (
              <div id="hydrology" className="tab-content">
                <h3>Hydrologie — Bilan hydrique FAO-56</h3>
                <p className="lead-text">
                  Calcul de l'évapotranspiration (Hargreaves-Samani) et du bilan hydrique
                  selon la méthode FAO-56, adapté aux sols béninois.
                </p>
                <CodeBlock
                  code={`session = WeatherSession(latitude=10.32, longitude=1.38, name="Natitingou")

# Bilan hydrique pour du coton (sol ferrugineux tropical)
bilan = session.hydrology.water_balance(
    crop="cotton",
    soil_type="ferrugineux",
)

print(f"ET0 (Hargreaves-Samani) : {bilan['et0_mm_day']:.2f} mm/j")
print(f"ETc culture             : {bilan['etc_mm_day']:.2f} mm/j")
print(f"Précip efficaces        : {bilan['precip_eff_mm']:.1f} mm")
print(f"Déficit hydrique        : {bilan['water_deficit_mm']:.1f} mm")
print(f"Besoin irrigation       : {bilan['irrigation_needed_mm']:.1f} mm")
print(f"Statut                  : {bilan['status']}")`}
                  language="python"
                  output={`{
  "et0_mm_day": 4.82,
  "etc_mm_day": 6.26,
  "precip_eff_mm": 48.3,
  "water_deficit_mm": 26.9,
  "irrigation_needed_mm": 26.9,
  "status": "Stress modéré — Irrigation recommandée"
}`}
                />
              </div>
            )}

            {tab === 'risk' && (
              <div id="risk" className="tab-content">
                <h3>Risques climatiques</h3>
                <CodeBlock
                  code={`session = WeatherSession(latitude=9.33, longitude=2.63, name="Parakou")

# Indice de sécheresse SPI (3 mois)
spi = session.risk.drought_index(method="spi", window_months=3)
print(f"Valeur SPI       : {spi['value']:.2f}")
print(f"Catégorie        : {spi['category']}")  # "Sécheresse modérée"
print(f"Probabilité      : {spi['probability']:.0%}")

# Probabilité de pluie pour les 3 prochains jours
pluie = session.risk.rain_probability(days_ahead=3)
print(f"P(pluie 3j)      : {pluie:.0%}")

# Stress thermique pour le maïs
stress = session.risk.temperature_stress(crop="maize")
print(f"Nb jours > 36°C  : {stress['days_above_max']}")
print(f"Impact rendement : {stress['yield_impact_pct']}%")`}
                  language="python"
                  output={`{
  "spi_value": -1.42,
  "category": "Sécheresse modérée",
  "probability": 0.79,
  "rain_probability_3j": 0.68,
  "temperature_stress": {
    "days_above_max": 3,
    "yield_impact_pct": -8.5
  }
}`}
                />
              </div>
            )}

            {tab === 'data' && (
              <div id="weather-data" className="tab-content">
                <h3>Données météo brutes</h3>
                <CodeBlock
                  code={`session = WeatherSession(latitude=9.33, longitude=2.63, name="Parakou")

# Prévisions 7 jours
previsions = session.forecast(days=7)
for jour in previsions[:3]:
    print(f"{jour['date']} : {jour['temp_max']}°C / {jour['temp_min']}°C "
          f"— {jour['precipitation_mm']}mm — {jour['description']}")

# Historique des précipitations sur 12 mois
historique = session.historical(metric="precipitation", months_back=12)
print(f"\\nTotal annuel : {historique['annual_total_mm']:.1f} mm")
print(f"Mois le + pluvieux : {historique['wettest_month']}")`}
                  language="python"
                  output={`2026-07-15 : 32.4°C / 22.1°C — 12.5mm — Pluies modérées
2026-07-16 : 30.1°C / 21.8°C — 28.3mm — Fortes pluies
2026-07-17 : 29.5°C / 21.2°C — 5.1mm — Averses légères

Total annuel : 1248.6 mm
Mois le + pluvieux : Août (241.3 mm)`}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
