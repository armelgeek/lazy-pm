import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, idee, source } = await request.json();

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const { data: existing } = await supabase
      .from('founders')
      .select('id')
      .eq('email', email)
      .single();

    const isNew = !existing;

    if (existing) {
      // Mise à jour si existe
      const { error } = await supabase
        .from('founders')
        .update({ idee, updated_at: new Date().toISOString() })
        .eq('email', email);

      if (error) {
        return NextResponse.json(
          { error: 'Erreur lors de la mise à jour' },
          { status: 500 }
        );
      }
    } else {
      // Création si nouveau
      const { error } = await supabase
        .from('founders')
        .insert([{ email, idee, source: source || 'direct' }]);

      if (error) {
        return NextResponse.json(
          { error: 'Erreur lors de l\'enregistrement' },
          { status: 500 }
        );
      }
    }

    // Send email if it's a new founder
    if (isNew) {
      const emailTemplate = `Hey! 🚀

Thanks for joining ShipInDays. You're going to ship this product in 30 days.

**Your idea:**
${idee}

**What's next?**
1. You have 3 free days to validate your idea
2. AI generates your 30-day plan (one task per day)
3. Each day: paste the prompt, run the test

Reply to this email and tell me what other idea you want to launch after this one.

Ship it! 💪

---
ShipInDays · Ship your product in 30 days`;

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Bienvenue sur LazyPM ! 🚀',
        text: emailTemplate,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const password = request.nextUrl.searchParams.get('password');

    if (password !== process.env.FOUNDER_PASSWORD) {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('founders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
