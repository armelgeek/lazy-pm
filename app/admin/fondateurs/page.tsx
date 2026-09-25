'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Founder {
  id: string;
  email: string;
  idee: string;
  created_at: string;
}

export default function Fondateurs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Vérifier si le mot de passe est dans l'URL
    const pwd = searchParams.get('pwd');
    if (pwd) {
      fetchFounders(pwd);
    }
  }, []);

  const fetchFounders = async (pwd: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/founders?password=${encodeURIComponent(pwd)}`);
      const data = await res.json();

      if (!res.ok) {
        setError('Mot de passe incorrect');
        setAuthenticated(false);
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
        <h1>Accès à la liste des fondateurs</h1>
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

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Liste des fondateurs ({founders.length})</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Idée</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {founders.map((founder) => (
            <tr key={founder.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{founder.email}</td>
              <td style={{ padding: '10px' }}>{founder.idee}</td>
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
