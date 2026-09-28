'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function ReportBugButton({ pageName }: { pageName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert('Please sign in to report a bug');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/report-bug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          page: pageName,
          message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setMessage('');
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error reporting bug:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 16px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '600',
          color: '#666',
          zIndex: 100,
        }}
      >
        🐛 Report issue
      </button>
    );
  }

  if (submitted) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '12px 16px',
          backgroundColor: '#e8f5e9',
          border: '1px solid #4caf50',
          borderRadius: '6px',
          color: '#2e7d32',
          fontSize: '12px',
          fontWeight: '600',
          zIndex: 100,
        }}
      >
        ✓ Thanks for reporting!
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 100,
        maxWidth: '280px',
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>
        Report an issue
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What went wrong?"
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '12px',
            fontFamily: 'inherit',
            minHeight: '60px',
            resize: 'vertical',
          }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={loading || !message.trim()}
            style={{
              flex: 1,
              padding: '8px',
              backgroundColor: loading ? '#ccc' : '#1F2421',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            style={{
              padding: '8px 12px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
