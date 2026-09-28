'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Quest {
  id: number;
  title: string;
  objective: string;
  hours: number;
  isBoss?: boolean;
}

interface Section {
  title: string;
  quests: Quest[];
}

export default function Chemin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedQuests, setCompletedQuests] = useState<Set<number>>(new Set());

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

      // Check for pending plan in localStorage
      const pendingPlan = localStorage.getItem('pendingPlan');
      if (pendingPlan) {
        try {
          const planData = JSON.parse(pendingPlan);
          const { error } = await supabase.from('plans').insert([
            {
              user_id: user.id,
              plan_data: planData,
            },
          ]);

          if (!error) {
            localStorage.removeItem('pendingPlan');
            setPlan(planData);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error transferring plan:', err);
        }
      }

      // Fetch user's plan
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setPlan(data.plan_data);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div style={{ padding: '40px 20px' }}>Loading...</div>;
  }

  if (!plan) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1>No plan yet</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Generate your 30-day plan to see your journey here.
        </p>
        <button
          onClick={() => router.push('/plan')}
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
          Generate plan
        </button>
        <button
          onClick={handleLogout}
          style={{
            marginLeft: '12px',
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
          Logout
        </button>
      </div>
    );
  }

  const sections = [plan.section1, plan.section2, plan.section3, plan.section4];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Your 30-day journey</h1>
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

      {sections.map((section: Section, idx: number) => (
        <div key={idx} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
            Section {idx + 1} · {section.title}
          </h2>

          <div style={{ display: 'grid', gap: '12px' }}>
            {section.quests.map((quest: Quest) => (
              <button
                key={quest.id}
                onClick={() => router.push(`/quete/${quest.id}`)}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9f9f9';
                  e.currentTarget.style.borderColor = '#1F2421';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.borderColor = '#ddd';
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#999', minWidth: '40px' }}>
                    #{String(quest.id).padStart(2, '0')} {quest.isBoss && '· BOSS'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                      {quest.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                      {quest.objective}
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', color: '#999', minWidth: '50px', textAlign: 'right' }}>
                    {quest.hours}h
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
