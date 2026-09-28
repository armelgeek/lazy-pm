# Quête #03 · Le briefing marche

Section 1 · Faire marcher le truc · environ 2 à 3 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** Une page où l'on écrit son idée en une phrase. L'IA la reformule clairement et pose 3 questions qui changent le plan.

**Test :** Tu écris « je veux un site pour vendre mes photos » : l'IA reformule juste, et pose 3 questions utiles.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **VAGUE** · Une idée en 4 mots → une reformulation claire quand même
- [ ] **ÉNORME** · Une idée à la Airbnb → l'IA propose une version plus petite
- [ ] **PANNE** · L'IA ne répond pas → un message clair et un bouton « réessayer »
- [ ] **CORRECTION** · La reformulation est fausse → tu peux la corriger avant de continuer

## Le piège d'expérience
Laisser l'IA bavarder. Si elle ajoute des phrases de politesse, la page casse : demande une réponse toujours au même format.

## Ce qu'il te faut
- Un compte chez Anthropic pour l'IA, avec quelques dollars de crédit
- La maquette maquettes/briefing.html

## Le prompt à coller dans Claude Code

```text
# QUÊTE #03 : LE BRIEFING MARCHE
Je veux la page de briefing de LazyPM.

// 1. Ce que je veux obtenir :
- La page comme la maquette maquettes/briefing.html
- On écrit son idée (déjà remplie si elle vient de la page d'accueil)
- L'IA reformule l'idée en une phrase, puis pose toujours 3 questions : l'outil utilisé (Lovable, Bolt, Cursor, Claude Code, v0), le temps disponible par soir, et gratuit ou payant
- On peut corriger la reformulation, et les réponses sont gardées, même sans compte

// 2. Les cas que tu dois obligatoirement gérer :
- Toujours exactement 3 questions, jamais une réponse en vrac
- Pendant que l'IA réfléchit, on voit que ça charge
- Si l'IA ne répond pas, un message clair et un bouton pour réessayer
- Ma clé d'accès à l'IA ne doit jamais être visible dans le navigateur

// 3. Explication pas à pas :
Ensuite, explique-moi comment modifier moi-même les instructions données à l'IA, pour améliorer ses questions. En français simple, sans jargon.
```

## Hors code
- [ ] Poser une limite de dépense mensuelle chez Anthropic dès ta première clé
- [ ] Tester le briefing avec les idées des personnes de la #02
