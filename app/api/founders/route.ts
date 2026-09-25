import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { email, idee } = await request.json();

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
        .insert([{ email, idee }]);

      if (error) {
        return NextResponse.json(
          { error: 'Erreur lors de l\'enregistrement' },
          { status: 500 }
        );
      }
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
