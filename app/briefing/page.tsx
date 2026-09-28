'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

interface Question {
  id: number;
  question: string;
  type: string;
  options: string[];
}

interface BriefingResponse {
  reformulation: string;
  questions: Question[];
}

function BriefingContent() {
  const searchParams = useSearchParams();
  const ideaInitial = searchParams.get('idea') || '';
  const sourceInitial = searchParams.get('source') || 'direct';
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState(ideaInitial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const generateBriefing = async () => {
    if (!idea.trim()) {
      setMessage('❌ Please describe your idea first');
      return;
    }

    setBriefingLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Failed to generate briefing');
        return;
      }

      setBriefing(data.data);
      setAnswers({});
    } catch (err) {
      setMessage('❌ Connection error');
    } finally {
      setBriefingLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/founders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, idee: idea, source: sourceInitial }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'An error occurred');
        return;
      }

      setSuccess(true);
      setMessage('✅ Your idea has been saved! Check your email.');
      setEmail('');
      setIdea('');
      setBriefing(null);
    } catch (err) {
      setMessage('❌ Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="nav">
        <div className="nav__in">
          <a className="brand" href="/">
            <svg width="30" height="30" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <path d="M30 7v6" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
              <circle cx="30" cy="5" r="3.5" fill="#8A3B52" />
              <path d="M11 31a19 19 0 0 1 38 0v11a7 7 0 0 1-7 7H18a7 7 0 0 1-7-7Z" fill="#C8952A" />
              <circle cx="22" cy="32" r="3.6" fill="#1F2421" />
              <circle cx="38" cy="32" r="3.6" fill="#1F2421" />
              <path d="M24 42c4 3 8 3 12 0" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
            </svg>
            SHIPINDAYS.
          </a>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ width: '28px', height: '6px', borderRadius: '999px', background: '#1F2421' }}></span>
              <span style={{ width: '28px', height: '6px', borderRadius: '999px', background: '#1F2421' }}></span>
              <span style={{ width: '28px', height: '6px', borderRadius: '999px', background: '#ddd' }}></span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#999' }}>STEP 2/3 · IDEA</span>
          </div>
        </div>
      </header>

      <main className="section">
        <div className="wrap stack" style={{ maxWidth: '880px', gap: '28px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
            <svg width="80" height="80" viewBox="0 0 60 60" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: '4px' }}>
              <path d="M30 7v6" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
              <circle cx="30" cy="5" r="3.5" fill="#8A3B52" />
              <path d="M11 31a19 19 0 0 1 38 0v11a7 7 0 0 1-7 7H18a7 7 0 0 1-7-7Z" fill="#C8952A" />
              <circle cx="22" cy="32" r="3.6" fill="#1F2421" />
              <circle cx="38" cy="32" r="3.6" fill="#1F2421" />
              <path d="M24 42c4 3 8 3 12 0" stroke="#1F2421" strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="card card--strong" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#f5f5f5', padding: '24px', borderRadius: '12px', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#666' }}>// Your idea</span>
                {!success && <span style={{ fontSize: '12px', fontWeight: '700', color: '#1F2421', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>✏️ Edit it</span>}
                {success && <span style={{ fontSize: '12px', fontWeight: '700', color: '#1F2421', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>✅ Saved</span>}
              </div>

              <h2 style={{ fontSize: 'clamp(20px, 2.8vw, 26px)', lineHeight: '1.25', margin: 0 }}>
                {idea || 'Tell me your idea...'}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label htmlFor="idea" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#1F2421' }}>
                Your idea
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="I want to build a tool that..."
                disabled={!!briefing}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  minHeight: '100px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'vertical',
                  opacity: briefing ? 0.6 : 1,
                }}
              />
            </div>

            {!briefing && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={generateBriefing}
                  disabled={briefingLoading || !idea.trim()}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: briefingLoading ? '#ccc' : '#1F2421',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: briefingLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  {briefingLoading ? 'Generating briefing...' : 'Analyze my idea'}
                </button>
              </div>
            )}

            {briefing && (
              <>
                <div style={{ padding: '16px', backgroundColor: '#f0f8ff', borderRadius: '8px', borderLeft: '4px solid #1F2421' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#666', margin: '0 0 8px 0' }}>AI reformulation</p>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#1F2421', margin: 0 }}>
                    {briefing.reformulation}
                  </p>
                </div>

                {briefing.questions.map((q) => (
                  <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#1F2421' }}>
                      {q.question}
                    </label>
                    <select
                      value={answers[q.id] || ''}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select an option</option>
                      {q.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label htmlFor="email" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#1F2421' }}>
                    Your email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: loading ? '#ccc' : '#1F2421',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    {loading ? 'Saving...' : 'Save my idea & start!'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBriefing(null);
                      setAnswers({});
                      setMessage('');
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#f5f5f5',
                      color: '#1F2421',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {message && (
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: message.includes('❌') ? '#ffebee' : '#e8f5e9',
                  borderRadius: '8px',
                  color: message.includes('❌') ? '#c62828' : '#2e7d32',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </main>
    </>
  );
}

export default function Briefing() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BriefingContent />
    </Suspense>
  );
}
