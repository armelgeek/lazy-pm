'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface EventStats {
  eventType: string;
  count: number;
}

interface BugReport {
  id: string;
  page: string;
  message: string;
  created_at: string;
  user_agent: string;
}

export default function Analytics() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<EventStats[]>([]);
  const [reports, setReports] = useState<BugReport[]>([]);
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

      // Fetch event stats (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: eventsData } = await supabase
        .from('user_events')
        .select('event_type')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      if (eventsData) {
        const grouped = eventsData.reduce(
          (acc, event) => {
            const existing = acc.find((e) => e.eventType === event.event_type);
            if (existing) {
              existing.count++;
            } else {
              acc.push({ eventType: event.event_type, count: 1 });
            }
            return acc;
          },
          [] as EventStats[]
        );
        setStats(grouped.sort((a, b) => b.count - a.count));
      }

      // Fetch bug reports (last 7 days)
      const { data: reportsData } = await supabase
        .from('bug_reports')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (reportsData) {
        setReports(reportsData);
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

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Analytics · Last 7 days</h1>
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

      {/* Event Stats */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>User Journey</h2>

        {stats.length === 0 ? (
          <p style={{ color: '#999' }}>No events yet. Share your app link and wait for testers!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {stats.map((stat) => (
              <div
                key={stat.eventType}
                style={{
                  padding: '16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                  {stat.eventType.replace(/_/g, ' ').toLowerCase()}
                </p>
                <p style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>{stat.count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bug Reports */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Reported Issues</h2>

        {reports.length === 0 ? (
          <p style={{ color: '#999' }}>No issues reported yet. 🎉</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  padding: '16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>
                    Page: <span style={{ color: '#1F2421' }}>{report.page}</span>
                  </p>
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 0' }}>
                  {report.message}
                </p>
                <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
                  🖥️ {report.user_agent.split(' ').slice(0, 3).join(' ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
