import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { inviteId } = await request.json();

    // Get invite details
    const { data: invite } = await supabase
      .from('founder_invites')
      .select('*')
      .eq('id', inviteId)
      .maybeSingle();

    if (!invite || !invite.stripe_subscription_id) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    // Create subscription record if not exists
    const { data: existing } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from('subscriptions').insert([
        {
          user_id: userData.user.id,
          stripe_customer_id: invite.stripe_customer_id,
          stripe_subscription_id: invite.stripe_subscription_id,
          plan_type: 'founder',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[VERIFY SUBSCRIPTION] Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify subscription' },
      { status: 500 }
    );
  }
}
