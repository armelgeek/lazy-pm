# Quête #20 · Mesurer ce qui compte

Section 3 · Préparer le lancement · environ 2 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** Une page qui te montre où les gens décrochent, combien tu gagnes, et combien te coûte chaque client en IA.

**Test :** Tu ouvres ta page de suivi : tu sais en 10 secondes combien sont passés de la quête #03 au paiement.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **ÉTAPES** · Le parcours complet → le pourcentage de passage entre chaque étape
- [ ] **REVENU** · Le revenu du mois → le même que dans Stripe
- [ ] **COÛT** · Le coût IA d'un client → comparé à ce qu'il paie
- [ ] **RAPIDE** · Avec beaucoup de données → la page reste rapide

## Le piège d'expérience
Regarder le nombre de visites. Ici, le seul chiffre qui compte, c'est le passage de la #03 au paiement.

## Le prompt à coller dans Claude Code

```text
# QUÊTE #20 : MESURER CE QUI COMPTE
Je veux savoir où j'en suis avec LazyPM, en chiffres.

// 1. Ce que je veux obtenir :
- Le parcours sur 30 jours : visite, briefing, plan, compte, quête #03 faite, paywall vu, abonnement payé, avec le pourcentage entre chaque étape
- Le revenu du mois, le nombre d'abonnés par formule, les résiliations
- Le coût IA moyen par client, et ce qu'il me reste par client après ce coût

// 2. Les cas que tu dois obligatoirement gérer :
- Chaque chiffre doit pouvoir être vérifié
- La page reste rapide même avec des milliers de personnes

// 3. Explication pas à pas :
Ensuite, explique-moi comment lire ces chiffres chaque semaine, et lequel regarder en premier. En français simple, sans jargon.
```
