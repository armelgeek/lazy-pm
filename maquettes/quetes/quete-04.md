# Quête #04 · L'IA génère le plan · BOSS

Section 1 · Faire marcher le truc · environ 3 à 4 h · +50 XP

## 01 · Le résultat & le test de vérité
**À construire :** Après le briefing, LazyPM crée un plan de 30 quêtes réalistes en 4 sections, avec 3 boss toujours aux mêmes places.

**Test :** Tu génères le plan de LazyPM lui-même, et il ressemble à celui que tu as écrit à la main.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **STRUCTURE** · 5 idées différentes → toujours 30 quêtes, boss en #04, #11 et #19
- [ ] **HORS SUJET** · Une idée de site de recettes → aucune quête sur autre chose
- [ ] **TROP GROS** · Une idée énorme → le plan tient quand même en 30 quêtes
- [ ] **COÛT** · Une génération → tu sais combien elle t'a coûté

## Le piège d'expérience
L'IA invente des quêtes hors sujet ou trop grosses. Donne-lui le cadre des 4 sections et des 3 boss : elle remplit, elle n'invente pas la structure.

## Ce qu'il te faut
- La maquette maquettes/plan.html
- Ton propre plan écrit à la main, pour comparer

## Le prompt à coller dans Claude Code

```text
# QUÊTE #04 : L'IA GÉNÈRE LE PLAN
Je veux que LazyPM transforme un briefing en plan de 30 quêtes.

// 1. Ce que je veux obtenir :
- À partir du briefing, 30 quêtes avec un titre, un objectif et une durée
- Le cadre est fixe : section 1 « Faire marcher le truc » (#01 à #06), section 2 « Se faire payer » (#07 à #14), section 3 « Préparer le lancement » (#15 à #21), section 4 « Écouter et ajuster » (#22 à #30)
- Les boss sont toujours en #04 (le cœur du produit marche), #11 (premier client payant) et #19 (lancement public)
- La page du plan comme la maquette maquettes/plan.html : on peut couper une quête, dire « déjà fait », allonger une durée, et voir la date de lancement

// 2. Les cas que tu dois obligatoirement gérer :
- Si le plan sort mal, l'IA recommence une fois toute seule, puis affiche un message clair
- Ne pas écrire les prompts des quêtes maintenant : seulement les titres, objectifs et durées
- Couper une quête avance la date de lancement
- Garder une trace du coût de chaque génération

// 3. Explication pas à pas :
Ensuite, explique-moi comment voir combien me coûte chaque plan généré. En français simple, sans jargon.
```

## Hors code
- [ ] Générer ton propre plan avec l'outil, et garder la meilleure version
- [ ] Post « boss vaincu »

## Dans ton journal
À partir de cette quête, LazyPM fait pour toi : ton plan de 30 quêtes.
