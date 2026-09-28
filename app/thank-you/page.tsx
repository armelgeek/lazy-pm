'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const inviteId = searchParams.get('invite_id');

  const [processed, setProcessed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      if (!sessionId || !inviteId) {
        setError('Paramètres manquants');
        setLoading(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth');
          return;
        }

        // Mark invite as paid
        const { error: updateError } = await supabase
          .from('founder_invites')
          .update({
            paid_at: new Date().toISOString(),
            user_id: user.id,
          })
          .eq('id', inviteId);

        if (updateError) {
          console.error('Error updating invite:', updateError);
          setError('Erreur lors de la confirmation du paiement');
          setLoading(false);
          return;
        }

        // Create subscription record (Stripe webhook will do this too, but ensure it's there)
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // Call API to verify and save subscription
          await fetch('/api/verify-founder-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ inviteId }),
          }).catch(() => {});
        }

        setProcessed(true);
        setLoading(false);

        // Redirect to journey after 3 seconds
        setTimeout(() => {
          router.push('/chemin');
        }, 3000);
      } catch (err) {
        console.error('Error processing payment:', err);
        setError('Erreur serveur');
        setLoading(false);
      }
    };

    processPayment();
  }, [sessionId, inviteId, router]);

  if (loading) {
    return <div style={{ padding: '40px 20px', textAlign: 'center' }}>Vérification du paiement...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#c00' }}>Erreur</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={() => router.push('/chemin')}
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
          Aller au parcours
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>

      <h1 style={{ marginBottom: '20px' }}>Merci d'avoir payé !</h1>

      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
        Ton accès est actif. Tu peux maintenant accéder à toutes les quêtes, y compris les plus
        avancées.
      </p>

      <div
        style={{
          padding: '24px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          marginBottom: '30px',
        }}
      >
        <p style={{ margin: '0 0 12px 0', color: '#2e7d32' }}>
          <strong>✓ Ce soir :</strong>
        </p>
        <p style={{ margin: '0', color: '#2e7d32', fontSize: '14px' }}>
          Commence ta quête #04 et finis-la avant minuit. Ton premier check-in compte dans ta
          série !
        </p>
      </div>

      <p style={{ fontSize: '14px', color: '#999', marginBottom: '20px' }}>
        Tu sera redirigé dans 3 secondes...
      </p>

      <button
        onClick={() => router.push('/chemin')}
        style={{
          padding: '12px 24px',
          backgroundColor: '#1F2421',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        Aller à mon parcours
      </button>
    </div>
  );
}

export default function ThankYou() {
  return (
    <Suspense fallback={<div style={{ padding: '40px 20px', textAlign: 'center' }}>Chargement...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
