# Quête #14 · Le compte

Section 2 · Se faire payer · environ 2 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** Chaque client gère tout seul son abonnement, ses factures, ses rappels, et peut partir avec ses données.

**Test :** Tu changes ta carte, tu télécharges une facture et tes données, sans jamais devoir écrire au support.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **FACTURE** · Une facture → téléchargeable en un clic
- [ ] **RÉSILIER** · Résilier → la progression est gardée, et c'est dit clairement
- [ ] **EXPORT** · Télécharger mes données → toutes les siennes, et seulement les siennes
- [ ] **SUPPRIMER** · Supprimer le compte → plus aucun prélèvement ensuite

## Le piège d'expérience
Supprimer le compte sans arrêter l'abonnement. Le client continue d'être prélevé.

## Ce qu'il te faut
- La maquette maquettes/compte.html

## Le prompt à coller dans Claude Code

```text
# QUÊTE #14 : LE COMPTE
Je veux la page Compte de LazyPM.

// 1. Ce que je veux obtenir :
- La page comme maquettes/compte.html
- L'abonnement (formule, prix, prochain paiement, carte), avec « Changer » et « Gérer le paiement » qui ouvrent la page de Stripe
- Les factures à télécharger
- Le profil, le fuseau horaire et les rappels
- « Télécharger mes données » et « Supprimer mon compte », avec une confirmation dans la page

// 2. Les cas que tu dois obligatoirement gérer :
- Supprimer le compte arrête aussi l'abonnement
- Résilier rappelle que la progression est gardée
- Jamais de fenêtre de confirmation du navigateur, tout se passe dans la page

// 3. Explication pas à pas :
Ensuite, explique-moi ce qui se passe exactement quand quelqu'un supprime son compte. En français simple, sans jargon.
```
