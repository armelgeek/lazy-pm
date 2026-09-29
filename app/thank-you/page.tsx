'use client';

import { Suspense } from 'react';
import ThankYouContent from './thank-you-content';

export default function ThankYou() {
  return (
    <Suspense fallback={<div style={{ padding: '40px 20px', textAlign: 'center' }}>Chargement...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
