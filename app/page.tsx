'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const idea = formData.get('idea') as string;
    const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const source = searchParams.get('utm_source') || 'direct';
    router.push(`/briefing?idea=${encodeURIComponent(idea)}&source=${encodeURIComponent(source)}`);
  };

  return (
    <>
      <a className="skip-link" href="#content">Skip to content</a>
      <div className="ea-bar">
        <span className="dot dot--live"></span> Accès anticipé · 3 quêtes gratuites pour valider ton idée
      </div>

      <header className="nav" id="nav">
        <div className="nav__in">
          <a className="brand" href="/">
            <svg width="34" height="34" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <path d="M30 7v6" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
              <circle cx="30" cy="5" r="3.5" fill="#8A3B52" />
              <path d="M11 31a19 19 0 0 1 38 0v11a7 7 0 0 1-7 7H18a7 7 0 0 1-7-7Z" fill="#C8952A" />
              <circle cx="22" cy="32" r="3.6" fill="#1F2421" />
              <circle cx="38" cy="32" r="3.6" fill="#1F2421" />
              <path d="M24 42c4 3 8 3 12 0" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
            </svg>
            LAZYPM.
            <span className="pill pill--green pill--xs">
              <span className="dot dot--live"></span> Accès anticipé
            </span>
          </a>
          <nav className="nav__links" aria-label="Main">
            <a className="nav__link" href="#journey">Le parcours</a>
            <a className="nav__link" href="#pricing">Tarifs</a>
            <a className="nav__link" href="#faq">FAQ</a>
            <a className="btn btn--primary btn--sm" href="/briefing">Commencer</a>
          </nav>
        </div>
      </header>

      <main id="content">
        <section className="hero">
          <div className="wrap hero__grid">
            {/* LEFT COLUMN */}
            <div className="hero__copy">
              <p className="hero__kicker">
                <span className="dot dot--live"></span> 20 idées lancées, zéro livrées ? C'est pour toi.
              </p>

              <h1 className="hero__title">
                De l'idée au premier&nbsp;client.
                <br />
                <span className="hero__accent">Pour de&nbsp;vrai cette&nbsp;fois.</span>
              </h1>

              <p className="lead hero__lead">
                Ton IA peut construire. Elle ne peut pas te faire finir. On coupe ton idée en{' '}
                <strong>30 jours</strong>, avec le prompt exact à coller chaque jour jusqu'à ton premier
                client payant.
              </p>

              <form className="hero__form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="hero-idea">Décris ton idée</label>
                <input
                  className="field hero__field"
                  id="hero-idea"
                  name="idea"
                  type="text"
                  placeholder="Je veux un outil qui…"
                  autoComplete="off"
                />
                <button className="btn btn--primary hero__submit" type="submit">
                  Commencer mon parcours <span aria-hidden="true">→</span>
                </button>
              </form>

              <ul className="hero__trust">
                <li>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="4 12 10 18 20 6"></polyline>
                  </svg>
                  3 quêtes gratuites
                </li>
                <li>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="4 12 10 18 20 6"></polyline>
                  </svg>
                  Pas de carte de crédit
                </li>
                <li>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="4 12 10 18 20 6"></polyline>
                  </svg>
                  Ton plan 30 jours en 3 minutes
                </li>
              </ul>

              <p className="hero__compat">
                Fonctionne avec <strong>Lovable</strong>, <strong>Bolt</strong>, <strong>Cursor</strong> et{' '}
                <strong>v0</strong>
              </p>
            </div>

            {/* RIGHT COLUMN - BEFORE/AFTER */}
            <div className="hero__visual" aria-label="Avant et après LazyPM">
              {/* BEFORE */}
              <span className="hero__tag hero__tag--before">Avant · seul avec ton IA</span>
              <div className="hero__dead">
                <div className="row row--between">
                  <span className="hero__dead-name">tonapp.io</span>
                  <span className="tag tag--boss">ABANDONNÉ</span>
                </div>
                <div className="hero__bar hero__bar--dead" aria-hidden="true">
                  <i style={{ width: '13%' }}></i>
                </div>
                <span className="small">Bloqué au jour 4. Comme tes 20 autres idées.</span>
              </div>

              {/* AFTER */}
              <span className="hero__tag hero__tag--after">
                Après · la prochaine, avec LazyPM <span aria-hidden="true">↓</span>
              </span>
              <div className="card hero__live">
                <div className="row row--between">
                  <span className="ticket" style={{ color: 'var(--teal)' }}>EXEMPLE DE PARCOURS</span>
                  <span className="pill pill--green pill--xs">
                    <span className="dot dot--live"></span> en direct
                  </span>
                </div>
                <p className="hero__live-name">tonapp.com</p>

                <div className="hero__progress">
                  <div className="row row--between">
                    <span className="ticket">jour 24 / 30</span>
                    <span className="ticket" style={{ color: '#666' }}>80%</span>
                  </div>
                  <div className="hero__steps" aria-hidden="true">
                    <i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i>
                    <i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i>
                    <i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i>
                    <i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i>
                    <i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i>
                    <i className="on"></i><i className="on"></i><i className="on"></i><i className="now"></i>
                    <i></i><i></i><i></i><i></i><i></i><i></i>
                  </div>
                </div>

                <ul className="hero__log">
                  <li>
                    <span className="node node--done hero__node">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1F2421"
                        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 12 10 18 20 6"></polyline>
                      </svg>
                    </span>
                    <span className="ticket">#11</span> Premier client payant
                  </li>
                  <li>
                    <span className="node node--done node--boss hero__node">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E2739"
                        strokeWidth="2.6" strokeLinejoin="round">
                        <path d="M4 8l4 4 4-7 4 7 4-4v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
                      </svg>
                    </span>
                    <span className="ticket" style={{ color: 'var(--rose)' }}>#19</span> Lancement public
                  </li>
                </ul>

                <div className="hero__mrr">
                  <div>
                    <span className="num num--l">340 $</span><span className="small"> /mois</span>
                  </div>
                  <span className="pill pill--gold pill--xs">12 clients</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
        <p>&copy; 2026 LazyPM. Construit avec l'IA, pour les makers.</p>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
          <a href="/conditions" style={{ color: '#666', textDecoration: 'none' }}>Conditions</a>
          <a href="/confidentialite" style={{ color: '#666', textDecoration: 'none' }}>Confidentialité</a>
          <a href="/remboursement" style={{ color: '#666', textDecoration: 'none' }}>Remboursement</a>
        </div>
      </footer>
    </>
  );
}
