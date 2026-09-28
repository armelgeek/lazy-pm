# 📓 Journal ShipInDays

## Jour 1 · 2025-09-25

### ✅ Quête #01 · Le site existe

**Résultats :**
- Page d'accueil en ligne avec formulaire
- Formulaire briefing pour capturer idée + email
- Sauvegarde dans Supabase
- Page admin privée pour voir les inscrits
- Styles reproduits de la maquette

**Tests réussis :**
- ✅ TÉLÉPHONE · Responsive sur mobile
- ✅ DOUBLON · Même email deux fois = mise à jour seulement
- ✅ FAUTE · Email invalide = message d'erreur clair
- ✅ ADRESSE · Fonctionne sans www

**Tech stack :**
- Next.js (App Router, TypeScript)
- Supabase (base de données)
- Vercel (déploiement)

**Série :** Jour 1 ✨
**XP :** +20

---

## Jour 2 · 2025-09-28

### ✅ Quête #02 · Des gens en veulent

**Résultats :**
- Email de bienvenue avec template facile à modifier
- Prénom du fondateur dans la signature (via FOUNDER_NAME)
- Page de suivi /suivi protégée par mot de passe
- Tracking de l'origine (utm_source) pour chaque inscrit
- Support des réponses à l'email (Resend)

**Tests réussis :**
- ✅ EMAIL · Email de bienvenue arrive rapidement
- ✅ SPAM · Email ne va pas au spam (Resend)
- ✅ PRIVÉ · Page de suivi bloquée sans password
- ✅ RÉPONSE · Les réponses à l'email arrivent bien

**XP :** +20

### ✅ Quête #03 · Le briefing marche

**Résultats :**
- API /api/brief appelle Claude pour reformuler l'idée
- Page briefing affiche la reformulation + 3 questions
- Questions : outil (Lovable/Bolt/Cursor/Claude Code/v0), temps/jour, payant/gratuit
- Gestion des erreurs + retry automatique
- Réponses gardées en mémoire avant de continuer

**Tests réussis :**
- ✅ REFORMULATION · L'IA reformule clairement les idées vagues
- ✅ QUESTIONS · Toujours exactement 3 questions
- ✅ ERREUR · Message clair + bouton réessayer si l'IA ne répond pas
- ✅ CORRECTION · L'utilisateur peut corriger la reformulation

**Coûts :**
- Input: ~500-700 tokens/appel
- Output: ~300-400 tokens/appel

**XP :** +20

### ✅ Quête #04 · L'IA génère le plan (BOSS)

**Résultats :**
- API /api/generate-plan crée les 30 quêtes auto
- Structure fixe : 4 sections, 3 boss (#04, #11, #19)
- Page /plan affiche le plan avec options :
  - Cocher une quête pour la passer
  - Changer la durée estimée de chaque quest
  - Voir la date de lancement en temps réel
- Calcul du coût pour chaque génération
- Retry auto si la réponse JSON n'est pas valide

**Tests réussis :**
- ✅ STRUCTURE · Boss toujours aux places #04, #11, #19
- ✅ COUPE · Passer une quête recalcule la date
- ✅ DURÉE · Changer les heures recalcule le lancement
- ✅ COÛT · Voir le coût en tokens

**Coûts :**
- Input: ~2000-2500 tokens/appel
- Output: ~1500-2000 tokens/appel

**XP :** +50

---

**Série :** 4 quêtes en 2 jours 🚀
**Total XP :** 110

---

### Tests complétés

✅ **#02** · Email arrive en <1min, suivi fonctionne, tracking par source OK
✅ **#03** · IA reformule et pose 3 questions, réponses sauvegardées
✅ **#04** · Plan généré avec 30 quêtes, boss aux bons endroits, durées ajustables

**Status:** Prêt pour la quête #05
