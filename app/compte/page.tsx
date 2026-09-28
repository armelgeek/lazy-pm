'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Subscription {
  stripe_subscription_id: string;
  plan_type: string;
  status: string;
  current_period_end: string;
}

export default function Compte() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [timezone, setTimezone] = useState('UTC');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth');
        return;
      }

      setUser(user);

      // Get subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subData) {
        setSubscription(subData);
      }

      // Get user preferences (timezone)
      const savedTz = localStorage.getItem('timezone');
      if (savedTz) {
        setTimezone(savedTz);
      } else {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(tz);
        localStorage.setItem('timezone', tz);
      }

      setLoading(false);
    };

    init();
  }, [router]);

  const handleExportData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth');
        return;
      }

      // Fetch all user data
      const [plansRes, checkinRes, notesRes] = await Promise.all([
        supabase.from('plans').select('*').eq('user_id', user.id),
        supabase.from('daily_checkins').select('*').eq('user_id', user.id),
        supabase.from('later_notes').select('*').eq('user_id', user.id),
      ]);

      const exportData = {
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
        },
        plan: plansRes.data?.[0],
        checkins: checkinRes.data || [],
        notes: notesRes.data || [],
        exportedAt: new Date().toISOString(),
      };

      // Download as JSON
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lazypm-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Erreur lors de l\'export');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'supprimer mon compte') {
      alert('Tape le texte exact pour confirmer');
      return;
    }

    try {
      // Cancel subscription if exists
      if (subscription) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          await fetch('/api/cancel-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
          }).catch(() => {});
        }
      }

      // Delete user account
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await supabase.auth.admin.deleteUser(user.id);
      }

      // Sign out
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px 20px' }}>Chargement...</div>;
  }

  const planLabels: Record<string, string> = {
    monthly: 'Standard - $9/mois',
    founder: 'Founder - $5/mois à vie',
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => router.push('/chemin')}
        style={{
          background: 'none',
          border: 'none',
          color: '#1F2421',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          marginBottom: '30px',
        }}
      >
        ← Retour
      </button>

      <h1 style={{ marginBottom: '30px' }}>Mon compte</h1>

      {/* Email */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '30px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
          Email
        </h3>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
          {user?.email}
        </p>
      </div>

      {/* Subscription */}
      {subscription && (
        <div
          style={{
            padding: '24px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '1px solid #4caf50',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
            Abonnement
          </h3>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
            <strong>Formule :</strong> {planLabels[subscription.plan_type] || 'Unknown'}
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
            <strong>Statut :</strong> {subscription.status === 'active' ? '✓ Actif' : 'Inactif'}
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
            <strong>Prochain paiement :</strong>{' '}
            {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={() => window.open('https://billing.stripe.com/login', '_blank')}
              style={{
                padding: '12px',
                backgroundColor: '#1F2421',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Gérer le paiement
            </button>
            <button
              onClick={() => window.open('https://billing.stripe.com/login', '_blank')}
              style={{
                padding: '12px',
                backgroundColor: '#f5f5f5',
                color: '#1F2421',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Factures
            </button>
          </div>
        </div>
      )}

      {/* Timezone */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '30px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
          Fuseau horaire
        </h3>
        <select
          value={timezone}
          onChange={(e) => {
            setTimezone(e.target.value);
            localStorage.setItem('timezone', e.target.value);
          }}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            fontFamily: 'inherit',
            fontSize: '14px',
          }}
        >
          {Intl.supportedValuesOf('timeZone').map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Data */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '30px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
          Mes données
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
          Télécharge une copie de toutes tes données (plan, check-ins, notes).
        </p>
        <button
          onClick={handleExportData}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          📥 Télécharger mes données
        </button>
      </div>

      {/* Danger Zone */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#ffe0e0',
          borderRadius: '8px',
          border: '1px solid #f00',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#c00' }}>
          Zone dangereuse
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
          Supprimer ton compte arrêtera aussi ton abonnement. Cette action est irréversible.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#c00',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          🗑️ Supprimer mon compte
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
            }}
          >
            <h2 style={{ margin: '0 0 16px 0' }}>Supprimer mon compte ?</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Cette action est irréversible. Ton abonnement sera aussi annulé et tu ne seras plus prélevé.
            </p>

            <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Tape : <strong>supprimer mon compte</strong>
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="supprimer mon compte"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontFamily: 'inherit',
                fontSize: '14px',
                marginBottom: '20px',
                boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                style={{
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'supprimer mon compte'}
                style={{
                  padding: '12px',
                  backgroundColor: deleteConfirmText === 'supprimer mon compte' ? '#c00' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: deleteConfirmText === 'supprimer mon compte' ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
