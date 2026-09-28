'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function FounderCheckout() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadInvite = async () => {
      try {
        // Fetch invite by token
        const { data, error: fetchError } = await supabase
          .from('founder_invites')
          .select('*')
          .eq('invite_token', token)
          .maybeSingle();

        if (fetchError || !data) {
          setError('Lien invalide ou expiré');
          setLoading(false);
          return;
        }

        // Check if expired
        const expiresAt = new Date(data.expires_at);
        if (expiresAt < new Date()) {
          setError('Ce lien a expiré. Contacte le fondateur pour un nouveau.');
          setLoading(false);
          return;
        }

        // Check if already paid
        if (data.paid_at) {
          setError('Tu as déjà payé avec ce lien.');
          setLoading(false);
          return;
        }

        setInvite(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading invite:', err);
        setError('Erreur lors du chargement');
        setLoading(false);
      }
    };

    if (token) {
      loadInvite();
    }
  }, [token]);

  const handleCheckout = async () => {
    setProcessing(true);

    try {
      // Get or create auth session
      let user = null;
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        // Create anonymous session or sign up
        const { data: authData, error: authError } = await supabase.auth.signInWithOtp(
          {
            email: invite.email,
          }
        );

        if (authError) {
          setError('Erreur lors de la création du compte');
          setProcessing(false);
          return;
        }

        setError(
          'Un email de confirmation a été envoyé. Clique le lien pour confirmer, puis réessaie.'
        );
        setProcessing(false);
        return;
      }

      user = currentUser;

      // Create Stripe checkout session with founder pricing
      const res = await fetch('/api/create-founder-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
        },
        body: JSON.stringify({
          inviteId: invite.id,
          email: invite.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Erreur lors du paiement');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Erreur serveur');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px 20px', textAlign: 'center' }}>Chargement...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#c00' }}>Oups !</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (!invite) {
    return null;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Accès fondateur</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Bienvenue ! Tu es invité à rejoindre ShipInDays en tant que fondateur.
        </p>

        <div
          style={{
            padding: '24px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            marginBottom: '30px',
            textAlign: 'left',
          }}
        >
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Email :</strong> {invite.email}
          </p>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>Prix :</strong> <span style={{ fontSize: '24px', fontWeight: '700' }}>$5</span>
            <span style={{ color: '#666' }}>/mois, à vie</span>
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
            ⏰ Lien valable jusqu'au {new Date(invite.expires_at).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <div
          style={{
            padding: '16px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            marginBottom: '30px',
            fontSize: '14px',
            color: '#2e7d32',
          }}
        >
          ✓ Accès complet à toutes les quêtes (1-30) dès le paiement
        </div>

        <button
          onClick={handleCheckout}
          disabled={processing}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: processing ? '#ccc' : '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: processing ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '16px',
          }}
        >
          {processing ? 'Traitement...' : 'Continuer vers le paiement'}
        </button>
      </div>
    </div>
  );
}
