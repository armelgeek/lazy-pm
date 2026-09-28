export default function Refund() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Refund Policy & Guarantee</h1>

      <div style={{ lineHeight: '1.8', color: '#333' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            1. The two subscription options
          </h2>
          <p>
            <strong>Monthly · $9/month</strong><br />
            No guarantee, cancel anytime. Auto-renews each month.
          </p>
          <p style={{ marginTop: '12px' }}>
            <strong>Season Pass · $69 (one-time)</strong><br />
            12 months of access, 3 projects, refund guarantee if you don't ship.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            2. The Season Pass guarantee
          </h2>
          <p style={{ padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '6px', marginBottom: '12px' }}>
            <strong>✓ 100% refund guaranteed if:</strong>
          </p>
          <p>
            You don't complete your quest #30 before it's due, OR<br />
            12 months have passed since your purchase (whichever comes first)
          </p>
          <p style={{ marginTop: '12px' }}>
            In that case, you're entitled to a full refund, no questions asked.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ Legal review needed:</strong> Define precisely what "shipped" means:
            MVP online? First sale? Have a lawyer review this section.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            3. What counts as "completed"
          </h2>
          <p>
            A quest is completed when:<br />
            • You marked it "done" in a check-in<br />
            • The next quest unlocked<br />
            • Your plan recorded the completion
          </p>
          <p style={{ marginTop: '12px' }}>
            In other words: you followed your 30-day journey, even if slowly.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ Clarify:</strong> What's the difference between "completing the plan" and
            "having a product online"? Confirm with the founder.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            4. How to request a refund
          </h2>
          <p>
            Before quest #30 or within 12 months:
          </p>
          <p>
            1. Email the founder with "Refund" in the subject<br />
            2. Simply say "I didn't complete the journey"<br />
            3. We process your refund via Stripe in 5-7 days
          </p>
          <p style={{ marginTop: '12px' }}>
            No paperwork, no questions.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            5. Monthly subscription
          </h2>
          <p>
            For the $9/month subscription:<br />
            • Cancel anytime<br />
            • No refunds for past months (you had access)<br />
            • Cancellation is immediate
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            6. Refunds for service issues
          </h2>
          <p>
            If ShipInDays has a critical bug or is down for more than 3 consecutive days and you
            request a refund, we'll negotiate. Contact the founder.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ Legal review needed:</strong> Define SLA terms more precisely. A lawyer can
            strengthen this section.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            7. Taxes
          </h2>
          <p>
            Displayed prices don't include taxes. Taxes will be added at checkout based on your
            location (handled by Stripe).
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            8. Not covered
          </h2>
          <p>
            No refunds for:<br />
            • You used the service (it's not a free trial after-the-fact)<br />
            • "I didn't have time" isn't the same as "I didn't complete the journey"<br />
            • Requests after 12 months (deadline passed)
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            9. Questions?
          </h2>
          <p>
            Email the founder. Response within 48 hours guaranteed.
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
