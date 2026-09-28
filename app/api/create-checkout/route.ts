import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  try {
    console.log('[CHECKOUT] Starting checkout creation');

    const authHeader = request.headers.get('Authorization');
    console.log('[CHECKOUT] Auth header:', authHeader?.slice(0, 20) + '...');

    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[CHECKOUT] Missing auth header');
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
    console.log('[CHECKOUT] User:', userData.user?.id);

    if (!userData.user) {
      console.log('[CHECKOUT] No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, email } = await request.json();
    console.log('[CHECKOUT] Plan type:', planType);
    console.log('[CHECKOUT] Stripe keys configured:', !!process.env.STRIPE_SECRET_KEY);

    // Check if founder (email in list)
    const founderList = (process.env.FOUNDER_EMAILS || '').split(',').map(e => e.trim());
    const isFounder = founderList.includes(email);

    if (planType === 'founder' && !isFounder) {
      return NextResponse.json({ error: 'Not eligible for founder pricing' }, { status: 403 });
    }

    // Get or create Stripe customer
    let { data: subData } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userData.user.id)
      .single();

    let customerId = subData?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: {
          userId: userData.user.id,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const priceId = planType === 'founder'
      ? process.env.STRIPE_FOUNDER_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID;

    const monthlyId = process.env.STRIPE_MONTHLY_PRICE_ID?.trim();
    const founderId = process.env.STRIPE_FOUNDER_PRICE_ID?.trim();
    const trimmedPriceId = priceId?.trim();

    console.log('[CHECKOUT] Monthly price ID:', monthlyId, '(length:', monthlyId?.length, ')');
    console.log('[CHECKOUT] Founder price ID:', founderId, '(length:', founderId?.length, ')');
    console.log('[CHECKOUT] Selected price ID:', trimmedPriceId, '(length:', trimmedPriceId?.length, ')');

    if (!trimmedPriceId) {
      console.log('[CHECKOUT] Price ID not found!');
      return NextResponse.json({ error: 'Price ID not configured' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: trimmedPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.nextUrl.origin}/pricing?success=true`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        userId: userData.user.id,
        planType,
      },
    });

    console.log('[CHECKOUT] Session created:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[CHECKOUT] Error:', error);
    if (error instanceof Error) {
      console.error('[CHECKOUT] Message:', error.message);
    }
    return NextResponse.json(
      { error: 'Failed to create checkout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
