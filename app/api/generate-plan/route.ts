import { Anthropic } from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { planSystemPrompt, planUserPrompt } from '@/lib/prompts/plan';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { idea, tool, timePerDay, monetization } = await request.json();

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea is required' },
        { status: 400 }
      );
    }

    const userPrompt = planUserPrompt(idea, tool || 'Claude Code', timePerDay || '1 hour', monetization || 'Free prototype');

    let message = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 4096,
      system: planSystemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Find the text content block (skip thinking blocks)
    const textContent = message.content.find((c: any) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      console.error('No text content found in message:', message);
      throw new Error('No text content in response');
    }

    let plan;
    try {
      // Extract JSON from markdown if needed
      let jsonText = textContent.text;
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      plan = JSON.parse(jsonText);
    } catch (e) {
      // Retry once if JSON parsing fails
      console.log('First attempt failed, retrying...');
      message = await client.messages.create({
        model: 'claude-sonnet-5',
        max_tokens: 4096,
        system: planSystemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      // Find the text content block (skip thinking blocks)
      const textContent2 = message.content.find((c: any) => c.type === 'text');
      if (!textContent2 || textContent2.type !== 'text') {
        console.error('Retry: No text content found in message:', message);
        throw new Error('No text content in response');
      }

      // Extract JSON from markdown if needed
      let jsonText = textContent2.text;
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
      plan = JSON.parse(jsonText);
    }

    // Calculate total hours and launch date
    const allQuests = [
      ...plan.section1.quests,
      ...plan.section2.quests,
      ...plan.section3.quests,
      ...plan.section4.quests,
    ];

    const totalHours = allQuests.reduce((sum, q) => sum + q.hours, 0);
    const dailyHours = timePerDay === '30 minutes' ? 0.5 : timePerDay === '1 hour' ? 1 : timePerDay === '2 hours' ? 2 : 3;
    const daysNeeded = Math.ceil(totalHours / dailyHours);

    return NextResponse.json({
      success: true,
      data: {
        plan,
        totalQuests: allQuests.length,
        totalHours,
        daysNeeded,
        launchDate: new Date(Date.now() + daysNeeded * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      cost: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Plan generation error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid plan format. The AI may have failed. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate plan' },
      { status: 500 }
    );
  }
}
