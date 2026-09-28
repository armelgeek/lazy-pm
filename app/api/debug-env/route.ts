import { NextResponse } from 'next/server';

export async function GET() {
  const monthly = process.env.STRIPE_MONTHLY_PRICE_ID;
  const founder = process.env.STRIPE_FOUNDER_PRICE_ID;
  const secret = process.env.STRIPE_SECRET_KEY;

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    monthly: {
      exists: !!monthly,
      value: monthly || 'NOT SET',
      length: monthly?.length || 0,
    },
    founder: {
      exists: !!founder,
      value: founder || 'NOT SET',
      length: founder?.length || 0,
    },
    secret: {
      exists: !!secret,
      prefix: secret?.substring(0, 10) || 'NOT SET',
    },
  });
}
