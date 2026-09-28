import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    // Verify Vercel Cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date()
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

    // Get all users with email preferences
    const { data: allUsers } = await supabase.auth.admin.listUsers();

    let checkinsSent = 0;
    let summariesSent = 0;

    for (const user of allUsers?.users || []) {
      const { data: prefs } = await supabase
        .from('email_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!prefs || prefs.unsubscribed) continue;

      // Send check-in reminder
      if (prefs.checkin_reminder_enabled) {
        const { data: alreadySent } = await supabase
          .from('email_queue')
          .select('id')
          .eq('user_id', user.id)
          .eq('email_type', 'checkin_reminder')
          .eq('scheduled_for', today)
          .maybeSingle();

        if (!alreadySent) {
          // Check if check-in already done today
          const { data: checkinExists } = await supabase
            .from('daily_checkins')
            .select('id')
            .eq('user_id', user.id)
            .eq('date_utc', today)
            .maybeSingle();

          if (!checkinExists) {
            try {
              await resend.emails.send({
                from: 'LazyPM <noreply@lazypm.com>',
                to: user.email || '',
                subject: '🌙 C\'est l\'heure du check-in',
                html: `
                  <h2>C'est l'heure du check-in du soir !</h2>
                  <p>Comment ça se passe sur ta quête d'aujourd'hui ?</p>
                  <p>
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/checkin"
                       style="padding: 12px 24px; background-color: #1F2421; color: white;
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                      Faire mon check-in
                    </a>
                  </p>
                `,
              });

              await supabase.from('email_queue').insert([
                {
                  user_id: user.id,
                  email_type: 'checkin_reminder',
                  scheduled_for: today,
                  sent_at: new Date().toISOString(),
                },
              ]);

              checkinsSent++;
            } catch (err) {
              console.error(`Failed to send checkin email to ${user.email}:`, err);
            }
          }
        }
      }

      // Send weekly summary
      if (prefs.weekly_summary_enabled && prefs.weekly_summary_day === dayOfWeek) {
        const { data: alreadySent } = await supabase
          .from('email_queue')
          .select('id')
          .eq('user_id', user.id)
          .eq('email_type', 'weekly_summary')
          .eq('scheduled_for', today)
          .maybeSingle();

        if (!alreadySent) {
          try {
            // Get user's data
            const { data: planData } = await supabase
              .from('plans')
              .select('plan_data')
              .eq('user_id', user.id)
              .single();

            const { data: checkins } = await supabase
              .from('daily_checkins')
              .select('*')
              .eq('user_id', user.id)
              .gte('date_utc', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

            const { data: streak } = await supabase
              .from('user_streaks')
              .select('current_streak')
              .eq('user_id', user.id)
              .maybeSingle();

            const completedCount = checkins?.filter((c) => c.status === 'completed').length || 0;

            await resend.emails.send({
              from: 'LazyPM <noreply@lazypm.com>',
              to: user.email || '',
              subject: '📊 Résumé de ta semaine',
              html: `
                <h2>Résumé de ta semaine</h2>
                <p>Voilà comment tu t'en sors :</p>
                <ul>
                  <li><strong>${completedCount}</strong> quêtes terminées cette semaine</li>
                  <li><strong>${streak?.current_streak || 0}</strong> jours de série</li>
                </ul>
                <p>
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/chemin"
                     style="padding: 12px 24px; background-color: #1F2421; color: white;
                            text-decoration: none; border-radius: 6px; display: inline-block;">
                    Voir mon parcours
                  </a>
                </p>
              `,
            });

            await supabase.from('email_queue').insert([
              {
                user_id: user.id,
                email_type: 'weekly_summary',
                scheduled_for: today,
                sent_at: new Date().toISOString(),
              },
            ]);

            summariesSent++;
          } catch (err) {
            console.error(`Failed to send summary email to ${user.email}:`, err);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      checkinsSent,
      summariesSent,
    });
  } catch (error) {
    console.error('[CRON] Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}
