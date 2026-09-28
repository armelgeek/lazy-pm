export default function ThankYou() {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
      <h1 style={{ marginBottom: '20px' }}>Merci!</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
        Ton accès est actif. Redirection en cours...
      </p>
      <script>
        {`setTimeout(() => { window.location.href = '/chemin'; }, 3000);`}
      </script>
    </div>
  );
}
