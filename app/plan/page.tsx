'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
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

interface PlanData {
  plan: {
    section1: Section;
    section2: Section;
    section3: Section;
    section4: Section;
  };
  totalQuests: number;
  totalHours: number;
  daysNeeded: number;
  launchDate: string;
}

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ideaInitial = searchParams.get('idea') || '';
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [message, setMessage] = useState('');
  const [skippedQuests, setSkippedQuests] = useState<Set<number>>(new Set());
  const [customHours, setCustomHours] = useState<Record<number, number>>({});
  const [timePerDay, setTimePerDay] = useState('1 hour');
  const [idea, setIdea] = useState(ideaInitial);
  const [user, setUser] = useState<any>(null);
  const [savingPlan, setSavingPlan] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const savePlan = async (plan: PlanData) => {
    if (!user) {
      // Store in localStorage for non-authenticated users
      localStorage.setItem('pendingPlan', JSON.stringify(plan.plan));
      // Redirect to auth
      router.push('/auth');
      return;
    }

    setSavingPlan(true);
    try {
      const { error } = await supabase.from('plans').insert([
        {
          user_id: user.id,
          plan_data: plan.plan,
        },
      ]);

      if (error) {
        setMessage('❌ Error saving plan');
        return;
      }

      // Redirect to journey
      router.push('/chemin');
    } catch (err) {
      setMessage('❌ Connection error');
    } finally {
      setSavingPlan(false);
    }
  };

  const generatePlan = async () => {
    if (!idea.trim()) {
      setMessage('❌ Please describe your idea first');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          tool: 'Claude Code',
          timePerDay,
          monetization: 'Free prototype',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Failed to generate plan');
        return;
      }

      setPlanData(data.data);
    } catch (err) {
      setMessage('❌ Connection error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkip = (questId: number) => {
    const newSkipped = new Set(skippedQuests);
    if (newSkipped.has(questId)) {
      newSkipped.delete(questId);
    } else {
      newSkipped.add(questId);
    }
    setSkippedQuests(newSkipped);
  };

  const calculateLaunchDate = () => {
    if (!planData) return '';

    let totalHours = 0;
    const sections = [
      planData.plan.section1,
      planData.plan.section2,
      planData.plan.section3,
      planData.plan.section4,
    ];

    sections.forEach((section) => {
      section.quests.forEach((quest) => {
        if (!skippedQuests.has(quest.id)) {
          totalHours += customHours[quest.id] || quest.hours;
        }
      });
    });

    const dailyHours = timePerDay === '30 minutes' ? 0.5 : timePerDay === '1 hour' ? 1 : timePerDay === '2 hours' ? 2 : 3;
    const daysNeeded = Math.ceil(totalHours / dailyHours);
    const launchDate = new Date(Date.now() + daysNeeded * 24 * 60 * 60 * 1000);

    return launchDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!planData) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Your 30-day plan</h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          We'll break down your idea into 30 quests: the exact task for each day until your first paying customer.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="idea" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Your idea
          </label>
          <textarea
            id="idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="I want to build a tool that..."
            style={{
              width: '100%',
              padding: '12px',
              minHeight: '80px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="timePerDay" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            How much time per day?
          </label>
          <select
            id="timePerDay"
            value={timePerDay}
            onChange={(e) => setTimePerDay(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          >
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="2 hours">2 hours</option>
            <option value="3 hours">3 hours or more</option>
          </select>
        </div>

        <button
          onClick={generatePlan}
          disabled={loading || !idea.trim()}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading || !idea.trim() ? '#ccc' : '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || !idea.trim() ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          {loading ? 'Generating your plan...' : 'Generate my plan'}
        </button>

        {message && (
          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#ffebee', borderRadius: '8px', color: '#c62828' }}>
            {message}
          </div>
        )}
      </div>
    );
  }

  const sections = [
    planData.plan.section1,
    planData.plan.section2,
    planData.plan.section3,
    planData.plan.section4,
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1>Your 30-day plan</h1>
        <p style={{ color: '#666', margin: '10px 0 0 0' }}>
          Launch on: <strong>{calculateLaunchDate()}</strong>
        </p>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>
            Section {idx + 1} · {section.title}
          </h2>

          <div style={{ display: 'grid', gap: '12px' }}>
            {section.quests.map((quest) => (
              <div
                key={quest.id}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  backgroundColor: skippedQuests.has(quest.id) ? '#f5f5f5' : '#fff',
                  opacity: skippedQuests.has(quest.id) ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={skippedQuests.has(quest.id)}
                    onChange={() => toggleSkip(quest.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#999' }}>
                    #{String(quest.id).padStart(2, '0')} {quest.isBoss && '· BOSS'}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                  {quest.title}
                </h3>

                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
                  {quest.objective}
                </p>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', color: '#999' }}>
                    Duration:
                    <input
                      type="number"
                      value={customHours[quest.id] || quest.hours}
                      onChange={(e) =>
                        setCustomHours({
                          ...customHours,
                          [quest.id]: parseFloat(e.target.value),
                        })
                      }
                      style={{
                        marginLeft: '8px',
                        width: '60px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '12px',
                      }}
                    />
                    hours
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div
        style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          textAlign: 'center',
          marginTop: '40px',
          marginBottom: '20px',
        }}
      >
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
          {planData.plan.section1.quests.length +
            planData.plan.section2.quests.length +
            planData.plan.section3.quests.length +
            planData.plan.section4.quests.length -
            skippedQuests.size}{' '}
          quests remaining
        </p>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>
          Launch: {calculateLaunchDate()}
        </h2>
      </div>

      <button
        onClick={() => savePlan(planData)}
        disabled={savingPlan}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: savingPlan ? '#ccc' : '#1F2421',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: savingPlan ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        {savingPlan ? 'Saving...' : 'Save plan & start journey'}
      </button>
    </div>
  );
}

export default function Plan() {
  return (
    <Suspense fallback={<div style={{ padding: '40px 20px' }}>Loading...</div>}>
      <PlanContent />
    </Suspense>
  );
}
