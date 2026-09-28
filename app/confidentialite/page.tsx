export default function Confidentialite() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>Politique de confidentialité</h1>

      <div style={{ lineHeight: '1.8', color: '#333' }}>
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            1. Quelles données on garde
          </h2>
          <p>
            Quand tu crées un compte, on stocke :
          </p>
          <p>
            • Ton email<br />
            • Ton mot de passe (chiffré, pas en clair)<br />
            • Ton idée de produit (celle que tu écris au démarrage)<br />
            • Ton plan de 30 quêtes généré<br />
            • Tes check-ins du soir et tes notes<br />
            • Tes informations de paiement (gérées par Stripe, pas nous)<br />
            • Les événements de ton compte (quête ouverte, prompt généré, etc.)
          </p>
          <p style={{ marginTop: '12px' }}>
            Tout est stocké sur Supabase, un serveur en Europe.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            2. Ce qui est envoyé à l'IA (Anthropic)
          </h2>
          <p style={{ padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px', marginBottom: '12px' }}>
            <strong>🔴 Important :</strong> Quand tu généras un prompt de quête ou un check-in,
            on envoie à Claude (l'IA d'Anthropic) :
          </p>
          <p>
            • Le titre de la quête<br />
            • L'objectif de la quête<br />
            • Ton état au check-in (« terminée », « à moitié », « pas touché »)<br />
            • Tes notes du soir (2 lignes)<br />
            • Rien d'autre
          </p>
          <p style={{ marginTop: '12px' }}>
            <strong>Tes données personnelles ne vont JAMAIS à l'IA.</strong> On ne lui envoie pas ton
            email, ton idée complète, ou tes infos de paiement.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '6px' }}>
            Anthropic garde les messages 30 jours maximum, puis les supprime. Lire sa politique :{' '}
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
            3. Cookies et tracking
          </h2>
          <p>
            On utilise un peu de localStorage pour garder ta session en cours (rien d'invasif). On
            ne vend pas tes données à des régies publicitaires, zéro analytics creepy.
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ À faire relire :</strong> Vérifie que la version actuelle du site n'a pas
            d'analytics cachés qu'on aurait oubliés.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            4. Paiements (Stripe)
          </h2>
          <p>
            On n'a jamais accès à tes numéros de carte. Stripe gère tout. On ne stocke qu'un ID
            client Stripe pour savoir que tu as payé. Lire la politique Stripe :{' '}
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
            5. Combien de temps on garde tes données
          </h2>
          <p>
            • Tant que ton compte existe = on garde tout<br />
            • Tu supprimes ton compte = tout disparaît en 30 jours<br />
            • Tu annules l'abonnement = on garde l'accès gratuitement aux quêtes 1-3
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            6. Tes droits
          </h2>
          <p>
            Tu peux demander à tout moment :<br />
            • Une copie de tes données (on te l'envoie par email)<br />
            • La suppression de ton compte et tes données<br />
            • Une clarification sur comment on utilise tes infos
          </p>
          <p style={{ marginTop: '12px' }}>
            Écris au fondateur via le compte pour toute demande RGPD.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            7. Sécurité
          </h2>
          <p>
            • Les données en transit sont chiffrées (HTTPS partout)<br />
            • Les mots de passe sont chiffrés en base<br />
            • Supabase gère la sécurité des serveurs<br />
            • On n'a pas d'accès root aux données utilisateur (Row Level Security)
          </p>
          <p style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff5e6', borderRadius: '6px' }}>
            <strong>⚠️ À faire relire :</strong> Fais un audit de sécurité avant d'encaisser les
            premiers paiements. Demande à un expert de vérifier la configuration.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
            8. Changements
          </h2>
          <p>
            Si cette politique change, on te le dira par email. Les changements majeurs = tu dois
            accepter avant de continuer.
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
