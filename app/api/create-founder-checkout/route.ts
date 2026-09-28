import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  try {
    console.log('[FOUNDER CHECKOUT] Starting');

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

    const { inviteId, email } = await request.json();

    // Verify invite exists and is valid
    const { data: invite, error: inviteError } = await supabase
      .from('founder_invites')
      .select('*')
      .eq('id', inviteId)
      .maybeSingle();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 });
    }

    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invite expired' }, { status: 400 });
    }

    // Check if already paid
    if (invite.paid_at) {
      return NextResponse.json({ error: 'Already paid' }, { status: 400 });
    }

    // Get or create Stripe customer
    let customerId = invite.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: invite.email,
        metadata: {
          userId: userData.user.id,
          inviteId: invite.id,
        },
      });
      customerId = customer.id;

      // Update invite with customer ID
      await supabase
        .from('founder_invites')
        .update({ stripe_customer_id: customerId })
        .eq('id', invite.id);
    }

    // Create checkout session with founder price
    const founderPriceId = process.env.STRIPE_FOUNDER_PRICE_ID?.trim();

    if (!founderPriceId) {
      console.error('[FOUNDER CHECKOUT] Founder price ID not configured');
      return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: founderPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}&invite_id=${invite.id}`,
      cancel_url: `${request.nextUrl.origin}/founder-checkout/${invite.invite_token}`,
      metadata: {
        userId: userData.user.id,
        inviteId: invite.id,
        planType: 'founder',
      },
    });

    console.log('[FOUNDER CHECKOUT] Session created:', session.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[FOUNDER CHECKOUT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}
