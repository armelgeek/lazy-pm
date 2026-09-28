'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

function AuthContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const mode = searchParams.get('mode') || 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(`❌ ${error.message}`);
        return;
      }

      setEmailSent(true);
      setMessage('✅ Check your email for the login link!');
    } catch (err) {
      setMessage('❌ Connection error');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Check your email</h1>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
            We sent a login link to <strong>{email}</strong>. Click it to sign in.
          </p>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '20px' }}>
            If you don't see it, check your spam folder or{' '}
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#1F2421',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              try again
            </button>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Welcome to ShipInDays</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Sign in or create an account with your email.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="email" style={{ fontWeight: '600', fontSize: '14px' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          {loading ? 'Sending link...' : 'Send login link'}
        </button>

        {message && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: message.includes('❌') ? '#ffebee' : '#e8f5e9',
              borderRadius: '8px',
              color: message.includes('❌') ? '#c62828' : '#2e7d32',
              fontSize: '14px',
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div style={{ padding: '40px 20px' }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}
