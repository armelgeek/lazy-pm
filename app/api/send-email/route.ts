import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, idee } = await request.json();

    if (!email || !idee) {
      return NextResponse.json(
        { error: 'Email et idée requis' },
        { status: 400 }
      );
    }

    const emailTemplate = `
Salut ! 🚀

Merci d'avoir rejoint LazyPM. Tu as une idée en pause qui traîne depuis longtemps ?

**Ton idée :**
${idee}

**La suite ?**
1. Tu as 3 quêtes gratuites pour tester si tu peux vraiment la finir
2. L'IA va transformer ton idée en plan de 30 quêtes
3. Chaque quête a un résultat clair et un prompt à coller

Réponds simplement à cet email pour me dire quelle autre idée tu as en pause.

À demain ! 💪

---
LazyPM · De l'idée au premier client en 30 quêtes
    `;

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Bienvenue sur LazyPM ! 🚀',
      text: emailTemplate,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
