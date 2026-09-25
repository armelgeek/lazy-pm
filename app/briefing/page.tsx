'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function BriefingContent() {
  const searchParams = useSearchParams();
  const ideeInitiale = searchParams.get('idee') || '';
  const sourceInitiale = searchParams.get('source') || 'direct';
  const [email, setEmail] = useState('');
  const [idee, setIdee] = useState(ideeInitiale);
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
        body: JSON.stringify({ email, idee, source: sourceInitiale }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Une erreur est survenue');
        return;
      }

      setMessage('✅ Ton idée a bien été enregistrée !');
      setEmail('');
      setIdee('');
    } catch (err) {
      setMessage('❌ Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Décris ton idée</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="idee">Ton idée</label>
          <textarea
            id="idee"
            value={idee}
            onChange={(e) => setIdee(e.target.value)}
            placeholder="Décris ton idée..."
            required
            style={{
              width: '100%',
              padding: '10px',
              minHeight: '100px',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Ton email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
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
          {loading ? 'Enregistrement...' : 'Enregistrer mon idée'}
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
    <Suspense fallback={<div>Chargement...</div>}>
      <BriefingContent />
    </Suspense>
  );
}
