# Quête #18 · Le replanning

Section 3 · Préparer le lancement · environ 2 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** Quand on prend du retard, la date de lancement bouge honnêtement, et on peut alléger le plan sans culpabiliser.

**Test :** Tu retires une quête à venir : la date de lancement avance sous tes yeux, et « Annuler » remet tout comme avant.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **VRAI RYTHME** · Quelqu'un qui fait 1 h par soir au lieu de 2 → la date se base sur 1 h
- [ ] **VERROU** · Une quête déjà faite → impossible à modifier
- [ ] **ANNULER** · Des changements puis « Annuler » → le plan revient comme avant
- [ ] **RETARD** · 3 soirs de retard → une proposition de replanning, sans reproche

## Le piège d'expérience
Calculer la date avec ce que la personne a promis au briefing. En une semaine, elle est fausse.

## Ce qu'il te faut
- La maquette maquettes/plan-en-cours.html

## Le prompt à coller dans Claude Code

```text
# QUÊTE #18 : LE REPLANNING
Je veux que le plan de LazyPM s'adapte au vrai rythme.

// 1. Ce que je veux obtenir :
- La date de lancement calculée avec le rythme réel des deux dernières semaines
- La page du plan en cours comme maquettes/plan-en-cours.html : quêtes faites verrouillées, quête sautée à reprendre, quêtes à venir avec « +1 h » et « retirer »
- La nouvelle date affichée avant d'enregistrer, et un bouton « Annuler »
- Après 3 soirs de retard, un message dans le chemin qui propose de replanifier

// 2. Les cas que tu dois obligatoirement gérer :
- Les quêtes faites ne bougent jamais
- Rien n'est enregistré tant que la personne n'a pas cliqué sur « Enregistrer »
- Le message de retard disparaît après le replanning

// 3. Explication pas à pas :
Ensuite, explique-moi comment la date de lancement est calculée. En français simple, sans jargon.
```

## Dans ton journal
À partir de cette quête, LazyPM fait pour toi : le replanning quand tu prends du retard.
