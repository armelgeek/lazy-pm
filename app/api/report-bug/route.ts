import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false });
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
      return NextResponse.json({ success: false });
    }

    const { page, message } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';

    await supabase.from('bug_reports').insert([
      {
        user_id: userData.user.id,
        page,
        message,
        user_agent: userAgent,
      },
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Report bug error:', error);
    return NextResponse.json({ success: false });
  }
}
