export default function Privacy() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Privacy Policy</h1>

      <div style={{ lineHeight: '1.8', color: '#333' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            1. What data we store
          </h2>
          <p>
            When you create an account, we store:
          </p>
          <p>
            • Your email<br />
            • Your password (encrypted, never in plain text)<br />
            • Your product idea description<br />
            • Your personalized 30-quest plan<br />
            • Your daily check-ins and notes<br />
            • Payment information (handled by Stripe, not us)<br />
            • Account events (quest opened, prompt generated, etc.)
          </p>
          <p style={{ marginTop: '12px' }}>
            Everything is stored on Supabase, a server located in Europe.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            2. What gets sent to AI (Anthropic)
          </h2>
          <p style={{ padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px', marginBottom: '12px' }}>
            <strong>🔴 Important:</strong> When you generate a quest prompt or check-in, we send to Claude (Anthropic's AI):
          </p>
          <p>
            • Quest title<br />
            • Quest objective<br />
            • Your check-in status ("completed", "partial", "not started")<br />
            • Your evening notes (2 lines)<br />
            • Nothing else
          </p>
          <p style={{ marginTop: '12px' }}>
            <strong>Your personal data never goes to the AI.</strong> We don't send your email, full idea,
            or payment info.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '6px' }}>
            Anthropic retains messages for up to 30 days, then deletes them. See their policy:{' '}
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1F2421', textDecoration: 'underline' }}
            >
              https://www.anthropic.com/privacy
            </a>
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            3. Cookies and tracking
          </h2>
          <p>
            We use minimal localStorage to keep you logged in. We don't sell your data to advertisers
            or use invasive analytics.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ Verify:</strong> Check that the current site version doesn't have any hidden
            analytics we may have forgotten about.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            4. Payments (Stripe)
          </h2>
          <p>
            We never see your card numbers. Stripe handles everything. We only store a Stripe
            customer ID to know you've paid. Read Stripe's policy:{' '}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#1F2421', textDecoration: 'underline' }}
            >
              https://stripe.com/privacy
            </a>
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            5. How long we keep your data
          </h2>
          <p>
            • While your account exists = we keep everything<br />
            • You delete your account = everything disappears within 30 days<br />
            • You cancel subscription = we keep your quests 1-3 free access
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            6. Your rights
          </h2>
          <p>
            You can request anytime:<br />
            • A copy of your data (we'll email it)<br />
            • Deletion of your account and data<br />
            • Clarification on how we use your info
          </p>
          <p style={{ marginTop: '12px' }}>
            Email the founder in your account for any GDPR requests.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            7. Security
          </h2>
          <p>
            • Data in transit is encrypted (HTTPS everywhere)<br />
            • Passwords are encrypted in the database<br />
            • Supabase manages server security<br />
            • We don't have root access to user data (Row Level Security)
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ Security audit needed:</strong> Before taking payments, have a security expert
            review the Supabase and Stripe configuration.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            8. Changes to this policy
          </h2>
          <p>
            If this policy changes, we'll notify you by email. Major changes require your acceptance.
          </p>
        </section>

        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #ddd' }} />

        <p style={{ fontSize: '12px', color: '#999' }}>
          Last updated: September 2026
        </p>
      </div>
    </div>
  );
}
