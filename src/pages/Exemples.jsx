import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { Briefcase, Microscope, Code2, Wheat } from 'lucide-react'
import CodeBlock from '../components/ui/CodeBlock'
import './PageModule.css'

/**
 * Page des exemples intégrés — 4 scénarios réels combinant
 * plusieurs modules de KadiPy.
 */
export default function Exemples() {
  const { t } = useLang()
  // Scénario actif
  const [active, setActive] = useState('advisor')

  const scenarios = [
    { id: 'advisor',    icon: Briefcase, label: t('examples.example1_title') },
    { id: 'researcher', icon: Microscope, label: t('examples.example2_title') },
    { id: 'developer',  icon: Code2, label: t('examples.example3_title') },
    { id: 'farmer',     icon: Wheat, label: t('examples.example4_title') },
  ]

  return (
    <div className="page-module">
      <div className="page-header">
        <div className="container">
          <span className="page-header__eyebrow">Exemples</span>
          <h1 className="page-header__title">{t('examples.title')}</h1>
          <p className="page-header__sub">{t('examples.subtitle')}</p>
        </div>
      </div>

      <div className="container page-content">

        {/* Sélecteur de scénario */}
        <div className="scenarios-tabs">
          {scenarios.map(s => (
            <button
              key={s.id}
              className={`scenario-tab ${active === s.id ? 'active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <s.icon className="scenario-tab__icon" size={20} aria-hidden="true" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Scénario 1 — Le conseiller de coopérative */}
        {active === 'advisor' && (
          <section className="content-section" id="example-advisor">
            <div className="example-role">{t('examples.example1_role')}</div>
            <div className="example-context">{t('examples.example1_context')}</div>
            <CodeBlock
              code={`"""
Scénario complet : conseiller agricole d'une coopérative de Parakou.
Objectif : nettoyer les données d'enquête terrain, vérifier la météo
et recommander vendre maintenant ou stocker 20 tonnes de maïs.
"""
import kadi.kidas as kidas
from kadi.weather import WeatherSession
from kadi.market import Market

# ── Étape 1 : Nettoyage des données d'enquête terrain ──────────────
print("=== Nettoyage des données ===")
df, rapport = kidas.load_and_clean("enquete_recoltes_juil2026.xlsx")
print(f"Lignes validées  : {rapport['rows_output']} / {rapport['rows_input']}")
print(f"Score qualité    : {rapport['quality_score']['overall']:.0%}")

# ── Étape 2 : Initialisation des modules ───────────────────────────
session = WeatherSession(latitude=9.33, longitude=2.63, name="Parakou")
marche  = Market(latitude=9.30, longitude=2.08,
                 location="Parakou", weather_session=session)

# ── Étape 3 : Alerte météo ─────────────────────────────────────────
print("\\n=== Météo des 5 prochains jours ===")
previsions = session.forecast(days=5)
for j in previsions:
    if j['rain_probability'] > 0.6:
        print(f"⚠  {j['date']} : P(pluie) = {j['rain_probability']:.0%} — {j['description']}")

# ── Étape 4 : Décision vendre ou stocker ──────────────────────────
print("\\n=== Décision pour 20 tonnes de maïs ===")
# Option A : Vendre à Cotonou maintenant
transport = marche.decision_support.arbitrage_decision(
    crop="maize", origine="Parakou", destination="Cotonou", qty_tons=20.0
)
# Option B : Stocker 2 mois à Parakou
stockage = marche.decision_support.storage_decision(
    crop="maize", market="Parakou", qty_tons=20.0, months=2
)

print(f"Option A (transport) : {transport['gain_net_xof']:>12,} XOF — {transport['recommandation'][:6]}")
print(f"Option B (stockage)  : {stockage['gain_net_xof']:>12,} XOF — {stockage['recommandation'][:6]}")

# Recommandation finale
meilleur = transport if transport['gain_net_xof'] > stockage['gain_net_xof'] else stockage
print(f"\\n✅ RECOMMANDATION FINALE : {meilleur['recommandation']}")
print(f"   Gain net : {meilleur['gain_net_xof']:,} XOF")`}
              language="python"
              title="conseiller_cooperative.py"
              output={`=== Nettoyage des données ===
Lignes validées  : 1201 / 1248
Score qualité    : 87%

=== Météo des 5 prochains jours ===
⚠  2026-07-15 : P(pluie) = 68% — Pluies modérées
⚠  2026-07-16 : P(pluie) = 87% — Fortes pluies

=== Décision pour 20 tonnes de maïs ===
Option A (transport) :      370 000 XOF — VENDRE
Option B (stockage)  :      285 000 XOF — STORE
 
✅ RECOMMANDATION FINALE : VENDRE — Le transfert est rentable.
   Gain net : 370 000 XOF`}
              showLines
            />
          </section>
        )}

        {/* Scénario 2 — Le chercheur agronomiste */}
        {active === 'researcher' && (
          <section className="content-section" id="example-researcher">
            <div className="example-role">{t('examples.example2_role')}</div>
            <div className="example-context">{t('examples.example2_context')}</div>
            <CodeBlock
              code={`"""
Scénario : chercheur INRAB — Parakou.
Calcul du GDD maïs, bilan hydrique FAO-56 et évaluation du risque
de sécheresse SPI sur 3 mois pour la campagne 2026.
"""
from kadi.weather import WeatherSession

# Initialisation pour le Nord-Bénin (algorithme Sivakumar)
session = WeatherSession(latitude=9.33, longitude=2.63, name="Parakou")

# ── Phénologie ────────────────────────────────────────────────────
print("=== Phénologie de la campagne 2026 ===")
onset     = session.phenology.onset()
cessation = session.phenology.cessation()
print(f"Début de saison  : {onset['date']}  (DOY {onset['doy']})")
print(f"Fin de saison    : {cessation['date']} (DOY {cessation['doy']})")
print(f"Durée estimée    : {cessation['doy'] - onset['doy']} jours")

fenetre = session.phenology.sowing_window(crop="maize")
print(f"Semis optimal    : {fenetre['optimal_date']}")
print(f"Fenêtre          : {fenetre['window_start']} → {fenetre['window_end']}")

# ── GDD Maïs ─────────────────────────────────────────────────────
print("\\n=== Degrés-Jours de Croissance (base 10°C) ===")
gdd_df = session.phenology.growing_degree_days(
    crop="maize", start_date=fenetre['optimal_date']
)
# Affichage des stades phénologiques
for stade in gdd_df[gdd_df['stage_change']].itertuples():
    print(f"  {stade.date} : {stade.stage:15} (GDD = {stade.gdd_cumul:.0f})")

# ── Bilan hydrique FAO-56 ─────────────────────────────────────────
print("\\n=== Bilan hydrique (sol ferrugineux) ===")
bilan = session.hydrology.water_balance(crop="maize", soil_type="ferrugineux")
print(f"ET0 Hargreaves   : {bilan['et0_mm_day']:.2f} mm/j")
print(f"ETc maïs (Kc)    : {bilan['etc_mm_day']:.2f} mm/j")
print(f"Déficit hydrique : {bilan['water_deficit_mm']:.1f} mm")
print(f"Irrigation req.  : {bilan['irrigation_needed_mm']:.1f} mm")

# ── Risque de sécheresse SPI ──────────────────────────────────────
print("\\n=== Indice de sécheresse SPI (3 mois) ===")
spi = session.risk.drought_index(method="spi", window_months=3)
print(f"Valeur SPI       : {spi['value']:.2f}")
print(f"Catégorie        : {spi['category']}")
print(f"Probabilité      : {spi['probability']:.0%}")`}
              language="python"
              title="analyse_agro_inrab.py"
              output={`=== Phénologie de la campagne 2026 ===
Début de saison  : 2026-04-22  (DOY 112)
Fin de saison    : 2026-10-18 (DOY 291)
Durée estimée    : 179 jours
Semis optimal    : 2026-05-02
Fenêtre          : 2026-04-25 → 2026-05-12

=== Degrés-Jours de Croissance (base 10°C) ===
  2026-05-08 : Levée           (GDD = 82)
  2026-05-18 : Tallage         (GDD = 184)
  2026-06-02 : Montaison       (GDD = 352)
  2026-06-28 : Floraison       (GDD = 680)
  2026-07-20 : Remplissage     (GDD = 890)

=== Bilan hydrique (sol ferrugineux) ===
ET0 Hargreaves   : 4.82 mm/j
ETc maïs (Kc)    : 6.26 mm/j
Déficit hydrique : 26.9 mm
Irrigation req.  : 26.9 mm

=== Indice de sécheresse SPI (3 mois) ===
Valeur SPI       : -1.42
Catégorie        : Sécheresse modérée
Probabilité      : 79%`}
              showLines
            />
          </section>
        )}

        {/* Scénario 3 — Le développeur AgriTech */}
        {active === 'developer' && (
          <section className="content-section" id="example-developer">
            <div className="example-role">{t('examples.example3_role')}</div>
            <div className="example-context">{t('examples.example3_context')}</div>
            <CodeBlock
              code={`"""
Scénario : développeur d'une startup AgriTech à Cotonou.
Pipeline automatisé : CHIRPS NetCDF → enrichissement WFP → score confiance.
Peut tourner en tâche planifiée (cron, GitHub Actions...).
"""
from kadi.kidas import DataPipeline, NetCDFDataSource, DataCache
from kadi.market import Market
from kadi.weather import WeatherSession
import json

def run_pipeline(city: str, lat: float, lon: float, crop: str) -> dict:
    """
    Pipeline complet pour un marché agricole.
    Retourne un dict JSON-sérialisable prêt pour une API REST.
    """
    cache = DataCache()

    # ── Étape 1 : Données CHIRPS NetCDF ───────────────────────────
    print(f"[{city}] Chargement CHIRPS...")
    pipeline = DataPipeline()
    df_chirps, rapport = (pipeline
        .load_data(NetCDFDataSource(
            file_path="chirps_benin_2026.nc",
            variable="precipitation",
            lat=lat, lon=lon,
            time_range=("2026-01-01", "2026-07-15")
        ))
        .add_cleaning_step(handle_missing={"strategy": "ffill"})
        .add_validation_step()
        .execute(cache=True)
    )
    print(f"[{city}] CHIRPS OK — {rapport['rows_output']} points — qualité {rapport['quality_score']['overall']:.0%}")

    # ── Étape 2 : Météo + Marché ───────────────────────────────────
    session = WeatherSession(latitude=lat, longitude=lon, name=city)
    marche  = Market(latitude=lat, longitude=lon,
                     location=city, weather_session=session)

    # ── Étape 3 : Score de confiance ──────────────────────────────
    score = marche.decision_support.confidence_score(crop=crop, market=city)
    prevision = marche.forecasting.predict_price(crop=crop, market=city, days_ahead=30)

    return {
        "city": city, "crop": crop,
        "confidence_score": score,
        "forecast_30j": prevision,
        "data_quality": rapport['quality_score']['overall'],
        "chirps_points": rapport['rows_output'],
    }

# Lancer pour 3 marchés en parallèle
if __name__ == "__main__":
    marches = [
        ("Parakou",  9.33, 2.63, "maize"),
        ("Kandi",   11.13, 2.94, "cowpea"),
        ("Cotonou",  6.36, 2.42, "tomato"),
    ]
    resultats = [run_pipeline(*m) for m in marches]
    print(json.dumps(resultats, indent=2, ensure_ascii=False))`}
              language="python"
              title="pipeline_agritech.py"
              output={`[Parakou] Chargement CHIRPS...
[Parakou] CHIRPS OK — 196 points — qualité 94%
[Kandi]   CHIRPS OK — 196 points — qualité 91%
[Cotonou] CHIRPS OK — 196 points — qualité 96%

[
  {"city": "Parakou",  "crop": "maize",  "confidence_score": 0.74, "forecast_30j": {"predicted_price_xof_kg": 328}},
  {"city": "Kandi",    "crop": "cowpea", "confidence_score": 0.68, "forecast_30j": {"predicted_price_xof_kg": 498}},
  {"city": "Cotonou",  "crop": "tomato", "confidence_score": 0.81, "forecast_30j": {"predicted_price_xof_kg": 245}}
]`}
              showLines
            />
          </section>
        )}

        {/* Scénario 4 — L'agriculteur connecté */}
        {active === 'farmer' && (
          <section className="content-section" id="example-farmer">
            <div className="example-role">{t('examples.example4_role')}</div>
            <div className="example-context">{t('examples.example4_context')}</div>
            <CodeBlock
              code={`"""
Scénario : agriculteur de Kandi (Nord-Bénin).
Compare 3 scénarios de vente pour 5 tonnes de niébé (cowpea) :
  A) Vendre localement à Kandi
  B) Transporter à Cotonou (550 km)
  C) Transporter à Malanville (100 km, marché frontalier Niger)
"""
from kadi.weather import WeatherSession
from kadi.market import Market

# Initialisation depuis Kandi
session = WeatherSession(latitude=11.13, longitude=2.94, name="Kandi")
marche  = Market(latitude=11.10, longitude=2.93,
                 location="Kandi", weather_session=session)

print("="*60)
print("ANALYSE VENTE — 5 t de niébé — Kandi, 16 juillet 2026")
print("="*60)

scenarios = [
    ("Kandi",      11.10, 2.93,  "Vente locale"),
    ("Cotonou",     6.36, 2.42,  "Transport vers le Sud"),
    ("Malanville", 11.87, 3.38,  "Marché frontalier Niger"),
]

resultats = []
for dest, lat, lon, label in scenarios:
    if dest == "Kandi":
        # Pas de transport : calcul direct du revenu
        prix_df = marche.data_ingestion.get_market_prices("cowpea", "Kandi", weeks_back=4)
        prix_actuel = prix_df["price_xof_kg"].iloc[-1]
        gain = prix_actuel * 5000  # 5 tonnes en kg
        res = {"dest": dest, "label": label, "gain_xof": gain,
               "cout_xof": 0, "net_xof": gain}
    else:
        dec = marche.decision_support.arbitrage_decision(
            crop="cowpea", origine="Kandi",
            destination=dest, qty_tons=5.0
        )
        res = {"dest": dest, "label": label,
               "gain_xof": dec["details"]["prix_destination_xof_kg"] * 5000,
               "cout_xof": dec["details"]["cout_transfert_total_xof"],
               "net_xof":  dec["gain_net_xof"],
               "confiance": dec["confidence_score"]}
    resultats.append(res)

# Affichage comparatif
print(f"\\n{'Destination':<20} {'Revenu brut':>14} {'Coût transport':>14} {'Net':>14} {'Confiance':>10}")
print("-"*74)
for r in sorted(resultats, key=lambda x: x['net_xof'], reverse=True):
    confiance = f"{r.get('confiance', 1.0):.0%}"
    print(f"{r['label']:<20} {r['gain_xof']:>14,.0f} {r['cout_xof']:>14,.0f} "
          f"{r['net_xof']:>14,.0f} {confiance:>10}")

# Recommandation finale
meilleur = max(resultats, key=lambda x: x['net_xof'])
print(f"\\n✅ MEILLEURE OPTION : {meilleur['label']} → {meilleur['net_xof']:,} XOF net")`}
              language="python"
              title="agriculteur_kandi.py"
              output={`============================================================
ANALYSE VENTE — 5 t de niébé — Kandi, 16 juillet 2026
============================================================

Destination          Revenu brut  Coût transport           Net  Confiance
--------------------------------------------------------------------------
Marché frontalier Niger  2 750 000          228 000   2 522 000        71%
Transport vers le Sud    2 500 000          485 000   2 015 000        65%
Vente locale             2 250 000                0   2 250 000       100%

✅ MEILLEURE OPTION : Marché frontalier Niger → 2 522 000 XOF net`}
              showLines
            />
          </section>
        )}

      </div>
    </div>
  )
}
