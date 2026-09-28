# Quête #07 · Brancher les paiements

Section 2 · Se faire payer · environ 2 à 3 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** On peut s'abonner à 9 $ par mois, et les fondateurs à 5 $ par mois à vie. LazyPM sait qui a payé.

**Test :** Avec une carte de test, tu t'abonnes : ton compte passe « abonné » tout seul.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **DOUBLE** · Le paiement confirmé deux fois par Stripe → un seul abonnement
- [ ] **RÉSILIÉ** · L'abonnement annulé dans Stripe → le compte n'est plus « abonné »
- [ ] **FONDATEUR** · Un email qui n'est pas sur la liste → pas de prix à 5 $
- [ ] **REFUS** · Une carte refusée → un message clair, rien n'est débloqué

## Le piège d'expérience
Oublier que Stripe peut confirmer deux fois le même paiement. Demande explicitement qu'un paiement ne soit compté qu'une fois.

## Ce qu'il te faut
- Un compte Stripe activé (pièce d'identité et compte bancaire, 1 à 2 jours de validation)

## Le prompt à coller dans Claude Code

```text
# QUÊTE #07 : BRANCHER LES PAIEMENTS
Je veux encaisser des abonnements sur LazyPM.

// 1. Ce que je veux obtenir :
- Un abonnement à 9 $ par mois, et un prix fondateur à 5 $ par mois à vie réservé aux emails de ma liste des fondateurs
- Le paiement se fait sur une page sécurisée de Stripe
- LazyPM sait à tout moment qui est abonné, et jusqu'à quand

// 2. Les cas que tu dois obligatoirement gérer :
- Si Stripe envoie deux fois la même confirmation, on ne compte qu'une fois
- Si l'abonnement est annulé ou le paiement échoue, le compte le sait
- Chaque personne ne voit que son propre abonnement
- Pouvoir tout tester avec de fausses cartes avant d'encaisser pour de vrai

// 3. Explication pas à pas :
Ensuite, explique-moi comment tester un paiement avec une fausse carte, et ce que je dois régler moi-même dans Stripe. En français simple, sans jargon.
```

## Hors code
- [ ] Activer ton compte Stripe dès ce soir
- [ ] Vérifier si tu dois collecter des taxes sur tes ventes selon le pays de tes clients (Stripe peut le calculer pour toi)
