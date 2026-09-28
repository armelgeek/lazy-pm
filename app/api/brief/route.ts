import { Anthropic } from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { briefingSystemPrompt, briefingUserPrompt } from '@/lib/prompts/briefing';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json();

    if (!idea || idea.trim().length === 0) {
      return NextResponse.json(
        { error: 'Idea is required' },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: briefingSystemPrompt,
      messages: [
        {
          role: 'user',
          content: briefingUserPrompt(idea),
        },
      ],
    });

    // Find the text content block (skip thinking blocks)
    const textContent = message.content.find((c: any) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      console.error('No text content found in message:', message);
      throw new Error('No text content in response');
    }

    // Extract JSON from markdown if needed
    let jsonText = textContent.text;
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }

    const response = JSON.parse(jsonText);

    return NextResponse.json({
      success: true,
      data: response,
      cost: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error('Brief API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'AI response was not valid. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process your idea' },
      { status: 500 }
    );
  }
}
