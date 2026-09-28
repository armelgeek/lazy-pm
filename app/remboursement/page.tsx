export default function Remboursement() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Politique de remboursement & garantie</h1>

      <div style={{ lineHeight: '1.8', color: '#333' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            1. Les deux abonnements
          </h2>
          <p>
            <strong>Mensuel · 9 $/mois</strong><br />
            Pas de garantie, cancellation quand tu veux. Renouvellement automatique chaque mois.
          </p>
          <p style={{ marginTop: '12px' }}>
            <strong>Pass Saison · 69 $ (une seule fois)</strong><br />
            12 mois d'accès, 3 projets, garantie de remboursement si tu ne lances rien.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            2. La garantie du pass saison
          </h2>
          <p style={{ padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '6px', marginBottom: '12px' }}>
            <strong>✓ Remboursement 100% garanti si :</strong>
          </p>
          <p>
            Tu ne lances rien avant la fin de ta quête #30, OU<br />
            12 mois ont passé depuis ton achat (ce qui vient en premier)
          </p>
          <p style={{ marginTop: '12px' }}>
            Dans ce cas, tu as droit à un remboursement complet, sans question.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ À faire relire :</strong> Définis précisément ce que signifie « lancer » :
            un MVP en ligne ? Une vente ? Un utilisateur gratuit ? Fais vérifier par un avocat.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            3. Qu'est-ce qui compte comme « lancé »
          </h2>
          <p>
            Une quête est lancée si elle est complétée à la #30 de ton plan, ce qui signifie :<br />
            • Tu as coché « terminée » dans un check-in<br />
            • La quête suivante s'est ouverte<br />
            • Ton plan a enregistré cette progression
          </p>
          <p style={{ marginTop: '12px' }}>
            Autrement dit : tu as suivi les 30 jours d'affilée, même lentement.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ À vérifier :</strong> Clarifie la différence entre « terminer le plan » et
            « avoir un produit en ligne ». Demande au fondateur quelle est vraiment l'intention.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginbottom: '12px' }}>
            4. Comment demander un remboursement
          </h2>
          <p>
            Avant la quête #30 ou avant 12 mois :
          </p>
          <p>
            1. Envoie un email au fondateur avec « Remboursement » dans le titre<br />
            2. Dis simplement « Je n'ai rien lancé »<br />
            3. On te fait un remboursement Stripe en 5-7 jours
          </p>
          <p style={{ marginTop: '12px' }}>
            Aucun papier, aucune question.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            5. Abonnement mensuel
          </h2>
          <p>
            Pour l'abonnement 9 $/mois :<br />
            • Tu peux annuler quand tu veux<br />
            • Pas de remboursement rétroactif (tu avais accès ce mois-ci)<br />
            • L'annulation est immédiate
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            6. Remboursements si bug ou service indisponible
          </h2>
          <p>
            Si LazyPM a un bug grave ou est down pendant plus de 3 jours d'affilée et que tu
            demandes un remboursement, on négocie. Écris au fondateur.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ À faire relire :</strong> Précise davantage les conditions (uptime SLA,
            etc.). Un avocat peut améliorer cette partie.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            7. Taxes
          </h2>
          <p>
            Les prix affichés ne comprennent pas les taxes. Les taxes seront ajoutées à la
            facture selon ta localisation (gérées par Stripe).
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            8. Cas pas couverts
          </h2>
          <p>
            Pas de remboursement si :<br />
            • Tu as accédé au service et l'as utilisé (c'est pas un essai gratuit après coup)<br />
            • Tu dis « j'ai pas eu le temps »: la garantie c'est « tu as pas lancé »<br />
            • Tu demandes après 12 mois (délai dépassé)
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            9. Questions ?
          </h2>
          <p>
            Écris au fondateur. Il répondra en 48h max.
          </p>
        </section>

        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #ddd' }} />

        <p style={{ fontSize: '12px', color: '#999' }}>
          Dernière mise à jour : septembre 2026
        </p>
      </div>
    </div>
  );
}
