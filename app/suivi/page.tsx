'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Founder {
  id: string;
  email: string;
  idee: string;
  source: string;
  created_at: string;
}

function SuiviContent() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const fetchFounders = async (pwd: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/founders?password=${encodeURIComponent(pwd)}`);
      const data = await res.json();

      if (!res.ok) {
        setError('Mot de passe incorrect');
        return;
      }

      setFounders(data);
      setAuthenticated(true);
      setPassword('');
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFounders(password);
  };

  if (!authenticated) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '400px', margin: '0 auto' }}>
        <h1>Ta page de suivi</h1>
        <p>Vois qui s'inscrit et d'où ils viennent.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe"
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
              width: '100%',
              padding: '10px',
              backgroundColor: loading ? '#ccc' : '#1F2421',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Vérification...' : 'Accéder'}
          </button>
          {error && (
            <p style={{ marginTop: '20px', color: '#c62828' }}>❌ {error}</p>
          )}
        </form>
      </div>
    );
  }

  // Stats
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const thisWeek = founders.filter(
    (f) => new Date(f.created_at) >= thisWeekStart
  ).length;

  // Group by source
  const bySource = founders.reduce(
    (acc, f) => {
      const source = f.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Ta page de suivi</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>Total</p>
          <h2 style={{ margin: '5px 0 0 0' }}>{founders.length}</h2>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>Cette semaine</p>
          <h2 style={{ margin: '5px 0 0 0' }}>{thisWeek}</h2>
        </div>
      </div>

      <h2>D'où ils viennent</h2>
      <div style={{ marginBottom: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
        {Object.entries(bySource)
          .sort((a, b) => b[1] - a[1])
          .map(([source, count]) => (
            <div key={source} style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{source}</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>{count}</p>
            </div>
          ))}
      </div>

      <h2>Tous les inscrits</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Idée</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Source</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {founders.map((founder) => (
            <tr key={founder.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', fontSize: '14px' }}>{founder.email}</td>
              <td style={{ padding: '10px', fontSize: '14px' }}>{founder.idee}</td>
              <td style={{ padding: '10px', fontSize: '12px', color: '#666' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                  }}
                >
                  {founder.source || 'direct'}
                </span>
              </td>
              <td style={{ padding: '10px', fontSize: '12px', color: '#999' }}>
                {new Date(founder.created_at).toLocaleDateString('fr-FR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: '20px' }}>
        <button
          onClick={() => {
            setAuthenticated(false);
            setFounders([]);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Déconnexion
        </button>
      </p>
    </div>
  );
}

export default function Suivi() {
  return (
    <Suspense fallback={<div style={{ padding: '40px 20px' }}>Chargement...</div>}>
      <SuiviContent />
    </Suspense>
  );
}
