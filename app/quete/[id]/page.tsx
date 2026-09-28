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
          // Check if prompt already exists
          const { data: promptData, error } = await supabase
            .from('quest_prompts')
            .select('prompt')
            .eq('user_id', user.id)
            .eq('quest_id', questId)
            .maybeSingle();

          if (promptData?.prompt) {
            setPrompt(promptData.prompt);
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

  if (loading) {
    return <div style={{ padding: '40px 20px' }}>Loading...</div>;
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
        <button
          onClick={generatePrompt}
          disabled={promptLoading}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: promptLoading ? '#ccc' : '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: promptLoading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            marginBottom: '20px',
          }}
        >
          {promptLoading ? 'Generating prompt...' : 'Generate prompt for today'}
        </button>
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

      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#666', margin: '0 0 12px 0' }}>
          // Checkpoints
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" style={{ cursor: 'pointer' }} />
            <span style={{ fontSize: '14px' }}>Task 1 completed</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" style={{ cursor: 'pointer' }} />
            <span style={{ fontSize: '14px' }}>Task 2 completed</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" style={{ cursor: 'pointer' }} />
            <span style={{ fontSize: '14px' }}>Task 3 completed</span>
          </label>
        </div>
      </div>
    </div>
  );
}
