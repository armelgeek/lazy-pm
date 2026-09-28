import { Anthropic } from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

const DAILY_LIMIT = 10;
const MONTHLY_TOKEN_LIMIT = 50000;

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

    // Check subscription
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (!subData || subData.status !== 'active') {
      return NextResponse.json(
        { error: 'Subscription required' },
        { status: 403 }
      );
    }

    const { questId, userMessage } = await request.json();

    // Check daily limit
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('copilot_usage')
      .select('*')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    const lastReset = usage?.messages_reset_at ? new Date(usage.messages_reset_at).toISOString().split('T')[0] : null;

    let messagesCount = 0;
    if (usage && lastReset === today) {
      messagesCount = usage.messages_today || 0;
    }

    if (messagesCount >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Limite atteinte aujourd'hui (${DAILY_LIMIT} messages). Reviens demain !` },
        { status: 429 }
      );
    }

    // Check monthly token limit
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split('T')[0];
    const lastMonthReset = usage?.month_reset_at ? new Date(usage.month_reset_at).toISOString().split('T')[0] : null;

    let totalTokens = 0;
    if (usage && lastMonthReset && lastMonthReset >= monthStartStr) {
      totalTokens = usage.total_tokens_month || 0;
    }

    // Get quest context
    const { data: planData } = await supabase
      .from('plans')
      .select('plan_data')
      .eq('user_id', userData.user.id)
      .single();

    let questTitle = '';
    let questObjective = '';
    let productIdea = '';

    if (planData) {
      const plan = planData.plan_data;
      productIdea = plan.idea || '';
      const allQuests = [
        ...plan.section1.quests,
        ...plan.section2.quests,
        ...plan.section3.quests,
        ...plan.section4.quests,
      ];
      const quest = allQuests.find((q: any) => q.id === questId);
      if (quest) {
        questTitle = quest.title;
        questObjective = quest.objective;
      }
    }

    // Get last 3 check-ins
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('status, notes, quest_id')
      .eq('user_id', userData.user.id)
      .order('date_utc', { ascending: false })
      .limit(3);

    const checkinContext = checkins
      ?.map(
        (c: any) =>
          `Quête #${c.quest_id}: ${c.status} - "${c.notes || 'Pas de notes'}"`
      )
      .join('\n');

    // Build system prompt with context
    const systemPrompt = `Tu es le copilote d'aide de LazyPM, un outil pour lancer un produit en 30 jours.
L'utilisateur travaille sur une quête spécifique et est bloqué.

CONTEXTE DU PROJET :
- Idée : ${productIdea}
- Quête actuelle : #${questId} - ${questTitle}
- Objectif : ${questObjective}

RÉCENTS CHECK-INS :
${checkinContext || 'Aucun check-in encore'}

RÈGLES :
- Réponds en français simple et bienveillant
- UNE PISTE À LA FOIS, pas un roman
- Si c'est un vrai problème de code : propose un prompt prêt à coller
- Sois direct et actionnable
- Reconnaît si tu ne peux pas aider avec la quête (ex: paiement, config cloud)`;

    // Generate response
    const message = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const textContent = message.content.find((c: any) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    const response = textContent.text;
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

    // Check if monthly limit would be exceeded
    if (totalTokens + tokensUsed > MONTHLY_TOKEN_LIMIT) {
      return NextResponse.json(
        {
          error: `Budget mensuel atteint (${MONTHLY_TOKEN_LIMIT} tokens). Reviens le mois prochain !`,
          usage: {
            tokensUsed: totalTokens,
            limit: MONTHLY_TOKEN_LIMIT,
          },
        },
        { status: 429 }
      );
    }

    // Save user message
    await supabase.from('copilot_messages').insert([
      {
        user_id: userData.user.id,
        quest_id: questId,
        message_type: 'user',
        content: userMessage,
      },
    ]);

    // Save assistant response
    await supabase.from('copilot_messages').insert([
      {
        user_id: userData.user.id,
        quest_id: questId,
        message_type: 'assistant',
        content: response,
        tokens_used: tokensUsed,
      },
    ]);

    // Update usage
    if (usage) {
      const newMessages = lastReset === today ? messagesCount + 1 : 1;
      const newTokens =
        lastMonthReset && lastMonthReset >= monthStartStr
          ? totalTokens + tokensUsed
          : tokensUsed;

      await supabase
        .from('copilot_usage')
        .update({
          messages_today: newMessages,
          messages_reset_at: new Date().toISOString(),
          total_tokens_month: newTokens,
          month_reset_at: lastMonthReset && lastMonthReset >= monthStartStr
            ? usage.month_reset_at
            : new Date().toISOString(),
        })
        .eq('user_id', userData.user.id);
    } else {
      await supabase.from('copilot_usage').insert([
        {
          user_id: userData.user.id,
          messages_today: 1,
          total_tokens_month: tokensUsed,
        },
      ]);
    }

    return NextResponse.json({
      response,
      usage: {
        messagesRemaining: DAILY_LIMIT - messagesCount - 1,
        tokensUsed,
        tokensRemaining: MONTHLY_TOKEN_LIMIT - totalTokens - tokensUsed,
      },
    });
  } catch (error) {
    console.error('[COPILOT] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get help' },
      { status: 500 }
    );
  }
}
