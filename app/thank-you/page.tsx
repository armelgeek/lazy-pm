import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ThankYouContent = dynamic(() => import('./thank-you-content'), {
  ssr: false,
  loading: () => <div style={{ padding: '40px 20px', textAlign: 'center' }}>Chargement...</div>,
});

export default function ThankYou() {
  return (
    <Suspense fallback={<div style={{ padding: '40px 20px', textAlign: 'center' }}>Chargement...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
