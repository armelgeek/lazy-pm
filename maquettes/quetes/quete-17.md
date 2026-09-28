# Quête #17 · Sécurité et limites de coût

Section 3 · Préparer le lancement · environ 3 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** Personne ne peut voir les données d'un autre, tes clés restent secrètes, et tu es prévenu avant une facture IA surprise.

**Test :** Avec deux comptes, tu essaies de voir les données de l'autre : impossible. Tu baisses le seuil d'alerte : tu reçois l'email.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **VOISIN** · Deux comptes → aucun ne voit rien de l'autre, nulle part
- [ ] **CLÉS** · Le code de la page ouvert dans le navigateur → aucune clé secrète visible
- [ ] **ROBOT** · 100 inscriptions en une minute → bloquées
- [ ] **FACTURE** · Les coûts IA qui s'envolent → un email d'alerte

## Le piège d'expérience
Croire que « ça marche chez moi » veut dire que c'est sûr. Teste toujours avec un deuxième compte.

## Le prompt à coller dans Claude Code

```text
# QUÊTE #17 : SÉCURITÉ ET LIMITES DE COÛT
Je veux vérifier la sécurité de LazyPM avant le lancement.

// 1. Ce que je veux obtenir :
- Vérifier, page par page, qu'une personne ne peut ni voir ni modifier les données d'une autre, et corriger ce qui ne va pas
- Vérifier qu'aucune clé secrète n'est visible dans le navigateur ni dans le code partagé
- Limiter les abus sur les formulaires publics et sur tout ce qui utilise l'IA
- M'envoyer un email si les coûts IA d'une journée dépassent un seuil que je choisis

// 2. Les cas que tu dois obligatoirement gérer :
- Me donner la liste de ce qui était risqué et de ce qui a été corrigé
- Tester avec deux comptes différents
- Me dire ce que je dois régler moi-même dans les comptes Anthropic, Stripe et de la base de données

// 3. Explication pas à pas :
Ensuite, explique-moi comment poser une limite de dépense chez Anthropic et activer les sauvegardes. En français simple, sans jargon.
```

## Hors code
- [ ] Poser une limite de dépense chez Anthropic
- [ ] Activer les sauvegardes quotidiennes
