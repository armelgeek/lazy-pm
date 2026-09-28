import { Anthropic } from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { questPromptSystemPrompt, questPromptUserPrompt } from '@/lib/prompts/quest';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data: userData, error: userError } = await supabase.auth.getUser(
      authHeader.slice(7)
    );

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questId, questTitle, questObjective } = await request.json();

    // Generate prompt using Claude
    const message = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: questPromptSystemPrompt,
      messages: [
        {
          role: 'user',
          content: questPromptUserPrompt(questTitle, questObjective),
        },
      ],
    });

    const textContent = message.content.find((c: any) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    const prompt = textContent.text;

    // Save to database
    const { error: saveError } = await supabase.from('quest_prompts').insert([
      {
        user_id: userData.user.id,
        quest_id: questId,
        prompt,
        created_at: new Date().toISOString(),
      },
    ]);

    if (saveError) {
      console.error('Error saving prompt:', saveError);
    }

    return NextResponse.json({
      success: true,
      prompt,
      cost: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Quest prompt generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}
