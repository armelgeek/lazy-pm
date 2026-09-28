import { Anthropic } from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { checkinSystemPrompt, checkinUserPrompt } from '@/lib/prompts/checkin';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    console.log('[CHECKIN] Starting check-in');

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

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questId, questTitle, state, notes, objectives, timezone, isPublic } = await request.json();

    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingCheckin } = await supabase
      .from('daily_checkins')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('date_utc', today)
      .maybeSingle();

    if (existingCheckin) {
      return NextResponse.json(
        { error: 'Already checked in today' },
        { status: 400 }
      );
    }

    // Generate AI response
    const message = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 256,
      system: checkinSystemPrompt,
      messages: [
        {
          role: 'user',
          content: checkinUserPrompt(questId, questTitle, state, notes),
        },
      ],
    });

    const textContent = message.content.find((c: any) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    let aiResponse;
    try {
      const jsonMatch = textContent.text.match(/```json\n([\s\S]*?)\n```/);
      aiResponse = JSON.parse(jsonMatch ? jsonMatch[1] : textContent.text);
    } catch (e) {
      aiResponse = {
        title: 'Bien joué',
        message: textContent.text,
        launchDateDaysChanged: 0,
      };
    }

    // Save check-in
    const { data: checkin } = await supabase
      .from('daily_checkins')
      .insert([
        {
          user_id: userData.user.id,
          quest_id: questId,
          status: state,
          notes: state === 'done' ? null : notes,
          ai_response: JSON.stringify(aiResponse),
          date_utc: today,
          is_public: isPublic,
        },
      ])
      .select()
      .single();

    // Update or create user streak
    const { data: userStreak } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    let longestStreak = 1;

    if (userStreak) {
      // If last checkin was yesterday, continue streak
      if (userStreak.last_checkin_date === yesterdayStr) {
        newStreak = (userStreak.current_streak || 0) + 1;
      } else if (userStreak.last_checkin_date === today) {
        // Already checked in today (shouldn't happen due to earlier check)
        newStreak = userStreak.current_streak || 1;
      }
      // Otherwise reset to 1

      longestStreak = Math.max(newStreak, userStreak.longest_streak || 0);

      await supabase
        .from('user_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_checkin_date: today,
          timezone,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userData.user.id);
    } else {
      // First ever check-in
      await supabase.from('user_streaks').insert([
        {
          user_id: userData.user.id,
          current_streak: 1,
          longest_streak: 1,
          last_checkin_date: today,
          timezone,
        },
      ]);
    }

    // If quest is done, mark it as complete and open next quest
    if (state === 'done') {
      const { data: planData } = await supabase
        .from('plans')
        .select('plan_data')
        .eq('user_id', userData.user.id)
        .single();

      if (planData) {
        const plan = planData.plan_data;
        const allQuests = [
          ...plan.section1.quests,
          ...plan.section2.quests,
          ...plan.section3.quests,
          ...plan.section4.quests,
        ];

        // Mark current quest as complete
        allQuests.forEach((q: any) => {
          if (q.id === questId) {
            q.completed = true;
          }
        });

        // Open next quest
        const nextQuest = allQuests.find((q: any) => !q.completed && q.id > questId);
        if (nextQuest) {
          nextQuest.unlocked = true;
        }

        // Save updated plan
        await supabase
          .from('plans')
          .update({ plan_data: plan })
          .eq('user_id', userData.user.id);
      }
    }

    return NextResponse.json({
      success: true,
      checkin,
      streak: newStreak,
      ai: aiResponse,
    });
  } catch (error) {
    console.error('[CHECKIN] Error:', error);
    return NextResponse.json(
      { error: 'Failed to save check-in' },
      { status: 500 }
    );
  }
}
