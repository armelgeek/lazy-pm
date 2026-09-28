'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface EmailPreferences {
  checkin_reminder_enabled: boolean;
  checkin_reminder_time: string;
  weekly_summary_enabled: boolean;
  weekly_summary_day: string;
  weekly_summary_time: string;
  unsubscribed: boolean;
}

export default function EmailPreferences() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [prefs, setPrefs] = useState<EmailPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      // Get preferences
      const { data } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setPrefs(data);
      } else {
        // Create default preferences
        const defaultPrefs: EmailPreferences = {
          checkin_reminder_enabled: true,
          checkin_reminder_time: '22:00',
          weekly_summary_enabled: true,
          weekly_summary_day: 'sunday',
          weekly_summary_time: '08:00',
          unsubscribed: false,
        };
        setPrefs(defaultPrefs);
      }

      setLoading(false);
    };

    init();
  }, [router]);

  const handleSave = async () => {
    if (!prefs) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('email_preferences')
        .upsert([
          {
            user_id: user.id,
            ...prefs,
          },
        ]);

      if (!error) {
        alert('Préférences sauvegardées !');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px 20px' }}>Chargement...</div>;
  }

  if (!prefs) {
    return null;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <button
        onClick={() => router.push('/compte')}
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

      <h1 style={{ marginBottom: '30px' }}>Emails et rappels</h1>

      {/* Check-in Reminder */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <input
            type="checkbox"
            checked={prefs.checkin_reminder_enabled}
            onChange={(e) =>
              setPrefs({ ...prefs, checkin_reminder_enabled: e.target.checked })
            }
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
          />
          <label style={{ cursor: 'pointer', flex: 1, margin: 0 }}>
            <strong>Rappel du soir</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
              Reçois un rappel chaque soir si tu n'as pas fait ton check-in
            </p>
          </label>
        </div>

        {prefs.checkin_reminder_enabled && (
          <div style={{ marginLeft: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              À quelle heure ? (dans ton fuseau horaire)
            </label>
            <input
              type="time"
              value={prefs.checkin_reminder_time}
              onChange={(e) =>
                setPrefs({ ...prefs, checkin_reminder_time: e.target.value })
              }
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontFamily: 'inherit',
                fontSize: '14px',
                width: '100%',
              }}
            />
          </div>
        )}
      </div>

      {/* Weekly Summary */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <input
            type="checkbox"
            checked={prefs.weekly_summary_enabled}
            onChange={(e) =>
              setPrefs({ ...prefs, weekly_summary_enabled: e.target.checked })
            }
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
          />
          <label style={{ cursor: 'pointer', flex: 1, margin: 0 }}>
            <strong>Résumé hebdomadaire</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>
              Reçois un résumé de ta semaine (quêtes, série, date de lancement)
            </p>
          </label>
        </div>

        {prefs.weekly_summary_enabled && (
          <div style={{ marginLeft: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  Quel jour ?
                </label>
                <select
                  value={prefs.weekly_summary_day}
                  onChange={(e) =>
                    setPrefs({ ...prefs, weekly_summary_day: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                  }}
                >
                  <option value="monday">Lundi</option>
                  <option value="tuesday">Mardi</option>
                  <option value="wednesday">Mercredi</option>
                  <option value="thursday">Jeudi</option>
                  <option value="friday">Vendredi</option>
                  <option value="saturday">Samedi</option>
                  <option value="sunday">Dimanche</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  À quelle heure ?
                </label>
                <input
                  type="time"
                  value={prefs.weekly_summary_time}
                  onChange={(e) =>
                    setPrefs({ ...prefs, weekly_summary_time: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Unsubscribe */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#ffe0e0',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', margin: 0 }}>
          <input
            type="checkbox"
            checked={prefs.unsubscribed}
            onChange={(e) =>
              setPrefs({ ...prefs, unsubscribed: e.target.checked })
            }
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
          />
          <span style={{ fontSize: '14px' }}>Ne plus recevoir d'emails</span>
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: saving ? '#ccc' : '#1F2421',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: saving ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        {saving ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
      </button>
    </div>
  );
}
