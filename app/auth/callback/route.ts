import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    // If there's a pending plan in localStorage, it will be transferred client-side
    // after redirect to /chemin
  }

  // Redirect to /chemin (the quest path)
  return NextResponse.redirect(new URL('/chemin', requestUrl.origin));
}
