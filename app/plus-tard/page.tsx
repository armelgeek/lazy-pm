'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Note {
  id: string;
  quest_id: number;
  type: 'bug' | 'idea' | 'feedback';
  title: string;
  description: string;
  customer_name?: string;
  customer_cancelled?: boolean;
  fixed_at?: string;
  created_at: string;
}

type Filter = 'all' | 'bugs' | 'ideas' | 'feedback';

export default function PlusTard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [currentQuest, setCurrentQuest] = useState(0);

  // Form state
  const [type, setType] = useState<'bug' | 'idea' | 'feedback'>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerCancelled, setCustomerCancelled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Repair state
  const [repairingId, setRepairingId] = useState<string | null>(null);
  const [repairPrompt, setRepairPrompt] = useState('');
  const [repairLoading, setRepairLoading] = useState(false);

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

      // Get current quest
      const { data: planData } = await supabase
        .from('plans')
        .select('plan_data')
        .eq('user_id', user.id)
        .single();

      if (planData) {
        const plan = planData.plan_data;
        const allQuests = [
          ...plan.section1.quests,
          ...plan.section2.quests,
          ...plan.section3.quests,
          ...plan.section4.quests,
        ];
        const active = allQuests.find((q: any) => q.unlocked && !q.completed);
        if (active) {
          setCurrentQuest(active.id);
        }
      }

      // Fetch notes
      const { data: notesData } = await supabase
        .from('later_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (notesData) {
        setNotes(notesData);
      }

      setLoading(false);
    };

    init();
  }, [router]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setSubmitting(true);

    try {
      const { error } = await supabase.from('later_notes').insert([
        {
          user_id: user.id,
          quest_id: currentQuest,
          type,
          title,
          description: description || null,
          customer_name: type === 'feedback' ? customerName : null,
          customer_cancelled: type === 'feedback' ? customerCancelled : null,
        },
      ]);

      if (!error) {
        setTitle('');
        setDescription('');
        setCustomerName('');
        setCustomerCancelled(false);
        setType('bug');

        // Refresh notes
        const { data: notesData } = await supabase
          .from('later_notes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (notesData) {
          setNotes(notesData);
        }
      }
    } catch (err) {
      console.error('Error adding note:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkFixed = async (noteId: string) => {
    const { error } = await supabase
      .from('later_notes')
      .update({ fixed_at: new Date().toISOString() })
      .eq('id', noteId);

    if (!error) {
      setNotes(notes.filter((n) => n.id !== noteId));
    }
  };

  const handleRepairNow = async (note: Note) => {
    setRepairingId(note.id);
    setRepairLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth');
        return;
      }

      const res = await fetch('/api/generate-repair-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          noteType: note.type,
          title: note.title,
          description: note.description,
        }),
      });

      const data = await res.json();

      if (data.prompt) {
        setRepairPrompt(data.prompt);
      }
    } catch (err) {
      console.error('Error generating repair prompt:', err);
    } finally {
      setRepairLoading(false);
    }
  };

  const filteredNotes = notes.filter((n) => {
    if (n.fixed_at) return false;
    if (filter === 'all') return true;
    if (filter === 'bugs') return n.type === 'bug';
    if (filter === 'ideas') return n.type === 'idea';
    if (filter === 'feedback') return n.type === 'feedback';
    return true;
  });

  if (loading) {
    return <div style={{ padding: '40px 20px' }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
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

      <h1 style={{ marginBottom: '30px' }}>Plus tard</h1>

      {/* Form */}
      <form onSubmit={handleAddNote} style={{ marginBottom: '40px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="type" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
              fontSize: '14px',
            }}
          >
            <option value="bug">🐛 Bug à réparer</option>
            <option value="idea">💡 Idée bonus</option>
            <option value="feedback">💬 Retour client</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Titre (obligatoire)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Le bouton copier ne marche pas sur Safari"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Détails
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contexte, environnement, ce qui s'est passé..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {type === 'feedback' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="customer" style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Qui a dit ça ?
              </label>
              <input
                id="customer"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nom du client"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}>
              <input
                type="checkbox"
                checked={customerCancelled}
                onChange={(e) => setCustomerCancelled(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Il a annulé</span>
            </label>
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 24px',
            backgroundColor: submitting ? '#ccc' : '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          {submitting ? 'Ajout...' : 'Noter pour plus tard'}
        </button>
      </form>

      {/* Notes List */}
      <div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(
            [
              { label: 'Tout', value: 'all', count: notes.filter((n) => !n.fixed_at).length },
              { label: 'Bugs', value: 'bugs', count: notes.filter((n) => !n.fixed_at && n.type === 'bug').length },
              { label: 'Idées', value: 'ideas', count: notes.filter((n) => !n.fixed_at && n.type === 'idea').length },
              { label: 'Retours', value: 'feedback', count: notes.filter((n) => !n.fixed_at && n.type === 'feedback').length },
            ] as const
          ).map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === f.value ? '#1F2421' : '#f5f5f5',
                color: filter === f.value ? 'white' : '#1F2421',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotes.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              Rien à afficher
            </p>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: '#fafafa',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#999' }}>
                      {note.type === 'bug' ? '🐛 Bug' : note.type === 'idea' ? '💡 Idée' : '💬 Retour'} • Noté pendant quête #{note.quest_id}
                    </p>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                      {note.title}
                    </h3>
                    {note.description && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                        {note.description}
                      </p>
                    )}
                    {note.type === 'feedback' && (
                      <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                        {note.customer_name} {note.customer_cancelled ? '(annulé)' : ''}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {note.type === 'bug' && (
                      <button
                        onClick={() => handleRepairNow(note)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#1F2421',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Réparer maintenant
                      </button>
                    )}
                    <button
                      onClick={() => handleMarkFixed(note.id)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      C'est réparé
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Repair Panel */}
      {repairingId && (
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
          onClick={() => {
            setRepairingId(null);
            setRepairPrompt('');
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '16px' }}>Réparer maintenant</h2>

            {repairLoading ? (
              <p>Génération du prompt...</p>
            ) : repairPrompt ? (
              <>
                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#1F2421',
                    color: '#fff',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {repairPrompt}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(repairPrompt);
                    alert('Prompt copié !');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#1F2421',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginRight: '8px',
                  }}
                >
                  Copier le prompt
                </button>

                <button
                  onClick={() => {
                    setRepairingId(null);
                    setRepairPrompt('');
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Fermer
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
