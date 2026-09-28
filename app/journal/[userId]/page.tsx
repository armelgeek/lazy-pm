'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface CheckinEntry {
  quest_id: number;
  status: string;
  notes: string;
  date_utc: string;
}

export default function Journal() {
  const params = useParams();
  const userId = params.userId as string;

  const [entries, setEntries] = useState<CheckinEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [publicNote, setPublicNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [followerEmail, setFollowerEmail] = useState('');
  const [followerLoading, setFollowerLoading] = useState(false);
  const [followerMessage, setFollowerMessage] = useState('');

  useEffect(() => {
    const loadJournal = async () => {
      // Get public check-ins
      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('quest_id, status, notes, date_utc')
        .eq('user_id', userId)
        .eq('is_public', true)
        .order('date_utc', { ascending: false })
        .limit(30);

      if (checkins) {
        setEntries(checkins);
      }

      // Get public note
      const { data: note } = await supabase
        .from('public_notes')
        .select('content')
        .eq('user_id', userId)
        .maybeSingle();

      if (note) {
        setPublicNote(note.content);
      }

      // Get streak
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', userId)
        .maybeSingle();

      if (streakData) {
        setStreak(streakData.current_streak);
      }

      setLoading(false);
    };

    loadJournal();
  }, [userId]);

  const handleFollowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followerEmail.trim()) return;

    setFollowerLoading(true);
    setFollowerMessage('');

    try {
      const token = Math.random().toString(36).substring(7);
      await supabase.from('journal_followers').insert([
        {
          user_id: userId,
          follower_email: followerEmail,
          confirmation_token: token,
          confirmed: false,
        },
      ]);

      setFollowerEmail('');
      setFollowerMessage('✓ Email reçu ! Tu recevras les updates du journal.');
    } catch (err) {
      console.error('Follower error:', err);
      setFollowerMessage('Erreur lors de l\'inscription');
    } finally {
      setFollowerLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px 20px' }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '12px' }}>Le journal de la construction</h1>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '30px' }}>
        Build in public • {streak} jours de série
      </p>

      {/* Public Note */}
      {publicNote && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            marginBottom: '30px',
            borderLeft: '4px solid #1F2421',
          }}
        >
          <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
            {publicNote}
          </p>
        </div>
      )}

      {/* Entries */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Derniers check-ins</h2>

        {entries.length === 0 ? (
          <p style={{ color: '#999' }}>Aucun check-in public encore.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {entries.map((entry, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  backgroundColor: '#f5f5f5',
                  borderLeft: '4px solid #1F2421',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>Quête #{entry.quest_id}</span>
                  <span style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(entry.date_utc).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    backgroundColor: '#1F2421',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginBottom: '8px',
                  }}
                >
                  {entry.status === 'completed' ? '✓ Terminée' : entry.status === 'partial' ? '◐ À moitié' : '◯ Pas touché'}
                </span>
                {entry.notes && (
                  <p style={{ fontSize: '13px', color: '#666', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                    {entry.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Follow */}
      <div
        style={{
          padding: '24px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          borderTop: '1px solid #ddd',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>Suivre le journal</h3>
        <form onSubmit={handleFollowSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginBottom: '12px' }}>
          <input
            type="email"
            value={followerEmail}
            onChange={(e) => setFollowerEmail(e.target.value)}
            placeholder="Ton email"
            required
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            disabled={followerLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: followerLoading ? '#ccc' : '#1F2421',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: followerLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            {followerLoading ? 'Chargement...' : 'Suivre'}
          </button>
        </form>
        {followerMessage && (
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: followerMessage.includes('Erreur') ? '#c00' : '#0a7a3e',
              backgroundColor: followerMessage.includes('Erreur') ? '#ffe0e0' : '#e8f5e9',
              padding: '8px',
              borderRadius: '4px',
            }}
          >
            {followerMessage}
          </p>
        )}
      </div>
    </div>
  );
}
