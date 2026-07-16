import { useLang } from '../context/LanguageContext'
import CodeBlock from '../components/ui/CodeBlock'
import './PageModule.css'

/**
 * Page de démarrage rapide.
 */
export default function Demarrage() {
  const { t } = useLang()

  const deps = [
    { name: 'pandas', version: '≥ 2.0', role: 'Manipulation des DataFrames' },
    { name: 'requests', version: '≥ 2.28', role: 'Appels API WFP, Open-Meteo' },
    { name: 'scikit-learn', version: '≥ 1.3', role: 'Régression harmonique, modèles ML' },
    { name: 'numpy', version: '≥ 1.24', role: 'Calculs numériques (GDD, ET0)' },
    { name: 'openpyxl', version: '≥ 3.1', role: 'Lecture des fichiers Excel' },
    { name: 'python-dotenv', version: '≥ 1.0', role: 'Gestion des variables d\'environnement' },
    { name: 'xarray', version: '≥ 2024', role: 'Lecture des fichiers NetCDF (CHIRPS, ERA5)' },
  ]

  const faq = [
    { q: t('start.faq_token_q'), a: t('start.faq_token_a') },
    { q: t('start.faq_offline_q'), a: t('start.faq_offline_a') },
    { q: t('start.faq_python_q'), a: t('start.faq_python_a') },
    { q: 'Comment contribuer ?',
      a: 'Forkez le dépôt sur GitHub, créez une branche descriptive, et ouvrez une Pull Request. Les contributions sont documentées dans CONTRIBUTING.md.' },
  ]

  return (
    <div className="page-module">
      <div className="page-header">
        <div className="container">
          <span className="page-header__eyebrow">Guide</span>
          <h1 className="page-header__title">{t('start.title')}</h1>
          <p className="page-header__sub">{t('start.sub')}</p>
        </div>
      </div>

      <div className="container page-content">

        {/* Installation */}
        <section className="content-section" id="installation">
          <h2>{t('start.install_title')}</h2>
          <p className="lead-text">
            {t('start.install_sub')}<br/>
            Consultez la <a href="https://delsdin.github.io/kadipy/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>documentation officielle</a> pour une référence complète de l'API.
          </p>
          <CodeBlock
            code={`# Installation depuis PyPI (recommandé)
pip install kadipy

# Ou depuis le code source (développement)
git clone https://github.com/delsDin/kadipy.git
cd kadipy
pip install -e .[dev]

# Vérification de l'installation
python -c "import kadi; print(kadi.__version__)"
# → 1.0.0`}
            language="bash"
            fileName="terminal"
          />
        </section>

        {/* Configuration */}
        <section className="content-section" id="configuration">
          <h2>{t('start.config_title')}</h2>
          <p>{t('start.config_desc')}</p>
          <CodeBlock
            code={`# Fichier .env à la racine de votre projet
WFP_API_TOKEN=votre_token_ici

# Sans token : le module utilise automatiquement les données
# de fallback locales (dictionnaire de prix pré-chargé).
# Aucune erreur n'est levée.`}
            language="bash"
            fileName=".env"
          />
          <CodeBlock
            code={`# Vérification de la configuration
from kadi.market import Market
marche = Market(latitude=9.30, longitude=2.08, location="Parakou")

# Vérifie si le token WFP est configuré
cultures = marche.data_ingestion.get_available_crops()
print(f"Cultures disponibles : {len(cultures)}")
# Si token absent → fallback silencieux, résultat identique`}
            language="python"
          />
        </section>

        {/* Premier exemple */}
        <section className="content-section" id="premier-exemple">
          <h2>{t('start.first_example_title')}</h2>
          <p className="lead-text">{t('start.first_example_sub')}</p>
          <CodeBlock
            code={`from kadi.weather import WeatherSession
from kadi.market import Market

# 1. Météo à Parakou (zone centre, algo Sivakumar)
session = WeatherSession(latitude=9.33, longitude=2.63, name="Parakou")

# 2. Prévisions pour les 3 prochains jours
previsions = session.forecast(days=3)
for j in previsions:
    print(f"{j['date']} : {j['precipitation_mm']}mm — P(pluie)={j['rain_probability']:.0%}")

# 3. Marché agricole
marche = Market(latitude=9.30, longitude=2.08,
                location="Parakou", weather_session=session)

# 4. Recommandation d'arbitrage avec prise en compte de la météo
decision = marche.decision_support.arbitrage_decision(
    crop="maize",
    origine="Parakou",
    destination="Cotonou",
    qty_tons=10.0,
)

# 5. Affichage du résultat
print("\\n" + "="*50)
print(decision["recommandation"])
print(f"Confiance : {decision['confidence_score']:.0%}")
print(f"Gain net  : {decision['gain_net_xof']:,} XOF")`}
            language="python"
            title="premier_exemple.py"
            output={`2026-07-15 : 12.5mm — P(pluie)=68%
2026-07-16 : 28.3mm — P(pluie)=87%
2026-07-17 : 5.1mm  — P(pluie)=41%

==================================================
VENDRE — Le transfert est rentable.
Confiance : 74%
Gain net  : 185 000 XOF`}
            showLines
          />
        </section>

        {/* Dépendances */}
        <section className="content-section" id="dependances">
          <h2>{t('start.deps_title')}</h2>
          <div className="api-table-wrapper">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Package</th><th>Version</th><th>Rôle</th>
                </tr>
              </thead>
              <tbody>
                {deps.map(d => (
                  <tr key={d.name}>
                    <td><code>{d.name}</code></td>
                    <td><code>{d.version}</code></td>
                    <td>{d.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="content-section" id="faq">
          <h2>{t('start.faq_title')}</h2>
          <div className="faq-list">
            {faq.map((item, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-question">{item.q}</summary>
                <p className="faq-answer">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
