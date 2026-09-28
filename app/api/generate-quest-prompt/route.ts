import { Anthropic } from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { questPromptSystemPrompt, questPromptUserPrompt } from '@/lib/prompts/quest';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    console.log('[API] Starting quest prompt generation');

    // Get user from auth header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[API] No auth header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create Supabase client with auth token
    const token = authHeader.slice(7);
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

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      console.log('[API] Auth error:', userError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[API] User:', userData.user.id);

    const { questId, questTitle, questObjective } = await request.json();
    console.log('[API] Generating prompt for quest', questId);

    // Check if quest requires subscription (quests 1-3 are free, 4+ need subscription)
    if (questId >= 4) {
      // Check subscription status
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!subData || subData.status !== 'active') {
        console.log('[API] User not subscribed for quest', questId);
        return NextResponse.json(
          { error: 'Subscription required', needsPaywall: true },
          { status: 403 }
        );
      }
    }

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
    console.log('[API] Prompt generated, saving to DB');

    // Save to database
    const { data: insertData, error: saveError } = await supabase
      .from('quest_prompts')
      .insert([
        {
          user_id: userData.user.id,
          quest_id: questId,
          prompt,
          created_at: new Date().toISOString(),
        },
      ]);

    if (saveError) {
      console.error('[API] Error saving prompt:', saveError);
    } else {
      console.log('[API] Prompt saved successfully');
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
    console.error('[API] Quest prompt generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
}
