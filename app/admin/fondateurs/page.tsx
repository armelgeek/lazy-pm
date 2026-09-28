'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface Founder {
  id: string;
  email: string;
  idee: string;
  created_at: string;
}

interface FounderInvite {
  email: string;
  token: string;
  url: string;
}

function FondateursContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [invites, setInvites] = useState<FounderInvite[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

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

  const toggleEmail = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const generateInvites = async () => {
    if (selectedEmails.length === 0) {
      setError('Sélectionnez au least un email');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/generate-founder-invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: selectedEmails,
          previewOnly: true, // For testing
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur');
        return;
      }

      setInvites(data.invites);
    } catch (err) {
      setError('Erreur serveur');
      console.error(err);
    } finally {
      setGenerating(false);
    }
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

      {!invites.length ? (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '10px', width: '30px' }}>
                  <input
                    type="checkbox"
                    checked={selectedEmails.length === founders.length}
                    onChange={() => {
                      if (selectedEmails.length === founders.length) {
                        setSelectedEmails([]);
                      } else {
                        setSelectedEmails(founders.map((f) => f.email));
                      }
                    }}
                  />
                </th>
                <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>Idée</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {founders.map((founder) => (
                <tr key={founder.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(founder.email)}
                      onChange={() => toggleEmail(founder.email)}
                    />
                  </td>
                  <td style={{ padding: '10px' }}>{founder.email}</td>
                  <td style={{ padding: '10px' }}>{founder.idee}</td>
                  <td style={{ padding: '10px', fontSize: '12px', color: '#999' }}>
                    {new Date(founder.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
            {selectedEmails.length > 0 ? (
              <>
                <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>
                  {selectedEmails.length} emails sélectionnés
                </p>
                <button
                  onClick={generateInvites}
                  disabled={generating}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: generating ? '#ccc' : '#1F2421',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: generating ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    marginRight: '10px',
                  }}
                >
                  {generating ? 'Génération...' : 'Générer les liens'}
                </button>
                <button
                  onClick={() => setSelectedEmails([])}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
              </>
            ) : (
              <p style={{ margin: '0', color: '#999' }}>Sélectionnez des emails pour générer les liens de paiement</p>
            )}
          </div>

          {error && <p style={{ color: '#c00', marginBottom: '20px' }}>❌ {error}</p>}
        </>
      ) : (
        <div>
          <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 12px 0' }}>✓ {invites.length} liens générés</h3>
            <p style={{ margin: '0', fontSize: '14px', color: '#2e7d32' }}>
              Vérifie les URLs ci-dessous avant d'envoyer les emails.
            </p>
          </div>

          {invites.map((invite) => (
            <div
              key={invite.email}
              style={{
                padding: '12px',
                backgroundColor: '#f9f9f9',
                borderRadius: '6px',
                marginBottom: '8px',
                fontSize: '13px',
              }}
            >
              <p style={{ margin: '0 0 6px 0', fontWeight: '600' }}>{invite.email}</p>
              <p
                style={{
                  margin: '0',
                  color: '#666',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
              >
                {invite.url}
              </p>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setInvites([])}
              style={{
                padding: '10px 20px',
                backgroundColor: '#1F2421',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Retour à la liste
            </button>
            <button
              onClick={() => {
                // Copy all URLs to clipboard
                const urls = invites.map((i) => `${i.email}: ${i.url}`).join('\n');
                navigator.clipboard.writeText(urls);
                alert('URLs copiées !');
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Copier les URLs
            </button>
          </div>
        </div>
      )}

      <p style={{ marginTop: '40px' }}>
        <button
          onClick={() => {
            setAuthenticated(false);
            setFounders([]);
            setInvites([]);
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

export default function Fondateurs() {
  return (
    <Suspense fallback={<div style={{ padding: '40px 20px' }}>Chargement...</div>}>
      <FondateursContent />
    </Suspense>
  );
}
