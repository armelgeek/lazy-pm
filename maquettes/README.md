# LazyPM — maquettes HTML/CSS

Pages statiques, sans dépendance, sans build. Ouvre `index.html` dans un navigateur.

## Fichiers

| Page | Rôle |
|---|---|
| `index.html` | Landing en accès anticipé : 3 quêtes gratuites, liste des fondateurs à 5 $/mois |
| `index-lancement.html` | Landing du lancement public (quête #19) : abonnement 9 $/mois et pass saison 69 $ |
| `journal.html` | Le journal public : LazyPM construit avec LazyPM, soir après soir |
| `signup.html` | Création de compte (lien magique par email, Google, GitHub) |
| `login.html` | Connexion, et l'écran « Regarde ta boîte mail » |
| `compte.html` | Compte, abonnement, factures, résiliation |
| `paywall.html` | Le mur de la quête #04, en accès anticipé : réserver le prix fondateur |
| `paywall-lancement.html` | Le mur de la quête #04 au lancement public : abonnement 9 $/mois |
| `briefing.html` | Cadrage de l'idée vague |
| `plan.html` | Revue du plan avant engagement |
| `plan-en-cours.html` | Revue du plan une fois le parcours lancé |
| `chemin.html` | Le chemin des 30 quêtes |
| `quete.html` | Une quête boss ouverte, avec le panneau de déblocage |
| `checkin.html` | Le check-in du soir |
| `plus-tard.html` | Idées, choses à réparer et retours clients, triés par demande |
| `celebration.html` | Le premier client payant |
| `styles.css` | Le design system complet |

## Les 30 quêtes de LazyPM

Le dossier `quetes/` contient le plan pour construire LazyPM en vibe codant avec Claude Code, au format d'une quête LazyPM : le résultat et son test de vérité, les cas qu'on oublie, le piège, et le prompt à coller. `00-contexte-CLAUDE.md` (à copier en `CLAUDE.md` à la racine du vrai projet) garde les choix techniques pour Claude.

## Le design system

Tout est dans `styles.css`, en trois couches.

**Tokens** (`:root`) — papier, encre, or (l'accompli), teal (l'action),
rose (boss / échec / sauté), vert (succès), et la palette terminal.
Change une variable, tout suit.

**Composants** — `.btn` et ses variantes à relief, `.card`, `.term`,
`.node` (les nœuds du chemin), `.check` (les objectifs), `.pill`, `.tag`,
`.banner`, `.side` (barre latérale), `.stuck` (panneau de déblocage),
`.week`, `.toggle`, `.choice`, `.field`, `.footbar` (et `.footbar--actions`,
qui reste collé au-dessus de la barre d'onglets sur mobile).

**Utilitaires** — `.wrap`, `.row`, `.stack`, `.grid--2/3/4`, `.eyebrow`,
`.mono`, `.num`, `.txt`.

## Responsive

Une seule feuille couvre desktop et mobile. Trois bascules :

- **1100 px** — le panneau de déblocage passe sous le contenu, le serpentin se resserre
- **900 px** — les grilles à 3 et 4 colonnes passent à 2
- **820 px** — la barre latérale devient une barre d'onglets en bas de l'écran
- **720 px** — le serpentin s'aligne, les décalages `.o-*` sont annulés
- **620 px** — tout passe en une colonne

## Accessibilité

Vrais `<button>`, `<a href>`, `<input>` + `<label>`. `aria-current`,
`aria-pressed`, `aria-selected`, `aria-label` sur les boutons-icônes.
Focus visible en teal. `prefers-reduced-motion` respecté.
Les contrastes texte sont ≥ 4.5:1 — l'or n'est jamais utilisé comme
couleur de texte sur fond clair (seulement en remplissage).

## À faire avant de mettre en production

- Remplacer les `href="#"` du footer par les vraies pages légales
- Brancher le formulaire de capture d'idée et le champ de blocage
- Les polices viennent de Google Fonts — les héberger si besoin
