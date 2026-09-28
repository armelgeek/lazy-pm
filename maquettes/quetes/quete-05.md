# Quête #05 · Comptes et page de quête

Section 1 · Faire marcher le truc · environ 3 h · +20 XP

## 01 · Le résultat & le test de vérité
**À construire :** On se crée un compte avec un simple lien par email, on retrouve son plan, et chaque quête s'ouvre avec son prompt prêt à copier.

**Test :** Tu fais un plan sans compte, tu te connectes, et ton plan est là. Tu ouvres la #01 et tu copies son prompt sur ton téléphone.

## 02 · La checklist de test : les cas que tu oublies
- [ ] **RETROUVÉ** · Un plan fait avant de créer son compte → toujours là après la connexion
- [ ] **SAFARI** · Le bouton Copier sur un iPhone → le texte est bien copié
- [ ] **UNE FOIS** · La même quête ouverte deux fois → le même prompt, pas un nouveau payé deux fois
- [ ] **VOISIN** · Avec un deuxième compte, tu changes l'adresse de la page → impossible de voir la quête de l'autre

## Le piège d'expérience
Écrire les 30 prompts d'un coup à la création du plan. C'est 30 fois plus cher, pour des quêtes que la plupart n'atteindront jamais.

## Ce qu'il te faut
- Les maquettes signup, login, chemin et quete

## Le prompt à coller dans Claude Code

```text
# QUÊTE #05 : COMPTES ET PAGE DE QUÊTE
Je veux les comptes et la page de quête de LazyPM.

// 1. Ce que je veux obtenir :
- Connexion sans mot de passe : on reçoit un lien par email, comme dans maquettes/signup.html et maquettes/login.html
- Le plan fait avant la connexion est gardé dans le compte
- Le chemin des quêtes comme maquettes/chemin.html
- La page de quête comme maquettes/quete.html : objectif, prompt à copier, objectifs à cocher, piège. Le prompt est écrit par l'IA à la première ouverture, adapté à l'outil de la personne, puis gardé

// 2. Les cas que tu dois obligatoirement gérer :
- Chaque personne ne voit que ses propres plans et quêtes, même en changeant l'adresse de la page
- Le bouton Copier doit marcher sur iPhone et sur Android
- Le lien de connexion peut être renvoyé après 30 secondes

// 3. Explication pas à pas :
Ensuite, explique-moi comment vérifier moi-même qu'un compte ne peut pas voir les données d'un autre. En français simple, sans jargon.
```

## Hors code
- [ ] Utiliser tes propres prompts générés à partir de ce soir

## Dans ton journal
À partir de cette quête, LazyPM fait pour toi : le prompt de chaque quête.
