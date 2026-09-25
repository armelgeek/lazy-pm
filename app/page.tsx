'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const idee = formData.get('idee') as string;
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const source = searchParams.get('utm_source') || 'direct';
    router.push(`/briefing?idee=${encodeURIComponent(idee)}&source=${encodeURIComponent(source)}`);
  };

  return (
    <div className="landing">
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <div className="ea-bar">
        <span className="dot dot--live"></span> Saison 1 en accès anticipé · les 3 premières quêtes
        sont ouvertes · <a href="#fondateurs">20 places au prix fondateur</a>
      </div>

      <header className="nav" id="nav">
        <div className="nav__in">
          <a className="brand" href="/">
            <svg width="34" height="34" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <path d="M30 7v6" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
              <circle cx="30" cy="5" r="3.5" fill="#8A3B52" />
              <path
                d="M11 31a19 19 0 0 1 38 0v11a7 7 0 0 1-7 7H18a7 7 0 0 1-7-7Z"
                fill="#C8952A"
              />
              <circle cx="22" cy="32" r="3.6" fill="#1F2421" />
              <circle cx="38" cy="32" r="3.6" fill="#1F2421" />
              <path
                d="M24 42c4 3 8 3 12 0"
                stroke="#1F2421"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            SHIPINDAYS.
            <span className="pill pill--green pill--xs">
              <span className="dot dot--live"></span> accès anticipé
            </span>
          </a>
          <nav className="nav__links" aria-label="Principale">
            <a className="nav__link" href="#parcours">
              Le parcours
            </a>
            <a className="nav__link" href="#tarif">
              Tarif
            </a>
            <a className="nav__link" href="#questions">
              Questions
            </a>
            <a className="btn btn--primary btn--sm" href="/briefing">
              Commencer
            </a>
          </nav>
        </div>
      </header>

      <main id="contenu">
        <section className="hero">
          <div className="wrap hero__grid">
            <div className="hero__copy">
              <p className="hero__kicker">
                <span className="dot dot--live"></span> 20 idées commencées, zéro lancée&nbsp;? C'est
                pour toi.
              </p>

              <h1 className="hero__title">
                De l'idée au premier&nbsp;client.
                <br />
                <span className="hero__accent">Pour de vrai, cette&nbsp;fois.</span>
              </h1>

              <p className="lead hero__lead">
                Ton IA sait construire, mais pas te faire finir. On découpe ton idée en{' '}
                <strong>30 quêtes</strong>, avec le prompt exact à coller à chaque étape jusqu'au
                premier client.
              </p>

              <form className="hero__form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="hero-idee">
                  Décris ton idée
                </label>
                <input
                  className="field hero__field"
                  id="hero-idee"
                  name="idee"
                  type="text"
                  placeholder="Je veux un site où je peux…"
                  autoComplete="off"
                />
                <button className="btn btn--primary hero__submit" type="submit">
                  Commencer mon parcours <span aria-hidden="true">→</span>
                </button>
              </form>
              <ul className="hero__trust">
                <li>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="4 12 10 18 20 6"></polyline>
                  </svg>{' '}
                  3 quêtes gratuites
                </li>
                <li>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="4 12 10 18 20 6"></polyline>
                  </svg>{' '}
                  Sans carte bancaire
                </li>
                <li>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="4 12 10 18 20 6"></polyline>
                  </svg>{' '}
                  Tes 30 quêtes en 3 minutes
                </li>
              </ul>

              <p className="hero__compat">
                Marche avec <strong>Lovable</strong>, <strong>Bolt</strong>, <strong>Cursor</strong> et{' '}
                <strong>v0</strong>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
        <p>&copy; 2025 LazyPM. Construit avec l'IA, pour les IA.</p>
        <p style={{ marginTop: '20px', fontSize: '12px' }}>
          <a href="/admin/fondateurs" style={{ color: '#666', textDecoration: 'none' }}>
            fondateurs
          </a>
        </p>
      </footer>
    </div>
  );
}
