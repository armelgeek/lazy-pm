'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Objective {
  id: string;
  text: string;
  checked: boolean;
}

export default function Checkin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentQuest, setCurrentQuest] = useState<any>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [state, setState] = useState<'done' | 'half' | 'none'>('none');
  const [notes, setNotes] = useState('');
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [isPublic, setIsPublic] = useState(false);

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

      // Get user's current quest
      const { data: planData } = await supabase
        .from('plans')
        .select('plan_data')
        .eq('user_id', user.id)
        .single();

      if (planData) {
        let plan = planData.plan_data;
        let needsUpdate = false;

        // Initialize quest statuses if missing
        [plan.section1, plan.section2, plan.section3, plan.section4].forEach((section) => {
          section.quests.forEach((quest: any) => {
            if (quest.unlocked === undefined) {
              quest.unlocked = quest.id <= 3;
              quest.completed = false;
              needsUpdate = true;
            }
          });
        });

        if (needsUpdate) {
          await supabase.from('plans').update({ plan_data: plan }).eq('user_id', user.id);
        }

        const allQuests = [
          ...plan.section1.quests,
          ...plan.section2.quests,
          ...plan.section3.quests,
          ...plan.section4.quests,
        ];

        // Find first unlocked quest
        const active = allQuests.find((q: any) => q.unlocked && !q.completed);
        if (active) {
          setCurrentQuest(active);
          // Parse objectives from quest description (simplified)
          const objs: Objective[] = [
            { id: '1', text: 'Objectif 1 du jour', checked: false },
            { id: '2', text: 'Objectif 2 du jour', checked: false },
            { id: '3', text: 'Objectif 3 du jour', checked: false },
            { id: '4', text: 'Objectif 4 du jour', checked: false },
            { id: '5', text: 'Objectif 5 du jour', checked: false },
            { id: '6', text: 'Objectif 6 du jour', checked: false },
          ];
          setObjectives(objs);
        }
      }

      // Get user's current streak
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', user.id)
        .maybeSingle();

      if (streakData) {
        setStreak(streakData.current_streak || 0);
      }

      setLoading(false);
    };

    init();
  }, [router]);

  const toggleObjective = (id: string) => {
    setObjectives(objs =>
      objs.map(o => (o.id === id ? { ...o, checked: !o.checked } : o))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (state !== 'done' && !notes.trim()) {
      setError('Les deux lignes sont obligatoires');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth');
        return;
      }

      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          questId: currentQuest.id,
          questTitle: currentQuest.title,
          state,
          notes: state === 'done' ? '' : notes,
          objectives: objectives.filter(o => o.checked),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          isPublic,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400) {
          setError('Tu as déjà fait ton check-in ce soir !');
        } else {
          setError('Erreur lors du check-in');
        }
        return;
      }

      setAiResponse(data.ai);
      setStreak(data.streak);

      // Show AI response for 3 seconds then redirect
      setTimeout(() => {
        router.push('/chemin');
      }, 3000);
    } catch (err) {
      console.error('Check-in error:', err);
      setError('Erreur serveur');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px 20px' }}>Chargement...</div>;
  }

  if (!currentQuest) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>Pas de quête active</h1>
        <button onClick={() => router.push('/chemin')}>Retour</button>
      </div>
    );
  }

  if (aiResponse) {
    return (
      <div
        style={{
          padding: '40px 20px',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '52px', marginBottom: '20px' }}>✨</div>
        <h1>{aiResponse.title}</h1>
        <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
          {aiResponse.message}
        </p>
        <p style={{ fontSize: '14px', color: '#999' }}>
          Redirection en cours...
        </p>
      </div>
    );
  }

  const checkedCount = objectives.filter(o => o.checked).length;
  const needsLines = state !== 'done';

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
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

      <h1 style={{ marginBottom: '20px' }}>
        Où t'en es sur « {currentQuest.title} » ?
      </h1>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginBottom: '30px',
          }}
        >
          {/* GAUCHE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Objectifs */}
            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#999',
                  marginBottom: '12px',
                }}
              >
                // 1 — coche ce que t'as vraiment testé
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {objectives.map(obj => (
                  <label
                    key={obj.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: obj.checked ? '#f5f5f5' : 'transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={obj.checked}
                      onChange={() => toggleObjective(obj.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px' }}>{obj.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* État */}
            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#999',
                  marginBottom: '12px',
                }}
              >
                // 2 — où t'en es ce soir
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(['done', 'half', 'none'] as const).map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="state"
                      value={s}
                      checked={state === s}
                      onChange={() => setState(s)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px' }}>
                      {s === 'done' ? 'Terminée' : s === 'half' ? 'À moitié' : 'Pas touché'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            {needsLines && (
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#999',
                    marginBottom: '12px',
                  }}
                >
                  // 3 — deux lignes, obligatoire
                </p>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Ce qui s'est passé ce soir, et ce qui coince…"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                  }}
                  required
                />
              </div>
            )}
          </div>

          {/* DROITE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Série */}
            <div
              style={{
                padding: '20px',
                backgroundColor: '#fffaf5',
                borderRadius: '8px',
                border: '1px solid #f5dcc8',
              }}
            >
              <p style={{ fontSize: '14px', color: '#999', margin: '0 0 8px 0' }}>
                Série actuelle
              </p>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#C8952A',
                  margin: 0,
                }}
              >
                {streak} jour{streak > 1 ? 's' : ''}
              </div>
              <p style={{ fontSize: '12px', color: '#999', margin: '8px 0 0 0' }}>
                Continue ton rythme !
              </p>
            </div>

            {/* Résumé */}
            <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', margin: 0, color: '#666' }}>
                {checkedCount}/6 objectifs · {state === 'done' ? 'terminée' : state === 'half' ? 'à moitié' : 'pas touché'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#ffe0e0',
              borderRadius: '6px',
              color: '#c00',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px' }}>Publier dans mon journal</span>
        </label>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={() => router.push('/chemin')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            J'arrête pour aujourd'hui
          </button>
          <button
            type="submit"
            disabled={submitting || (needsLines && !notes.trim())}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: submitting ? '#ccc' : '#1F2421',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            {submitting ? 'Validation...' : 'Valider le check-in'}
          </button>
        </div>
      </form>
    </div>
  );
}
