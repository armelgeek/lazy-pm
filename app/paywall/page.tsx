'use client';

import { useRouter } from 'next/navigation';

export default function Paywall() {
  const router = useRouter();

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
          🔒 Unlock the journey
        </h1>

        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
          The first 3 quests are free. From quest #04 onwards, you need a subscription to get AI prompts and support.
        </p>

        <div
          style={{
            padding: '24px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            marginBottom: '30px',
          }}
        >
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0' }}>
            Your subscription includes:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: '#666' }}>
            <li style={{ marginBottom: '8px' }}>✓ All 30 quests with AI prompts</li>
            <li style={{ marginBottom: '8px' }}>✓ Unlimited prompt generation</li>
            <li style={{ marginBottom: '8px' }}>✓ Direct support</li>
            <li>✓ Analytics & progress tracking</li>
          </ul>
        </div>

        <button
          onClick={() => router.push('/pricing')}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#1F2421',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            marginBottom: '12px',
          }}
        >
          Subscribe now
        </button>

        <button
          onClick={() => router.back()}
          style={{
            width: '100%',
            padding: '12px',
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
    </div>
  );
}
