import { Link } from 'react-router-dom'
import { Sprout } from 'lucide-react'

/**
 * Page 404 — Route non trouvée.
 */
export default function NotFound() {
  return (
    <div className="not-found">
      <Sprout size={48} className="not-found__icon" aria-hidden="true" />
      <h1 className="not-found__code">404</h1>
      <h2 className="not-found__title">Page introuvable</h2>
      <p className="not-found__desc">
        Cette page n'existe pas dans KadiPy. Peut-être que la route a changé ?
      </p>
      <Link to="/" className="btn btn--primary btn--lg">
        Retour à l'accueil
      </Link>
      <style>{`
        .not-found {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 70vh;
          text-align: center;
          gap: var(--space-4);
          padding: var(--space-8);
        }
        .not-found__icon { color: var(--color-primary); }
        .not-found__code { font-size: 6rem; font-weight: 800; color: var(--color-border); line-height: 1; }
        .not-found__title { font-size: 1.5rem; margin: 0; }
        .not-found__desc { color: var(--color-muted); max-width: 400px; }
        /* Réutilisation du .btn de Home.css */
        .btn { display: inline-flex; align-items: center; gap: var(--space-2); font-family: var(--font-body); font-weight: 600; border-radius: var(--radius-md); text-decoration: none; cursor: pointer; transition: all var(--transition-normal); border: 1px solid transparent; }
        .btn--lg { font-size: var(--text-base); padding: var(--space-3) var(--space-6); }
        .btn--primary { background: var(--color-primary); color: white; border-color: var(--color-primary); }
        .btn--primary:hover { background: var(--color-primary-dark); transform: translateY(-1px); }
      `}</style>
    </div>
  )
}
