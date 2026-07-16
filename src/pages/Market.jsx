import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import CodeBlock from '../components/ui/CodeBlock'
import './PageModule.css'

/**
 * Page de documentation du module kadi.market.
 *
 * Couvre : architecture, data_ingestion, pricing, forecasting,
 * logistics, decision_support, backtesting et exemples concrets.
 */
export default function Market() {
  const { t } = useLang()
  // Onglet actif
  const [tab, setTab] = useState('decision')

  const tabs = [
    { id: 'decision',   label: t('market.tab_decision') },
    { id: 'forecasting',label: t('market.tab_forecasting') },
    { id: 'logistics',  label: t('market.tab_logistics') },
    { id: 'pricing',    label: t('market.tab_pricing') },
    { id: 'ingestion',  label: t('market.tab_ingestion') },
    { id: 'backtesting',label: t('market.tab_backtesting') },
  ]

  return (
    <div className="page-module">
      <div className="page-header">
        <div className="container">
          <span className="page-header__module page-header__module--market">Module</span>
          <h1 className="page-header__title">{t('market.title')}</h1>
          <p className="page-header__sub">{t('market.desc')}</p>
        </div>
      </div>

      <div className="container page-content">

        {/* Architecture */}
        <section className="content-section" id="architecture">
          <h2>{t('market.arch_title')}</h2>
          <div className="arch-diagram">
{`Market(location, latitude, longitude, weather_session?)
├── .data_ingestion
│   ├── get_market_prices(crop, market, weeks_back)  → DataFrame
│   ├── get_available_crops()                         → list[str]
│   └── get_price_series(crop, market, start, end)   → DataFrame
├── .pricing
│   ├── normalize_prices(df)                          → DataFrame
│   ├── detect_anomalies(df, method='zscore')         → DataFrame
│   └── interpolate_missing(df, method='linear')      → DataFrame
├── .forecasting
│   ├── predict_price(crop, market, days_ahead)       → dict
│   ├── get_seasonal_pattern(crop, market)             → dict
│   └── evaluate_model(crop, market)                   → dict
├── .logistics
│   ├── calculate_transfer_cost(origin, dest, qty_tons, crop) → dict
│   ├── geocode_market(name)                           → tuple
│   └── get_road_distance(origin, dest)                → float
├── .decision_support
│   ├── arbitrage_decision(crop, origin, dest, qty_tons) → dict
│   ├── storage_decision(crop, market, qty_tons, months)  → dict
│   ├── portfolio_decision(crops, origin, dest)           → list
│   └── confidence_score(crop, market)                    → float
└── .backtesting
    ├── run_price_forecast_backtest(crop, market, n_windows) → dict
    └── generate_report()                                    → dict`}
          </div>
        </section>

        {/* Onglets des sous-modules */}
        <section className="content-section" id="sous-modules">
          <div className="tabs">
            <div className="tabs__nav" role="tablist" aria-label="Sous-modules kadi.market">
              {tabs.map(t_item => (
                <button
                  key={t_item.id}
                  className={`tab-btn ${tab === t_item.id ? 'active' : ''}`}
                  onClick={() => setTab(t_item.id)}
                  role="tab"
                  aria-selected={tab === t_item.id}
                  aria-controls={`tab-panel-${t_item.id}`}
                  id={`tab-${t_item.id}`}
                >
                  {t_item.label}
                </button>
              ))}
            </div>

            {/* decision_support */}
            {tab === 'decision' && (
              <div id="decision-support" className="tab-content" role="tabpanel">
                <h3>decision_support — Aide à la décision</h3>
                <p className="lead-text">
                  Le module de décision combine prévisions, logistique et données météo pour produire
                  une recommandation actionnable avec un score de confiance.
                </p>
                <div className="api-table-wrapper">
                  <table className="api-table">
                    <thead>
                      <tr>
                        <th>Méthode</th><th>Paramètres</th><th>Retour</th><th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['arbitrage_decision()', 'crop, origine, destination, qty_tons', 'dict', 'Recommandation vendre/ne pas transporter avec gain net'],
                        ['storage_decision()', 'crop, market, qty_tons, months', 'dict', 'Stockage vs vente immédiate'],
                        ['portfolio_decision()', 'crops, origin, dest', 'list[dict]', 'Arbitrage multi-cultures trié par gain'],
                        ['confidence_score()', 'crop, market', 'float 0–1', 'Score composite qualité historique + météo'],
                      ].map(([m, p, r, d]) => (
                        <tr key={m}><td><code>{m}</code></td><td>{p}</td><td><code>{r}</code></td><td>{d}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <CodeBlock
                  code={`from kadi.market import Market
from kadi.weather import WeatherSession

# Initialisation avec intégration météo
session = WeatherSession(latitude=9.33, longitude=2.63, name="Parakou")
marche  = Market(latitude=9.30, longitude=2.08,
                 location="Parakou", weather_session=session)

# Arbitrage spatial : Parakou → Cotonou pour 10 t de maïs
decision = marche.decision_support.arbitrage_decision(
    crop="maize",
    origine="Parakou",
    destination="Cotonou",
    qty_tons=10.0,
)

print(decision["recommandation"])        # VENDRE — Le transfert est rentable.
print(f"Gain net : {decision['gain_net_xof']:,} XOF ({decision['gain_net_percent']}%)")
print(f"Confiance : {decision['confidence_score']:.0%}")
# → Gain net : 185 000 XOF (8.2%)
# → Confiance : 74%

# Comparaison de 3 cultures
portfolio = marche.decision_support.portfolio_decision(
    crops=["maize", "cowpea", "yam"],
    origin="Parakou",
    dest="Cotonou",
)
for item in portfolio:
    print(f"{item['crop']:10} → gain : {item['gain_net_xof']:>8,} XOF | {item['recommandation']}")`}
                  language="python"
                  title="Arbitrage spatial + portfolio multi-cultures"
                  output={`{
  "recommandation": "VENDRE — Le transfert est rentable.",
  "confidence_score": 0.74,
  "gain_net_xof": 185000,
  "gain_net_percent": 8.2,
  "details": {
    "prix_origine_xof_kg": 225,
    "prix_destination_xof_kg": 310,
    "cout_transfert_total_xof": 665000,
    "distance_km": 418,
    "ajustement_pluie": "Coefficient logistique dégradé de +12%"
  }
}`}
                />

                {/* Stockage */}
                <h3>Décision de stockage stratégique</h3>
                <CodeBlock
                  code={`# Stocker 5 tonnes de niébé à Parakou pendant 2 mois ?
storage = marche.decision_support.storage_decision(
    crop="cowpea",
    market="Parakou",
    qty_tons=5.0,
    months=2,
)

print(storage["recommandation"])
# → STOCKER — La hausse anticipée couvre les coûts.
print(f"Prix actuel   : {storage['details']['prix_actuel_xof_kg']} XOF/kg")
print(f"Prix prévu +2m: {storage['details']['prix_prevu_xof_kg']} XOF/kg")
print(f"Gain brut     : {storage['details']['gain_brut_xof']:,} XOF")
print(f"Coût stockage : {storage['details']['cout_stockage_xof']:,} XOF")
print(f"Gain net      : {storage['details']['gain_net_xof']:,} XOF")`}
                  language="python"
                  output={`{
  "recommandation": "STOCKER — La hausse anticipée couvre les coûts.",
  "confidence_score": 0.68,
  "gain_net_xof": 142500,
  "details": {
    "prix_actuel_xof_kg": 450,
    "prix_prevu_xof_kg": 520,
    "gain_brut_xof": 350000,
    "cout_stockage_xof": 207500,
    "duree_mois": 2
  }
}`}
                />
              </div>
            )}

            {/* forecasting */}
            {tab === 'forecasting' && (
              <div id="forecasting" className="tab-content" role="tabpanel">
                <h3>forecasting — Prévision de prix</h3>
                <p className="lead-text">
                  Régression harmonique de Fourier sur historique WFP.
                  Retourne le prix prévu avec intervalles de confiance à 90%.
                </p>
                <div className="api-table-wrapper">
                  <table className="api-table">
                    <thead><tr><th>Paramètre</th><th>Type</th><th>Défaut</th><th>Description</th></tr></thead>
                    <tbody>
                      {[
                        ['crop', 'str', 'requis', 'Code FAO de la culture (ex: "maize")'],
                        ['market', 'str', 'requis', 'Nom du marché (ex: "Parakou")'],
                        ['days_ahead', 'int', '30', 'Horizon de prévision en jours (max 90)'],
                      ].map(([p, t, d, desc]) => (
                        <tr key={p}><td><code>{p}</code></td><td><code>{t}</code></td><td><code>{d}</code></td><td>{desc}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <CodeBlock
                  code={`# Prévision de prix à 30 jours pour le maïs à Parakou
prevision = marche.forecasting.predict_price(
    crop="maize",
    market="Parakou",
    days_ahead=30,
)

print(f"Prix prévu     : {prevision['predicted_price_xof_kg']} XOF/kg")
print(f"Intervalle 90% : [{prevision['low_90_xof_kg']} – {prevision['high_90_xof_kg']}] XOF/kg")
print(f"RMSE modèle    : {prevision['rmse']} XOF/kg")
print(f"Qualité données: {prevision['data_quality']}")

# Tendance saisonnière
pattern = marche.forecasting.get_seasonal_pattern("maize", "Parakou")
print(f"Mois de pic    : {pattern['month_peak_name']}")  # Juin (soudure)
print(f"Mois de creux  : {pattern['month_trough_name']}") # Octobre (post-récolte)`}
                  language="python"
                  output={`{
  "predicted_price_xof_kg": 328,
  "low_90_xof_kg": 291,
  "high_90_xof_kg": 365,
  "rmse": 18.4,
  "data_quality": "bonne (45 observations)",
  "model": "Fourier regression (k=3)",
  "horizon_days": 30
}`}
                />
              </div>
            )}

            {/* logistics */}
            {tab === 'logistics' && (
              <div id="logistics" className="tab-content" role="tabpanel">
                <h3>logistics — Coûts de transport réels</h3>
                <p className="lead-text">
                  Géocodage des marchés via Nominatim/OSM, routage réel via OSRM,
                  modèle de coût paramétrable avec intégration météo.
                </p>
                <CodeBlock
                  code={`# Calcul de coût de transfert Parakou → Cotonou (10 t maïs)
cout = marche.logistics.calculate_transfer_cost(
    origin="Parakou",
    destination="Cotonou",
    qty_tons=10.0,
    crop="maize",
)

print(f"Distance route : {cout['distance_km']} km")
print(f"Durée estimée  : {cout['duree_h']:.1f} h")
print(f"Coût total     : {cout['cout_total_xof']:,} XOF")
print(f"  - Carburant  : {cout['details']['cout_carburant_xof']:,} XOF")
print(f"  - Info marché: {cout['details']['cout_info_xof']:,} XOF")
print(f"  - Pertes qual: {cout['details']['perte_qualite_xof']:,} XOF")
print(f"  - Coeff route: γ = {cout['details']['gamma_route']}")
print(f"Impact pluie   : {cout['details']['ajustement_pluie']}")`}
                  language="python"
                  output={`{
  "distance_km": 418,
  "duree_h": 5.8,
  "cout_total_xof": 665000,
  "details": {
    "cout_carburant_xof": 486000,
    "cout_info_xof": 25000,
    "perte_qualite_xof": 154000,
    "gamma_route": 1.12,
    "ajustement_pluie": true
  }
}`}
                />
              </div>
            )}

            {/* pricing */}
            {tab === 'pricing' && (
              <div id="pricing" className="tab-content" role="tabpanel">
                <h3>pricing — Normalisation et anomalies</h3>
                <CodeBlock
                  code={`import pandas as pd
from kadi.market import Market

marche = Market(latitude=9.30, longitude=2.08, location="Parakou")

# Récupération des prix bruts
df = marche.data_ingestion.get_market_prices(crop="maize",
                                              market="Parakou",
                                              weeks_back=52)

# Conversion en XOF/kg et détection des anomalies
df_norm = marche.pricing.normalize_prices(df)
df_clean = marche.pricing.detect_anomalies(df_norm, method="zscore")
df_final = marche.pricing.interpolate_missing(df_clean, method="linear")

print(f"Points retenus : {len(df_final)} / {len(df)}")
print(df_final[['date', 'price_xof_kg', 'is_anomaly']].tail(5))`}
                  language="python"
                />
              </div>
            )}

            {/* ingestion */}
            {tab === 'ingestion' && (
              <div id="data-ingestion" className="tab-content" role="tabpanel">
                <h3>data_ingestion — Client WFP DataBridges</h3>
                <p className="lead-text">
                  Récupère les prix via l'API WFP DataBridges. Stocke en cache local
                  (SQLite) avec invalidation automatique à 24h.
                </p>
                <CodeBlock
                  code={`from kadi.market import Market

marche = Market(latitude=9.30, longitude=2.08, location="Parakou")

# Lister les cultures disponibles
cultures = marche.data_ingestion.get_available_crops()
print("Cultures disponibles :", cultures)
# → ['maize', 'cowpea', 'yam', 'cassava', 'sorghum', 'millet', ...]

# Récupération sur 1 an (avec fallback local si API inaccessible)
df = marche.data_ingestion.get_market_prices(
    crop="yam",
    market="Parakou",
    weeks_back=52,
)
print(df.dtypes)
print(df.describe())`}
                  language="python"
                />
              </div>
            )}

            {/* backtesting */}
            {tab === 'backtesting' && (
              <div id="backtesting" className="tab-content" role="tabpanel">
                <h3>backtesting — Évaluation des prévisions</h3>
                <CodeBlock
                  code={`# Backtesting du modèle de prévision sur 24 fenêtres glissantes
rapport = marche.backtesting.run_price_forecast_backtest(
    crop="maize",
    market="Parakou",
    n_windows=24,
)

print(f"MAE   : {rapport['mae']} XOF/kg")
print(f"RMSE  : {rapport['rmse']} XOF/kg")
print(f"MAPE  : {rapport['mape_pct']}%")
print(f"Dir.  : {rapport['directional_accuracy_pct']}% (hausse/baisse correcte)")
print(f"Meilleure période : {rapport['best_window']['period']}")`}
                  language="python"
                  output={`{
  "mae": 14.3,
  "rmse": 18.7,
  "mape_pct": 6.2,
  "directional_accuracy_pct": 71.4,
  "best_window": {
    "period": "2025-04 → 2025-09",
    "mae": 9.1,
    "note": "Saison post-récolte, prix stables"
  },
  "worst_window": {
    "period": "2024-06 → 2024-08",
    "mae": 22.8,
    "note": "Période de soudure, forte volatilité"
  }
}`}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
