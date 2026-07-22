[![HACS](https://img.shields.io/badge/HACS-Dashboard-41BDF5.svg?style=for-the-badge)](https://www.hacs.xyz/)
[![License: MIT](https://img.shields.io/github/license/MathisAlepis/lovelace-tam-card?style=for-the-badge)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/MathisAlepis/lovelace-tam-card?style=for-the-badge)](https://github.com/MathisAlepis/lovelace-tam-card/releases)

# TAM Card

TAM Card est une carte Lovelace autonome qui affiche dans Home Assistant les prochains passages TaM à Montpellier. Elle peut suivre une destination précise ou réunir dans une seule carte le prochain passage de chaque destination d’un arrêt et d’une ligne. La configuration se fait directement dans le dashboard, sans intégration, entité, capteur, clé d’API, proxy ni serveur supplémentaire.

La version 4 conserve l’organisation visuelle historique — ligne à gauche, trajet au centre, deux passages à droite — dans une présentation responsive et accessible. Plusieurs cartes peuvent cohabiter sur le même dashboard et mutualisent leurs requêtes identiques.

![Aperçu historique de TAM Card](screenshot.png)

## Fonctionnalités

- prochains passages issus directement de l’API publique Hérault Data compatible CORS ;
- véritable éditeur visuel avec un mode « une destination » ou « toutes les destinations », des sélections en cascade et une saisie manuelle de secours ;
- une à cinq échéances, temps réel ou théoriques, triées et dédupliquées ;
- compte à rebours local actualisé chaque seconde et état discret « À l’approche » ;
- rafraîchissement réseau toutes les 60 secondes par défaut, suspendu quand l’onglet est masqué ;
- cache partagé entre cartes, dernier résultat valide conservé en cas d’erreur et catalogue hors-ligne ;
- styles des lignes actualisés chaque semaine depuis les GTFS officiels, avec repli local immédiat ;
- thèmes clair/sombre, couleurs personnalisées, mode compact, responsive mobile et réduction des animations ;
- français et anglais ;
- compatibilité progressive avec les configurations historiques de la carte.

## Installation

### HACS

1. Ouvrez **HACS → Dashboard**.
2. Dans le menu, choisissez **Dépôts personnalisés**.
3. Ajoutez `https://github.com/MathisAlepis/lovelace-tam-card` avec le type **Dashboard**.
4. Recherchez **TAM Card**, puis téléchargez la version souhaitée.
5. Rechargez complètement le navigateur.

HACS doit enregistrer automatiquement une ressource JavaScript de type `module`. Si la carte n’apparaît pas, vérifiez dans **Paramètres → Tableaux de bord → Ressources** :

```yaml
url: /hacsfiles/lovelace-tam-card/tam-card.js
type: module
```

Le type est appelé « Dashboard » dans l’interface HACS, mais sa catégorie de validation reste `plugin`.

### Installation manuelle

1. Téléchargez [`tam-card.js` de la dernière version stable](https://github.com/MathisAlepis/lovelace-tam-card/releases/latest/download/tam-card.js), ou choisissez une version précise dans les [releases GitHub](https://github.com/MathisAlepis/lovelace-tam-card/releases).
2. Copiez-le dans `<config>/www/tam-card.js` sur Home Assistant.
3. Ajoutez la ressource suivante, puis rechargez le navigateur :

```yaml
url: /local/tam-card.js
type: module
```

Si vous remplacez une ancienne version, ajoutez temporairement un suffixe comme `/local/tam-card.js?v=4.1.0` pour invalider le cache du navigateur.

## Configuration

### Éditeur visuel

Dans un dashboard en mode édition, choisissez **Ajouter une carte**, recherchez **TAM Card**, puis choisissez le mode d’affichage. Le mode historique sélectionne successivement l’arrêt, la ligne et une destination. Le mode « Toutes les destinations » demande seulement l’arrêt et la ligne, puis permet de conserver tous les sens ou de filtrer le sens 0 ou 1. Changer l’arrêt réinitialise la ligne et la destination ; changer la ligne réinitialise la destination et le sens. Les options d’affichage et de couleur sont disponibles dans le même éditeur.

Le catalogue est chargé depuis Hérault Data et mis en cache localement. En cas d’indisponibilité du portail, l’éditeur permet une saisie manuelle et propose de réessayer. Il enregistre toujours les noms de champs de la version 4.

### Exemple minimal

```yaml
type: custom:tam-card
stop: PABLO PICASSO
line: '3'
destination: LATTES CENTRE
```

### Exemple complet

```yaml
type: custom:tam-card
stop: PABLO PICASSO
line: '3'
direction_id: 1
destination: LATTES CENTRE
departures: 2
refresh_interval: 60
background_color: auto
text_color: auto
show_icon: true
show_line: true
show_realtime_badge: true
show_absolute_time: false
compact: false
```

### Toutes les destinations dans une carte

```yaml
type: custom:tam-card
display_mode: all_destinations
stop: PABLO PICASSO
line: '3'
direction_id: 1 # facultatif ; supprimer pour conserver tous les sens
departures_per_destination: 3
refresh_interval: 60
show_absolute_time: true
```

Ce mode affiche une ligne par destination actuellement annoncée, triée par prochain passage. Le réglage `departures_per_destination` permet de présenter de 1 à 3 passages pour chacune d’elles et vaut `1` par défaut. Le champ historique `departures` reste réservé au mode `destination`.

Les valeurs textuelles reprennent les libellés du jeu de données. L’éditeur visuel est le moyen le plus sûr de sélectionner une combinaison réellement disponible.

### Options

| Option                       | Type                                | Obligatoire               | Défaut                       | Description                                                                                                         |
| ---------------------------- | ----------------------------------- | ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `type`                       | chaîne                              | oui                       | —                            | Toujours `custom:tam-card`.                                                                                         |
| `stop`                       | chaîne                              | oui                       | —                            | Nom de l’arrêt TaM.                                                                                                 |
| `display_mode`               | `destination` ou `all_destinations` | non                       | `destination`                | Suit une destination précise ou réunit le prochain passage de chaque destination.                                   |
| `line`                       | chaîne                              | recommandé                | inférence historique         | Identifiant commercial, par exemple `"3"`, `"12"` ou `"A"`. Les guillemets YAML évitent toute conversion numérique. |
| `destination`                | chaîne                              | oui en mode `destination` | —                            | Girouette/destination (`trip_headsign`). Ignorée en mode `all_destinations`.                                        |
| `direction_id`               | `0` ou `1`                          | non                       | tous les sens correspondants | Filtre le sens, y compris en mode toutes les destinations. Ce champ n’est jamais nommé `direction`.                 |
| `departures`                 | entier de 1 à 5                     | non                       | `2`                          | Nombre de passages en mode `destination`.                                                                           |
| `departures_per_destination` | entier de 1 à 3                     | non                       | `1`                          | Nombre de passages affichés pour chaque destination en mode `all_destinations`.                                     |
| `refresh_interval`           | secondes de 30 à 300                | non                       | `60`                         | Intervalle des appels réseau. Le compte à rebours continue localement chaque seconde.                               |
| `background_color`           | couleur CSS ou `auto`               | non                       | `auto`                       | Nom CSS, hexadécimal ou couleur avec transparence. `auto` utilise la couleur officielle de la ligne.                |
| `text_color`                 | couleur CSS ou `auto`               | non                       | `auto`                       | Nom CSS, hexadécimal ou couleur avec transparence ; `auto` applique un repli contrasté.                             |
| `show_icon`                  | booléen                             | non                       | `true`                       | Affiche l’icône du véhicule (tram, bus ou transport générique).                                                     |
| `show_line`                  | booléen                             | non                       | `true`                       | Affiche le badge de la ligne.                                                                                       |
| `show_realtime_badge`        | booléen                             | non                       | `true`                       | Affiche le badge « Temps réel » ou « Théorique ».                                                                   |
| `show_absolute_time`         | booléen                             | non                       | `false`                      | Ajoute l’heure annoncée `HH:mm` au compte à rebours.                                                                |
| `compact`                    | booléen                             | non                       | `false`                      | Réduit les espacements pour les dashboards denses.                                                                  |

Les couleurs acceptent les noms CSS (`navy`, `white`, `transparent`), les formats hexadécimaux `#RGB`, `#RGBA`, `#RRGGBB` et `#RRGGBBAA`, ainsi que `rgb()`, `rgba()`, `hsl()`, `hsla()` et `var(--nom)`. Le dernier chiffre de `#RGBA`, ou les deux derniers de `#RRGGBBAA`, représente l’opacité. En YAML, une valeur hexadécimale doit être entourée de guillemets, sinon `#` commence un commentaire :

```yaml
background_color: '#12345680' # environ 50 % d’opacité
text_color: white
```

Les valeurs hors limites sont bornées par la normalisation centrale. Une couleur personnalisée invalide est refusée afin de conserver un rendu sûr et lisible. Pour un fond transparent ou fourni par une variable CSS personnalisée, renseignez aussi `text_color` si la couleur de texte du thème n’offre pas le contraste souhaité.

## Migration depuis les versions précédentes

Cette ancienne configuration reste acceptée :

```yaml
type: custom:tam-card
stop: Pablo Picasso
direction: LATTES CENTRE
textColor: auto
backgroundColor: auto
```

Elle correspond désormais à :

```yaml
type: custom:tam-card
stop: PABLO PICASSO
line: '3'
destination: LATTES CENTRE
text_color: auto
background_color: auto
```

- `direction` est un alias déprécié de `destination` uniquement lorsque `destination` est absent. Il ne représente jamais `direction_id`.
- `textColor` et `backgroundColor` sont les alias dépréciés de `text_color` et `background_color`.
- Si `line` est absent, la carte tente de l’inférer à partir de l’arrêt et de la destination. Si plusieurs lignes conviennent, elle affiche une erreur de configuration et demande de compléter la ligne dans l’éditeur.
- L’éditeur réécrit les prochaines modifications au format moderne ; mettez à jour le YAML manuel dès que possible.

Après la migration, si l’ancien rendu persiste, suivez la section [Dépannage du cache](#dépannage-du-cache).

## Temps réel, cache et fonctionnement hors connexion

La carte interroge directement le jeu [`tam_mmm_tpsreel`](https://www.herault-data.fr/explore/dataset/tam_mmm_tpsreel/api/) avec l’[API Explore v2.1](https://help.opendatasoft.com/apis/ods-explore-v2/) de Hérault Data. La requête est construite avec `URLSearchParams`, des littéraux ODSQL échappés et des filtres sur l’arrêt, la ligne, la destination éventuelle, le sens et les délais positifs. Aucun secret n’est nécessaire et aucune donnée distante n’est injectée comme HTML.

À la réception d’un passage, TAM Card recale le compteur sur `departure_time` dans le fuseau de Montpellier. `delay_sec`, calculé par la source à l’instant de génération du jeu, sert à choisir le bon jour autour de minuit et reste le repli si l’heure est invalide. L’affichage décroît ensuite toutes les secondes sans requête supplémentaire. Une arrivée à zéro est retirée et provoque un rafraîchissement anticipé lorsque cela est utile. Les passages partagent les garanties suivantes :

- déduplication prioritaire par `course_sae`, avec clé de repli ;
- tri par temps restant et suppression des valeurs négatives ou invalides ;
- distinction entre données temps réel et horaires théoriques ;
- timeout réseau, annulation propre, traitement spécifique de HTTP 429 et des réponses invalides.

Les instances demandant le même mode et la même combinaison arrêt/ligne/destination/sens partagent la même promesse et un cache de courte durée. En mode agrégé, une fenêtre bornée de 100 enregistrements est validée et dédupliquée avant de retenir localement les passages demandés pour chaque destination. La déconnexion d’une carte ne coupe pas une requête encore utilisée par une autre. Les listes de l’éditeur disposent d’un cache plus long, versionné dans `localStorage` ; les horaires live ne sont jamais conservés durablement sur disque.

Quand le navigateur passe hors connexion ou que l’API échoue, le dernier résultat valide en mémoire reste affiché avec un indicateur de donnée ancienne. Sans résultat antérieur, un message d’erreur explicite est présenté. Un résultat vide signifie « aucun passage annoncé » et n’est pas automatiquement transformé en « fin de service ».

Le rafraîchissement démarre à la connexion de la carte, s’arrête lorsqu’elle est retirée, se suspend lorsque le document est masqué et reprend immédiatement au retour. Aucune requête réseau n’est lancée depuis `render()` et les mises à jour fréquentes de l’objet `hass` ne redémarrent pas le cycle réseau.

## Couleurs et types de lignes

Hérault Data ne fournit pas les couleurs ou le type GTFS dans le jeu temps réel. TAM Card utilise donc un catalogue compact `route_short_name` → couleur de fond, couleur de texte et `route_type`, dérivé des GTFS urbain et suburbain officiels. Le tram (`route_type: 0`), le bus (`3`) et le transport générique utilisent des icônes adaptées ; une ligne inconnue reçoit la couleur de thème Home Assistant et un contraste noir/blanc calculé.

L’Action GitHub **Refresh route catalogue** vérifie les GTFS chaque lundi et met à jour [`route-styles.json`](route-styles.json) seulement lorsque les styles changent. La carte télécharge ce petit JSON au démarrage, le partage entre toutes ses instances et le conserve une semaine dans `localStorage`. Une page ouverte en continu relance également la vérification au bout d’une semaine.

Les archives GTFS elles-mêmes ne sont jamais téléchargées par Home Assistant. Si GitHub ou le réseau est indisponible, la table intégrée au bundle est utilisée immédiatement ; les passages et l’affichage ne sont donc jamais bloqués par cette actualisation. Après l’installation de cette version, une nouvelle ligne ou couleur publiée dans le GTFS ne demande plus de nouvelle compilation de TAM Card.

## Limites connues

- Le portail source est mis à jour approximativement minute par minute ; l’animation locale entre deux réponses n’augmente pas la précision de la donnée amont.
- La couverture temps réel peut être principalement urbaine selon le contenu actuel du jeu de données.
- Les alertes officielles, perturbations et positions de véhicules ne sont pas disponibles dans cette carte frontend pure.
- La carte dépend de l’accès CORS du navigateur à Hérault Data. Une politique réseau, un bloqueur ou une indisponibilité du portail peut empêcher les mises à jour.
- Les noms et associations de lignes suivent les données publiées. Une évolution inhabituelle du format GTFS peut demander une adaptation du générateur, mais une nouvelle ligne ou couleur est prise en charge automatiquement.
- Le mode toutes les destinations ne montre que les destinations possédant au moins un passage dans la fenêtre live bornée renvoyée par la source ; il n’invente pas une ligne « aucun passage » à partir du catalogue.
- Le cache live est volontairement volatil : après un rechargement complet hors connexion, aucun ancien horaire n’est inventé ou relu depuis `localStorage`.

## Attribution et licences

Le code est sous [licence MIT](LICENSE).

Les avis des bibliothèques Lit incorporées au bundle sont conservés dans [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) et directement dans `tam-card.js`.

**Données : Montpellier Méditerranée Métropole / TaM, licence ODbL.** Accès aux prochains passages via Hérault Data. La table de styles committée est une dérivation ODbL et ne relève pas uniquement de la licence MIT. Les détails et liens vers les sources figurent dans [DATA_LICENSE.md](DATA_LICENSE.md).

Aucun logo TaM protégé n’est inclus ; la carte utilise un badge texte et des icônes de transport génériques.

## Développement

### Prérequis

- Node.js 24 ;
- Yarn 4.12.0, géré par Corepack ;
- aucun outil global supplémentaire.

```bash
corepack enable
yarn install --immutable
```

### Commandes

| Commande                    | Rôle                                                                         |
| --------------------------- | ---------------------------------------------------------------------------- |
| `yarn start`                | Build de développement, surveillance des fichiers et serveur du bundle.      |
| `yarn lint`                 | Vérification ESLint.                                                         |
| `yarn format:check`         | Vérification Prettier sans modifier les fichiers.                            |
| `yarn typecheck`            | Vérification TypeScript sans émission.                                       |
| `yarn test`                 | Tests Vitest déterministes, sans réseau.                                     |
| `yarn test:coverage`        | Tests avec rapport de couverture.                                            |
| `yarn build`                | Bundle de production minifié dans `dist/tam-card.js`.                        |
| `yarn check`                | Lint, format, types, tests et build en une commande.                         |
| `yarn check:api`            | Contrat manuel facultatif contre l’API publique réelle.                      |
| `yarn update:route-styles`  | Régénération manuelle de la table TypeScript embarquée.                      |
| `yarn update:route-catalog` | Régénération du JSON consommé chaque semaine par les cartes déjà installées. |

La CI utilise Node.js 24, Yarn 4.12, `yarn install --immutable`, tous les contrôles ci-dessus, vérifie l’existence de `dist/tam-card.js`, lance la validation HACS et conserve le bundle comme artefact. Après une CI réussie sur `main`, la version de `package.json` est publiée automatiquement sous le tag `vX.Y.Z` avec `tam-card.js` comme asset. Si cette version existe déjà, aucun tag ni release supplémentaire n’est créé.

### Tester dans Home Assistant

1. Exécutez `yarn install --immutable && yarn build`.
2. Copiez `dist/tam-card.js` dans `<config>/www/tam-card.js` d’une instance Home Assistant de test.
3. Ajoutez `/local/tam-card.js?v=dev` comme ressource de type `module`, puis rechargez le frontend.
4. Ajoutez l’exemple Pablo Picasso ci-dessus et vérifiez les états chargement, succès, aucun passage et erreur.
5. Placez deux cartes identiques sur la même vue : une seule requête identique doit apparaître dans l’onglet Réseau des outils développeur.
6. Masquez puis rouvrez l’onglet, activez temporairement le mode hors-ligne du navigateur, passez sur un thème sombre et utilisez une largeur mobile pour vérifier reprise, donnée ancienne, contraste et responsive.

Le dépôt fournit des tests automatisés et un environnement de développement, mais un rendu Home Assistant réel reste une vérification manuelle.

## Dépannage du cache

Si Home Assistant affiche encore une ancienne carte après une mise à jour :

1. dans HACS, retéléchargez la version et vérifiez que l’opération est terminée ;
2. contrôlez que la ressource pointe vers `/hacsfiles/lovelace-tam-card/tam-card.js` et utilise le type `module` ;
3. effectuez un rechargement forcé du navigateur ou videz le cache du frontend Home Assistant ;
4. pour une installation manuelle, ajoutez temporairement `?v=4.1.0` à l’URL de la ressource ;
5. vérifiez dans l’onglet Réseau que `tam-card.js` et l’endpoint Hérault Data répondent sans erreur CORS, 404 ou 429.

## English quick guide

TAM Card is a standalone Home Assistant Lovelace card showing upcoming TaM departures in Montpellier. It talks directly to the public CORS-enabled Hérault Data Explore v2.1 API: there is no integration, entity, sensor, API key, proxy, backend, or embedded multi-megabyte timetable database.

Install it from HACS as a **Dashboard** custom repository, or copy the release asset to `/config/www/tam-card.js` and register `/local/tam-card.js` as a `module` resource. Configure it with the visual editor or YAML:

```yaml
type: custom:tam-card
stop: PABLO PICASSO
line: '3'
direction_id: 1
destination: LATTES CENTRE
departures: 2
refresh_interval: 60
```

To show the nearest departures for every currently announced destination in a single card, use:

```yaml
type: custom:tam-card
display_mode: all_destinations
stop: PABLO PICASSO
line: '3'
direction_id: 1 # optional; omit for all directions
departures_per_destination: 3
show_absolute_time: true
```

The source generally updates about once per minute; the countdown ticks locally each second. Identical cards share in-flight requests and a short-lived memory cache. The last valid result can be shown as stale after an error, while editor catalogues have a versioned `localStorage` fallback. Route colours and types are refreshed weekly from a small CORS-enabled JSON catalogue generated by GitHub Actions from the official GTFS feeds; the bundled table remains the offline fallback. Live departures are never persisted indefinitely. Legacy `direction`, `textColor`, and `backgroundColor` fields are accepted but deprecated; new configuration uses `destination`, `direction_id`, `text_color`, and `background_color`.

Known limitations are upstream coverage, browser/CORS availability, and the absence of service alerts or vehicle positions in this frontend-only version. Code is MIT; transport data and the compact GTFS-derived route style table require attribution under ODbL: **Data: Montpellier Méditerranée Métropole / TaM; live access through Hérault Data.** See [DATA_LICENSE.md](DATA_LICENSE.md).

Development requires Node.js 24 and Yarn 4.12 via Corepack. Run `yarn install --immutable`, then `yarn check`; use `yarn check:api` only for an optional live contract check.
