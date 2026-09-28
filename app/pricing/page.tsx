'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Pricing() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

      // Fetch subscription status
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSubscription(data);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleCheckout = async (planType: 'monthly' | 'founder') => {
    if (!user) return;

    setCheckoutLoading(true);

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`,
        },
        body: JSON.stringify({
          planType,
          email: user.email,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error starting checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div style={{ padding: '40px 20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Pricing</h1>
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

      {subscription?.status === 'active' && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#e8f5e9',
            border: '1px solid #4caf50',
            borderRadius: '8px',
            marginBottom: '30px',
            color: '#2e7d32',
            fontSize: '14px',
          }}
        >
          ✓ You're subscribed! Your plan ends on {new Date(subscription.current_period_end).toLocaleDateString()}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Monthly Plan */}
        <div
          style={{
            padding: '24px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0' }}>Standard</h3>
          <p style={{ color: '#666', margin: '0 0 24px 0' }}>For builders</p>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '36px', fontWeight: '700' }}>$9</span>
            <span style={{ color: '#666' }}>/month</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>
            <li style={{ marginBottom: '12px' }}>✓ Unlimited plans</li>
            <li style={{ marginBottom: '12px' }}>✓ Full journey access</li>
            <li style={{ marginBottom: '12px' }}>✓ Prompt generation</li>
            <li>✓ Analytics</li>
          </ul>

          <button
            onClick={() => handleCheckout('monthly')}
            disabled={checkoutLoading || subscription?.status === 'active'}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: checkoutLoading ? '#ccc' : '#1F2421',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: checkoutLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            {checkoutLoading ? 'Processing...' : subscription?.status === 'active' ? 'Current plan' : 'Subscribe'}
          </button>
        </div>

        {/* Founder Plan */}
        <div
          style={{
            padding: '24px',
            border: '2px solid #1F2421',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-12px',
              left: '20px',
              padding: '4px 12px',
              backgroundColor: '#1F2421',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            FOUNDER
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '12px 0 8px 0' }}>Founder</h3>
          <p style={{ color: '#666', margin: '0 0 24px 0' }}>For the first 20</p>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '36px', fontWeight: '700' }}>$5</span>
            <span style={{ color: '#666' }}>/month, forever</span>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', color: '#666' }}>
            <li style={{ marginBottom: '12px' }}>✓ Everything in Standard</li>
            <li style={{ marginBottom: '12px' }}>✓ Lifetime pricing</li>
            <li style={{ marginBottom: '12px' }}>✓ Founder badge</li>
            <li>✓ Direct support</li>
          </ul>

          <button
            onClick={() => handleCheckout('founder')}
            disabled={checkoutLoading || subscription?.status === 'active'}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: checkoutLoading ? '#ccc' : '#1F2421',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: checkoutLoading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            {checkoutLoading ? 'Processing...' : subscription?.status === 'active' ? 'Current plan' : 'Get founder pricing'}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>
          By subscribing, you agree to our{' '}
          <a href="/conditions" style={{ color: '#1F2421', textDecoration: 'underline' }}>Terms of Service</a>,{' '}
          <a href="/confidentialite" style={{ color: '#1F2421', textDecoration: 'underline' }}>Privacy Policy</a>, and{' '}
          <a href="/remboursement" style={{ color: '#1F2421', textDecoration: 'underline' }}>Refund Guarantee</a>
        </p>
        <button
          onClick={() => router.push('/chemin')}
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
          ← Back to journey
        </button>
      </div>
    </div>
  );
}
