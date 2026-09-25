'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function BriefingContent() {
  const searchParams = useSearchParams();
  const ideaInitial = searchParams.get('idea') || '';
  const sourceInitial = searchParams.get('source') || 'direct';
  const [email, setEmail] = useState('');
  const [idea, setIdea] = useState(ideaInitial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

      setMessage('✅ Your idea has been saved! Check your email.');
      setEmail('');
      setIdea('');
    } catch (err) {
      setMessage('❌ Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Tell us your idea</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        We'll turn it into a 30-day plan to ship your product.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="idea" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Your idea
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="I want to build..."
            required
            style={{
              width: '100%',
              padding: '10px',
              minHeight: '100px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
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
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Saving...' : 'Save my idea'}
        </button>

        {message && (
          <p
            style={{
              marginTop: '20px',
              padding: '10px',
              backgroundColor: message.includes('❌') ? '#ffebee' : '#e8f5e9',
              borderRadius: '8px',
              color: message.includes('❌') ? '#c62828' : '#2e7d32',
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default function Briefing() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BriefingContent />
    </Suspense>
  );
}
