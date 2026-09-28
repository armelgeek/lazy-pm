import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const questId = request.nextUrl.searchParams.get('questId');
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

    const { data, error } = await supabase
      .from('quest_prompts')
      .select('prompt')
      .eq('user_id', userData.user.id)
      .eq('quest_id', parseInt(questId || '0'))
      .maybeSingle();

    if (error) {
      console.error('Error fetching prompt:', error);
      return NextResponse.json({ prompt: null });
    }

    return NextResponse.json({ prompt: data?.prompt || null });
  } catch (error) {
    console.error('Get prompt error:', error);
    return NextResponse.json({ prompt: null });
  }
}
