# LazyPM · contexte pour Claude Code

Ce fichier est pour Claude, pas pour toi. Copie-le une fois à la racine du projet sous le nom CLAUDE.md : Claude Code le lit à chaque quête.

## Le produit
LazyPM aide les gens qui construisent avec l'IA (Lovable, Bolt, Cursor, Claude Code, v0) à finir leur projet, de l'idée au premier client, en 30 quêtes. Chaque quête a un résultat à construire, un test de vérité, les cas qu'on oublie, un piège, et le prompt exact à coller. Un check-in chaque soir entretient une série et recale la date de lancement. Un copilote aide quand on bloque.

## Qui te parle
Le fondateur construit LazyPM en vibe codant. Il décrit des résultats, pas du code. Toi, tu fais les choix techniques ci-dessous sans lui demander, et tu lui expliques ce qu'il doit faire de son côté, en français simple, sans jargon, étape par étape.

## Choix techniques (à appliquer sans les redemander)
- Next.js (App Router, TypeScript), hébergé sur Vercel
- Supabase : base de données, connexion par lien magique, Row Level Security sur toutes les tables
- API Claude (Anthropic) : réponses de l'IA toujours en JSON validé avec Zod, prompts système dans lib/prompts/, coût de chaque appel enregistré
- Stripe : Checkout, abonnements, webhooks vérifiés et traités une seule fois, portail client
- Resend pour les emails, tâches planifiées Vercel pour les envois réguliers
- Design : reproduire les maquettes du dossier maquettes/ (HTML + styles.css), sans librairie d'UI

## Le cadre fixe d'un plan
- Section 1 · Faire marcher le truc : #01 à #06
- Section 2 · Se faire payer : #07 à #14
- Section 3 · Préparer le lancement : #15 à #21
- Section 4 · Écouter et ajuster : #22 à #30
- Boss : #04 (le cœur du produit marche), #11 (premier client payant), #19 (lancement public)

## Le modèle économique
- Quêtes #01 à #03 gratuites, prompts compris. Le plan entier reste visible.
- À partir de la #04 : abonnement 9 $/mois, ou pass saison 69 $ (12 mois, 3 projets, remboursé si rien n'est lancé à la #30).
- Accès anticipé : prix fondateur 5 $/mois à vie pour les 20 premiers de la liste des fondateurs.
- Le prompt d'une quête est écrit à son ouverture, jamais les 30 d'un coup. Tout blocage d'accès se fait côté serveur.

## Règles
- Reproduire fidèlement les maquettes du dossier maquettes/.
- Textes de l'interface en français, en tutoyant, phrases courtes. Jamais d'alert() ni de confirm().
- Chaque personne ne voit que ses propres données. Les clés secrètes ne sont jamais visibles dans le navigateur.
- Avant de coder : proposer un plan court, en mots simples, et attendre l'accord.
- Après : vérifier que tout marche, puis donner la liste de ce que le fondateur doit tester lui-même, comme un utilisateur.
