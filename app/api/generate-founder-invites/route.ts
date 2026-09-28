import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { emails, password } = await request.json();

    // Verify password
    if (password !== process.env.FOUNDER_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: 'No emails provided' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const invites = [];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    for (const email of emails) {
      // Check if already invited
      const { data: existing } = await supabase
        .from('founder_invites')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        continue; // Skip if already invited
      }

      const token = crypto.randomBytes(32).toString('hex');

      const { data: invite, error } = await supabase
        .from('founder_invites')
        .insert([
          {
            email,
            invite_token: token,
            expires_at: expiresAt.toISOString(),
          },
        ])
        .select()
        .single();

      if (!error && invite) {
        invites.push({
          email,
          token,
          url: `${request.nextUrl.origin}/founder-checkout/${token}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: invites.length,
      invites,
    });
  } catch (error) {
    console.error('[FOUNDER INVITES] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invites' },
      { status: 500 }
    );
  }
}
