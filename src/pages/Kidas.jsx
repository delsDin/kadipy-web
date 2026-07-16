import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import CodeBlock from '../components/ui/CodeBlock'
import './PageModule.css'

/**
 * Page de documentation du module kadi.kidas.
 */
export default function Kidas() {
  const { t } = useLang()
  const [tab, setTab] = useState('pipeline')

  const tabs = [
    { id: 'pipeline',       label: 'Pipeline' },
    { id: 'sources',        label: t('kidas.tab_sources') },
    { id: 'cleaning',       label: t('kidas.tab_cleaning') },
    { id: 'validation',     label: t('kidas.tab_validation') },
    { id: 'normalization',  label: t('kidas.tab_normalization') },
    { id: 'infrastructure', label: t('kidas.tab_infrastructure') },
  ]

  // Cultures FAO reconnues
  const faoCrops = [
    { code: 'maize',   fr: 'Maïs',       variants: ['mais', 'corn', 'MAIS'] },
    { code: 'cowpea',  fr: 'Niébé',      variants: ['niébé', 'black-eyed peas'] },
    { code: 'yam',     fr: 'Igname',     variants: ['igname', 'yam'] },
    { code: 'cassava', fr: 'Manioc',     variants: ['manioc', 'maniok', 'mandioc'] },
    { code: 'sorghum', fr: 'Sorgho',     variants: ['sorgho', 'sorgo'] },
    { code: 'millet',  fr: 'Mil',        variants: ['mil', 'fonio'] },
    { code: 'cotton',  fr: 'Coton',      variants: ['coton', 'cotton'] },
    { code: 'tomato',  fr: 'Tomate',     variants: ['tomate', 'tomato'] },
    { code: 'rice',    fr: 'Riz',        variants: ['riz', 'rice'] },
    { code: 'onion',   fr: 'Oignon',     variants: ['oignon', 'onion'] },
  ]

  // Unités locales
  const localUnits = [
    { unit: 'tiya',   equiv: '2.5 kg',  context: 'Mesure volumétrique Bénin/Togo' },
    { unit: 'sac',    equiv: '80 kg',   context: 'Sac standard de céréales' },
    { unit: 'botte',  equiv: '0.5 kg',  context: 'Légumes feuilles' },
    { unit: 'cuvette',equiv: '10 kg',   context: 'Tomate, piment' },
    { unit: 'calebasse', equiv: '3 kg', context: 'Mesure traditionnelle' },
  ]

  return (
    <div className="page-module">
      <div className="page-header">
        <div className="container">
          <span className="page-header__module page-header__module--kidas">Module</span>
          <h1 className="page-header__title">{t('kidas.title')}</h1>
          <p className="page-header__sub">{t('kidas.desc')}</p>
        </div>
      </div>

      <div className="container page-content">

        {/* Architecture */}
        <section className="content-section" id="architecture">
          <h2>{t('kidas.arch_title')}</h2>
          <div className="arch-diagram">
{`kadi.kidas
├── Sources
│   ├── CSVDataSource(file_path, sep?, encoding?)
│   ├── ExcelDataSource(file_path, sheet_name?)
│   ├── APIDataSource(url, params?, auth_token?, rate_limit?)
│   └── NetCDFDataSource(file_path, variable, lat, lon, time_range?)
├── DataCleaner(df)
│   ├── .remove_duplicates(subset?)
│   ├── .handle_missing_values(strategy, columns?)
│   ├── .detect_outliers(method, threshold?)
│   └── .fix_dates(column, format?)
├── DataValidator(df)
│   ├── .validate_schema(schema)
│   ├── .check_gps_coords(lat_col, lon_col)
│   └── .quality_score()        → dict {overall, completude, coherence}
├── DataNormalizer(df)
│   ├── .normalize_crop_names(column)
│   ├── .convert_local_units(column, unit_col)
│   └── .normalize_market_names(column)
├── DataCache(db_path?)
│   ├── .set(key, df, ttl_seconds?)
│   ├── .get(key)               → DataFrame | None
│   └── .invalidate(key)
└── DataPipeline()  ← Orchestrateur principal (API fluide)
    ├── .load_data(source)      → self
    ├── .add_cleaning_step(...) → self
    ├── .add_validation_step()  → self
    ├── .add_normalization_step(...) → self
    ├── .execute(cache?)        → (DataFrame, dict)
    └── load_and_clean(path)    [fonction rapide]`}
          </div>
        </section>

        {/* Onglets */}
        <section className="content-section">
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

            {tab === 'pipeline' && (
              <div className="tab-content">
                <h3>DataPipeline — API fluide et chaînable</h3>
                <p className="lead-text">
                  L'orchestrateur principal permet de chaîner toutes les étapes de
                  traitement. Il gère le cache automatiquement et génère un rapport complet.
                </p>
                <CodeBlock
                  code={`import kadi.kidas as kidas
from kadi.kidas import DataPipeline, ExcelDataSource

# Traitement complet d'un fichier de récoltes MAEP
pipeline = DataPipeline()
df, rapport = (pipeline
    .load_data(ExcelDataSource("recoltes_maep_2024.xlsx"))
    .add_cleaning_step(
        remove_duplicates=True,
        handle_missing={"strategy": "mean", "columns": ["price", "qty"]},
        outlier_method="iqr"
    )
    .add_validation_step()
    .add_normalization_step(
        normalize_crops=True,
        convert_units=True,
        normalize_markets=True
    )
    .execute(cache=True)
)

print(f"Lignes en entrée    : {rapport['rows_input']}")
print(f"Lignes en sortie    : {rapport['rows_output']}")
print(f"Score qualité global: {rapport['quality_score']['overall']:.0%}")
print(f"Cultures normalisées: {rapport['normalization_report']['crop_names_normalized']}")`}
                  language="python"
                  output={`{
  "rows_input": 1248,
  "rows_output": 1201,
  "rows_dropped": 47,
  "quality_score": {
    "overall": 0.87,
    "completude": 0.91,
    "coherence": 0.88,
    "precision": 1.0
  },
  "normalization_report": {
    "crop_names_normalized": {"mais": "maize", "niébé": "cowpea"}
  }
}`}
                />
                <h3>Fonction rapide load_and_clean()</h3>
                <CodeBlock
                  code={`# Traitement express en une seule ligne
df, rapport = kidas.load_and_clean("recoltes_terrain.csv")
print(df.head())`}
                  language="python"
                />
              </div>
            )}

            {tab === 'sources' && (
              <div id="sources" className="tab-content">
                <h3>Sources de données supportées</h3>
                <div className="api-table-wrapper">
                  <table className="api-table">
                    <thead><tr><th>Source</th><th>Format</th><th>Paramètres clés</th></tr></thead>
                    <tbody>
                      {[
                        ['CSVDataSource', '.csv, .tsv', 'sep (auto-détecté), encoding, header'],
                        ['ExcelDataSource', '.xls, .xlsx, .xlsm', 'sheet_name (défaut : 1er onglet), header'],
                        ['APIDataSource', 'JSON/REST', 'url, params, auth_token, rate_limit, backoff'],
                        ['NetCDFDataSource', '.nc (CHIRPS, ERA5, TAMSAT)', 'variable, lat, lon, time_range'],
                      ].map(([s, f, p]) => (
                        <tr key={s}><td><code>{s}</code></td><td>{f}</td><td>{p}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <CodeBlock
                  code={`from kadi.kidas import NetCDFDataSource, DataPipeline

# Lecture de données CHIRPS sur le Bénin
source_chirps = NetCDFDataSource(
    file_path="chirps_benin_2024.nc",
    variable="precipitation",
    lat=9.33,
    lon=2.63,
    time_range=("2024-01-01", "2024-12-31")
)
df_chirps, _ = DataPipeline().load_data(source_chirps).execute()`}
                  language="python"
                />
              </div>
            )}

            {tab === 'cleaning' && (
              <div id="cleaning" className="tab-content">
                <h3>DataCleaner — Nettoyage des données</h3>
                <div className="api-table-wrapper">
                  <table className="api-table">
                    <thead><tr><th>Méthode</th><th>Stratégies</th><th>Défaut</th></tr></thead>
                    <tbody>
                      {[
                        ['handle_missing_values', 'mean, median, mode, ffill, bfill, drop', 'mean'],
                        ['detect_outliers', 'iqr, zscore, mad', 'iqr'],
                        ['fix_dates', 'format auto-détecté, timezone', 'UTC'],
                        ['remove_duplicates', 'subset de colonnes', 'toutes colonnes'],
                      ].map(([m, s, d]) => (
                        <tr key={m}><td><code>{m}()</code></td><td>{s}</td><td><code>{d}</code></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'validation' && (
              <div id="validation" className="tab-content">
                <h3>DataValidator — Score qualité multicritère</h3>
                <p>Le score est calculé sur 3 dimensions : complétude (40%), cohérence (35%), précision (25%).</p>
                <CodeBlock
                  code={`from kadi.kidas import DataValidator
import pandas as pd

df = pd.read_csv("recoltes.csv")
validator = DataValidator(df)

# Validation de schéma
schema = {
    "culture": {"type": "str", "required": True},
    "prix_xof_kg": {"type": "float", "min": 0, "max": 5000},
    "date": {"type": "datetime"},
    "latitude": {"type": "float", "min": 6.0, "max": 12.5},
    "longitude": {"type": "float", "min": 0.8, "max": 3.9},
}
errors = validator.validate_schema(schema)
score = validator.quality_score()

print(f"Score global : {score['overall']:.0%}")
print(f"Complétude   : {score['completude']:.0%}")
print(f"Cohérence    : {score['coherence']:.0%}")`}
                  language="python"
                />
              </div>
            )}

            {tab === 'normalization' && (
              <div id="normalization" className="tab-content">
                <h3>DataNormalizer — Codes FAO et unités locales</h3>

                <h4>{t('kidas.fao_title')}</h4>
                <div className="api-table-wrapper">
                  <table className="api-table">
                    <thead><tr><th>Code FAO</th><th>Nom FR</th><th>Variantes reconnues</th></tr></thead>
                    <tbody>
                      {faoCrops.map(c => (
                        <tr key={c.code}>
                          <td><code>{c.code}</code></td>
                          <td>{c.fr}</td>
                          <td>{c.variants.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h4 style={{ marginTop: 'var(--space-8)' }}>{t('kidas.units_title')}</h4>
                <div className="api-table-wrapper">
                  <table className="api-table">
                    <thead><tr><th>Unité locale</th><th>Équivalence</th><th>Contexte</th></tr></thead>
                    <tbody>
                      {localUnits.map(u => (
                        <tr key={u.unit}>
                          <td><code>{u.unit}</code></td>
                          <td>{u.equiv}</td>
                          <td>{u.context}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'infrastructure' && (
              <div id="infrastructure" className="tab-content">
                <h3>Cache SQLite — Stockage local</h3>
                <CodeBlock
                  code={`from kadi.kidas import DataCache
import pandas as pd

cache = DataCache(db_path="~/.kadi/cache.db")

# Stocker un DataFrame avec TTL de 24h
df = pd.read_csv("prix_marche.csv")
cache.set("prix_parakou_maize", df, ttl_seconds=86400)

# Récupérer depuis le cache
df_cached = cache.get("prix_parakou_maize")
if df_cached is not None:
    print("Données depuis le cache local")
    print(f"Taille : {len(df_cached)} lignes")

# Invalider une entrée
cache.invalidate("prix_parakou_maize")`}
                  language="python"
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
