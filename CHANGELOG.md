# Journal des modifications

Ce projet suit [Semantic Versioning](https://semver.org/lang/fr/) et s’inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [4.0.0] - Non publié

### Ajouté

- Client TypeScript autonome pour l’API Explore v2.1 de Hérault Data, sans authentification ni backend.
- Éditeur visuel Lovelace avec sélection en cascade de l’arrêt, de la ligne, de la destination et du sens, ainsi qu’un mode de saisie manuelle de secours.
- Mode opt-in `all_destinations` réunissant dans une seule carte de 1 à 3 passages par destination, avec filtre de sens facultatif.
- Cache partagé entre les instances de carte, mutualisation des requêtes en cours et conservation temporaire du dernier résultat valide.
- Contrôleur de rafraîchissement respectant le cycle de vie Lit, la visibilité de l’onglet et un compte à rebours local entre deux réponses réseau.
- États distincts pour chargement, absence de passages, hors-ligne, limitation HTTP 429, erreur et données anciennes.
- Affichage responsive, badge temps réel/théorique, mode compact, heure absolue facultative et état discret « À l’approche ».
- Traductions française et anglaise.
- Table compacte de styles et types de lignes dérivée des GTFS officiels, avec générateur de développement et attribution ODbL.
- Tests unitaires déterministes, contrôle API manuel facultatif et chaîne CI Node.js 24 / Yarn 4.
- Validation HACS en catégorie `plugin` et artefact de CI `tam-card.js`.

### Modifié

- Migration technique vers Lit 3, TypeScript 5, Rollup 4, ESLint moderne, Prettier et Vitest.
- Configuration canonique en `destination`, `direction_id`, `background_color` et `text_color`.
- Source de version unique dans `package.json`.
- Distribution HACS sous la forme d’un module unique `dist/tam-card.js`.
- Workflow manuel limité à la construction et à l’ajout de `tam-card.js` à une release GitHub encore en brouillon.
- Compte à rebours recalé sur `departure_time` en heure de Montpellier et sur la minute `HH:mm` affichée, avec gestion du passage de minuit et repli sur `delay_sec` lorsque l’heure est invalide.
- Signal visuel clignotant sur la bordure et le libellé « À l’approche », désactivé automatiquement lorsque la réduction des animations est demandée.

### Compatibilité

- Les anciens champs `direction`, `backgroundColor` et `textColor` restent acceptés et sont signalés comme dépréciés.
- Lorsque `line` manque, la carte tente de l’inférer depuis l’arrêt et la destination ; une ambiguïté demande une sélection explicite dans l’éditeur.

### Supprimé

- Ancien proxy Heroku et ancien endpoint GTFS-RT `TAM_MMM_GTFSRT`.
- Données historiques volumineuses embarquées (`merged_data.json`).
- Dépendances frontend et build obsolètes, dont Axios, Moment, `lit-element`, `lit-html`, `home-assistant-js-websocket` et `validate-color`.

### Sécurité et robustesse

- Construction des requêtes avec `URLSearchParams` et échappement des littéraux ODSQL.
- Validation tolérante des réponses distantes et stricte de la configuration locale.
- Timeouts, annulation, traitement des erreurs HTTP et absence d’injection HTML à partir des données distantes.

[4.0.0]: https://github.com/MathisAlepis/lovelace-tam-card/releases/tag/v4.0.0
