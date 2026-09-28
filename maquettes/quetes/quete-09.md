# Quête #09 · Le check-in du soir

Section 2 · Se faire payer · environ 2 à 3 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** Chaque soir, on dit où on en est en une minute. La série compte les soirs où l'on vient, même sans avoir codé.

**Test :** Tu fais ton check-in ce soir, « pas touché » : ta série continue, et l'IA te répond deux phrases utiles.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **DEUX FOIS** · Deux check-ins le même soir → comptent pour un seul
- [ ] **PAS TOUCHÉ** · Un soir sans code mais avec check-in → la série continue
- [ ] **OUBLI** · Un soir sauté → la série repart à 1 le lendemain
- [ ] **FUSEAU** · Un utilisateur au Québec → sa journée finit à minuit chez lui, pas chez toi

## Le piège d'expérience
Compter les jours à l'heure de Paris. Un utilisateur à Montréal perd sa série à 18 h.

## Ce qu'il te faut
- La maquette maquettes/checkin.html

## Le prompt à coller dans Claude Code

```text
# QUÊTE #09 : LE CHECK-IN DU SOIR
Je veux le check-in du soir de LazyPM.

// 1. Ce que je veux obtenir :
- La page comme maquettes/checkin.html, avec les boutons collés en bas
- On coche les objectifs, on choisit « terminée », « à moitié » ou « pas touché », et on écrit deux lignes (sauf si terminée)
- L'IA répond en 2 phrases, bienveillantes et concrètes
- La série : le nombre de soirs d'affilée avec un check-in, quel que soit le résultat
- Une quête terminée passe en « faite » et la suivante s'ouvre

// 2. Les cas que tu dois obligatoirement gérer :
- Un seul check-in par jour, selon l'heure de la personne
- La réponse de l'IA arrive vite (quelques secondes), et coûte peu
- Les deux lignes sont obligatoires, avec un message clair si elles manquent

// 3. Explication pas à pas :
Ensuite, explique-moi comment la série est calculée, pour que je puisse l'expliquer à mes utilisateurs. En français simple, sans jargon.
```

## Hors code
- [ ] Remplacer ton carnet par ton propre check-in

## Dans ton journal
À partir de cette quête, LazyPM fait pour toi : le check-in du soir.
