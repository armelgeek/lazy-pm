import { Anthropic } from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

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

    const { noteType, title, description } = await request.json();

    const systemPrompt = `Tu es un expert en debugging et réparation de code.
Quand on te décrit un bug, tu génères un prompt prêt à coller dans Claude Code ou un AI builder.
Le prompt doit être :
- Précis et actionnable
- Adapté au problème décrit
- Inclure 3 choses à vérifier après

Format ta réponse en 3 parties :
1. Le prompt exact à coller
2. Trois choses à vérifier

Sois concis et direct.`;

    const userPrompt = `Bug à réparer :
Titre : ${title}
Détails : ${description || 'Aucun détail fourni'}

Génère le prompt et les vérifications.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 512,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const textContent = message.content.find((c: any) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    return NextResponse.json({
      prompt: textContent.text,
    });
  } catch (error) {
    console.error('[REPAIR PROMPT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate repair prompt' },
      { status: 500 }
    );
  }
}
