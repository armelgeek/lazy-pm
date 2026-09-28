# Quête #06 · Tester pour de vrai

Section 1 · Faire marcher le truc · environ 2 à 3 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** Un bouton « Signaler un problème » partout, et une page qui te montre où les gens s'arrêtent, de l'idée à la première quête.

**Test :** 5 personnes de ta liste font le parcours complet. Tu vois à quelle étape chacune s'est arrêtée.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **PAGE BLANCHE** · Une erreur n'importe où → un message compréhensible, jamais une page vide
- [ ] **SIGNALEMENT** · Un problème signalé → tu sais sur quelle page et sur quel téléphone
- [ ] **ÉTAPES** · Un testeur s'arrête au plan → tu le vois dans ta page de suivi
- [ ] **VIDE** · Un compte sans aucune quête commencée → la page dit quoi faire, elle n'est pas vide

## Le piège d'expérience
Expliquer le produit pendant le test. Tais-toi et regarde : chaque fois que tu dois expliquer, c'est un problème à corriger.

## Ce qu'il te faut
- 5 personnes de ta liste d'accord pour tester
- 30 minutes d'écran partagé avec au moins 2 d'entre elles

## Le prompt à coller dans Claude Code

```text
# QUÊTE #06 : TESTER POUR DE VRAI
Je vais faire tester LazyPM à 5 personnes.

// 1. Ce que je veux obtenir :
- Savoir combien de personnes arrivent à chaque étape : briefing, plan, compte, quête ouverte, prompt copié, objectif coché
- Voir ces chiffres dans ma page de suivi, sur les 7 derniers jours
- Un petit bouton « Signaler un problème » en bas de chaque page, qui me dit sur quelle page et sur quel navigateur

// 2. Les cas que tu dois obligatoirement gérer :
- Aucune page ne doit jamais s'afficher vide ou avec un message technique
- Chaque page sans contenu doit dire quoi faire ensuite
- Passer en revue toutes les pages et me lister ce qui peut encore casser

// 3. Explication pas à pas :
Ensuite, explique-moi comment lire les chiffres pour savoir où les gens abandonnent. En français simple, sans jargon.
```

## Hors code
- [ ] Faire 2 tests en écran partagé
- [ ] Corriger les 3 plus gros problèmes
- [ ] Post du soir : ce que les testeurs ont cassé
