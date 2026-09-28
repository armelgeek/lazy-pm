# Quête #08 · Le mur de la #04

Section 2 · Se faire payer · environ 2 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** Les quêtes #01 à #03 sont gratuites. À partir de la #04, il faut être abonné pour obtenir les prompts et le copilote.

**Test :** Avec un compte gratuit, tu ouvres la #03 puis la #04 : la #04 affiche le paywall, sans son prompt.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **TRICHE** · Quelqu'un bidouille la page pour voir le prompt de la #05 → rien ne s'affiche
- [ ] **PLAN** · Un compte gratuit → voit quand même les titres des 30 quêtes
- [ ] **ABUS** · Quelqu'un clique 100 fois pour générer → bloqué après une limite raisonnable
- [ ] **ABONNÉ** · Un compte abonné → la #04 s'ouvre directement

## Le piège d'expérience
Cacher le prompt seulement dans la page. N'importe qui peut le récupérer : le refus doit venir du serveur.

## Ce qu'il te faut
- Les maquettes paywall.html et paywall-lancement.html

## Le prompt à coller dans Claude Code

```text
# QUÊTE #08 : LE MUR DE LA #04
Je veux protéger mes crédits IA avec le mur de la quête #04.

// 1. Ce que je veux obtenir :
- Quêtes #01 à #03 complètes pour tout le monde
- À partir de la #04, sans abonnement : pas de prompt, pas de copilote, et la page du paywall comme maquettes/paywall.html
- Un réglage simple pour passer du paywall « accès anticipé » à celui du lancement (maquettes/paywall-lancement.html)
- Le plan reste entièrement visible en gratuit

// 2. Les cas que tu dois obligatoirement gérer :
- Le blocage ne doit pas pouvoir être contourné en modifiant la page
- Une limite de générations par jour et par personne, avec un message clair
- Un abonné n'est jamais bloqué

// 3. Explication pas à pas :
Ensuite, explique-moi comment vérifier que le blocage marche vraiment, même pour quelqu'un qui bidouille. En français simple, sans jargon.
```
