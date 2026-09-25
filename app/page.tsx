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
    <div className="landing">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="ea-bar">
        <span className="dot dot--live"></span> Early access · 3 free days to validate your idea · <a href="#founders">Founder spots available</a>
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
              <span className="dot dot--live"></span> Early access
            </span>
          </a>
          <nav className="nav__links" aria-label="Main">
            <a className="nav__link" href="#journey">
              The journey
            </a>
            <a className="nav__link" href="#pricing">
              Pricing
            </a>
            <a className="nav__link" href="#faq">
              FAQ
            </a>
            <a className="btn btn--primary btn--sm" href="/briefing">
              Start
            </a>
          </nav>
        </div>
      </header>

      <main id="content">
        <section className="hero">
          <div className="wrap hero__grid">
            <div className="hero__copy">
              <p className="hero__kicker">
                <span className="dot dot--live"></span> 20 ideas started, zero shipped?&nbsp;This is for you.
              </p>

              <h1 className="hero__title">
                From idea to first&nbsp;customer.
                <br />
                <span className="hero__accent">For real this&nbsp;time.</span>
              </h1>

              <p className="lead hero__lead">
                Your AI can build. It can't make you finish. We break your idea into{' '}
                <strong>30 days</strong>, with the exact prompt to paste each day until your first
                paying customer.
              </p>

              <form className="hero__form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="hero-idea">
                  Describe your idea
                </label>
                <input
                  className="field hero__field"
                  id="hero-idea"
                  name="idea"
                  type="text"
                  placeholder="I want a tool that..."
                  autoComplete="off"
                />
                <button className="btn btn--primary hero__submit" type="submit">
                  Start my journey <span aria-hidden="true">→</span>
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
                  3 days free
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
                  No credit card required
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
                  Your 30-day plan in 3 minutes
                </li>
              </ul>

              <p className="hero__compat">
                Works with <strong>Lovable</strong>, <strong>Bolt</strong>, <strong>Cursor</strong> and{' '}
                <strong>v0</strong>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
        <p>&copy; 2026 ShipInDays. Built with AI, for makers.</p>
      </footer>
    </div>
  );
}
