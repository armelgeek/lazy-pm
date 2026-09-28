'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Quete() {
  const router = useRouter();
  const params = useParams();
  const questId = parseInt(params.id as string);

  const [user, setUser] = useState<any>(null);
  const [quest, setQuest] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [promptLoading, setPromptLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [needsPaywall, setNeedsPaywall] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotMessage, setCopilotMessage] = useState('');
  const [copilotResponse, setCopilotResponse] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth');
        return;
      }

      setUser(user);

      // Check subscription for quests 4+
      if (questId >= 4) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!subData || subData.status !== 'active') {
          setIsSubscribed(false);
          setLoading(false);
          return;
        }
      }

      // Fetch user's plan
      const { data: planData } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (planData) {
        const plan = planData.plan_data;
        const sections = [plan.section1, plan.section2, plan.section3, plan.section4];
        let foundQuest = null;

        for (const section of sections) {
          foundQuest = section.quests.find((q: any) => q.id === questId);
          if (foundQuest) break;
        }

        if (foundQuest) {
          setQuest(foundQuest);
          // Check if prompt already exists via API
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session) {
            const res = await fetch(`/api/get-quest-prompt?questId=${questId}`, {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            const data = await res.json();
            if (data.prompt) {
              setPrompt(data.prompt);
            }
          }
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [router, questId]);

  const generatePrompt = async () => {
    if (prompt) return; // Already has a prompt

    setPromptLoading(true);
    try {
      // Get session to get auth token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const res = await fetch('/api/generate-quest-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          questId,
          questTitle: quest.title,
          questObjective: quest.objective,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPrompt(data.prompt);
      } else if (res.status === 403 && data.needsPaywall) {
        setNeedsPaywall(true);
        setIsSubscribed(false);
      }
    } catch (err) {
      console.error('Error generating prompt:', err);
    } finally {
      setPromptLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotMessage.trim()) return;

    setCopilotLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth');
        return;
      }

      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          questId,
          userMessage: copilotMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCopilotResponse(data.error || 'Erreur');
        setCopilotMessage('');
        return;
      }

      setCopilotResponse(data.response);
      setCopilotMessage('');
    } catch (err) {
      console.error('Copilot error:', err);
      setCopilotResponse('Erreur serveur');
    } finally {
      setCopilotLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px 20px' }}>Loading...</div>;
  }

  if (!isSubscribed && questId >= 4) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
          🔒 Quest locked
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
          Quests #04 and beyond are only available to subscribers. Subscribe to unlock this quest and access AI-generated prompts.
        </p>
        <button
          onClick={() => router.push('/pricing')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            marginRight: '12px',
          }}
        >
          Subscribe
        </button>
        <button
          onClick={() => router.push('/chemin')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f5f5f5',
            color: '#1F2421',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          Back
        </button>
      </div>
    );
  }

  if (!quest) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>Quest not found</h1>
        <button onClick={() => router.push('/chemin')} style={{ marginTop: '20px' }}>
          Back to journey
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <button
            onClick={() => router.push('/chemin')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1F2421',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              marginBottom: '12px',
            }}
          >
            ← Back
          </button>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#999', display: 'block' }}>
            #{String(quest.id).padStart(2, '0')} {quest.isBoss && '· BOSS'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            color: '#1F2421',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '12px',
          }}
        >
          Logout
        </button>
      </div>

      <h1 style={{ marginBottom: '20px' }}>{quest.title}</h1>

      <div
        style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '30px',
        }}
      >
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#666', margin: '0 0 12px 0' }}>
          // Objective
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.6', margin: 0 }}>{quest.objective}</p>
      </div>

      {!prompt && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={generatePrompt}
            disabled={promptLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: promptLoading ? '#ccc' : '#1F2421',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: promptLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            {promptLoading ? 'Generating...' : 'Generate prompt'}
          </button>
          {isSubscribed && (
            <button
              onClick={() => setShowCopilot(true)}
              style={{
                padding: '12px 24px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              🆘 Je suis bloqué
            </button>
          )}
        </div>
      )}

      {prompt && (
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: '#666', margin: '0 0 12px 0' }}>
            // Prompt to paste
          </p>
          <pre
            style={{
              backgroundColor: '#1F2421',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '13px',
              lineHeight: '1.5',
              fontFamily: 'monospace',
            }}
          >
            {prompt}
          </pre>

          <button
            onClick={handleCopy}
            style={{
              marginTop: '12px',
              padding: '12px 24px',
              backgroundColor: copied ? '#4caf50' : '#1F2421',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'background-color 0.3s',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy prompt'}
          </button>
        </div>
      )}

      {/* Copilot Panel */}
      {showCopilot && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
          onClick={() => {
            if (copilotResponse === '') {
              setShowCopilot(false);
            }
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px 12px 0 0',
              padding: '20px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Je suis bloqué</h2>
              <button
                onClick={() => {
                  setShowCopilot(false);
                  setCopilotResponse('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#999',
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#f9f9f9',
                borderRadius: '6px',
                minHeight: '100px',
              }}
            >
              {copilotResponse ? (
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {copilotResponse}
                </div>
              ) : (
                <p style={{ color: '#999', margin: 0 }}>Pose ta question...</p>
              )}
            </div>

            <form
              onSubmit={handleCopilotSubmit}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '8px',
              }}
            >
              <input
                type="text"
                value={copilotMessage}
                onChange={(e) => setCopilotMessage(e.target.value)}
                placeholder="Décris ce qui te bloque..."
                disabled={copilotLoading}
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
                disabled={copilotLoading || !copilotMessage.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: copilotLoading ? '#ccc' : '#1F2421',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: copilotLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                }}
              >
                {copilotLoading ? 'Chargement...' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
