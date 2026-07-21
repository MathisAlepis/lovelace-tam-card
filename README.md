[![HACS](https://img.shields.io/badge/HACS-Dashboard-41BDF5.svg?style=for-the-badge)](https://www.hacs.xyz/)
[![License: MIT](https://img.shields.io/github/license/MathisAlepis/lovelace-tam-card?style=for-the-badge)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/MathisAlepis/lovelace-tam-card?style=for-the-badge)](https://github.com/MathisAlepis/lovelace-tam-card/releases)

# TAM Card

TAM Card est une carte Lovelace autonome qui affiche dans Home Assistant les prochains passages TaM à Montpellier. L’arrêt, la ligne, la destination et le sens se configurent directement dans le dashboard, sans intégration, entité, capteur, clé d’API, proxy ni serveur supplémentaire.

La version 4 conserve l’organisation visuelle historique — ligne à gauche, trajet au centre, deux passages à droite — dans une présentation responsive et accessible. Plusieurs cartes peuvent cohabiter sur le même dashboard et mutualisent leurs requêtes identiques.

![Aperçu historique de TAM Card](screenshot.png)

## Fonctionnalités

- prochains passages issus directement de l’API publique Hérault Data compatible CORS ;
- véritable éditeur visuel avec sélections arrêt → ligne → destination/sens et saisie manuelle de secours ;
- une à cinq échéances, temps réel ou théoriques, triées et dédupliquées ;
- compte à rebours local actualisé chaque seconde et état discret « À l’approche » ;
- rafraîchissement réseau toutes les 60 secondes par défaut, suspendu quand l’onglet est masqué ;
- cache partagé entre cartes, dernier résultat valide conservé en cas d’erreur et catalogue hors-ligne ;
- styles des lignes issus d’une petite dérivation GTFS committée, sans base de plusieurs mégaoctets ;
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

1. Téléchargez `tam-card.js` depuis les assets de la [release GitHub](https://github.com/MathisAlepis/lovelace-tam-card/releases) souhaitée.
2. Copiez-le dans `<config>/www/tam-card.js` sur Home Assistant.
3. Ajoutez la ressource suivante, puis rechargez le navigateur :

```yaml
url: /local/tam-card.js
type: module
```

Si vous remplacez une ancienne version, ajoutez temporairement un suffixe comme `/local/tam-card.js?v=4.0.0` pour invalider le cache du navigateur.

## Configuration

### Éditeur visuel

Dans un dashboard en mode édition, choisissez **Ajouter une carte**, recherchez **TAM Card**, puis sélectionnez successivement l’arrêt, la ligne et la destination. Changer l’arrêt réinitialise la ligne et la destination ; changer la ligne réinitialise la destination et le sens. Les options d’affichage et de couleur sont disponibles dans le même éditeur.

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
show_line: true
show_realtime_badge: true
show_absolute_time: false
compact: false
```

Les valeurs textuelles reprennent les libellés du jeu de données. L’éditeur visuel est le moyen le plus sûr de sélectionner une combinaison réellement disponible.

### Options

| Option                | Type                  | Obligatoire           | Défaut                       | Description                                                                                                         |
| --------------------- | --------------------- | --------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `type`                | chaîne                | oui                   | —                            | Toujours `custom:tam-card`.                                                                                         |
| `stop`                | chaîne                | oui                   | —                            | Nom de l’arrêt TaM.                                                                                                 |
| `line`                | chaîne                | recommandé            | inférence historique         | Identifiant commercial, par exemple `"3"`, `"12"` ou `"A"`. Les guillemets YAML évitent toute conversion numérique. |
| `destination`         | chaîne                | oui pour les horaires | —                            | Girouette/destination (`trip_headsign`).                                                                            |
| `direction_id`        | `0` ou `1`            | non                   | tous les sens correspondants | Filtre le sens lorsque deux destinations portent le même nom. Ce champ n’est jamais nommé `direction`.              |
| `departures`          | entier de 1 à 5       | non                   | `2`                          | Nombre de prochains passages affichés.                                                                              |
| `refresh_interval`    | secondes de 30 à 300  | non                   | `60`                         | Intervalle des appels réseau. Le compte à rebours continue localement chaque seconde.                               |
| `background_color`    | couleur CSS ou `auto` | non                   | `auto`                       | Fond de la carte. `auto` utilise la couleur officielle de la ligne.                                                 |
| `text_color`          | couleur CSS ou `auto` | non                   | `auto`                       | Couleur principale du texte avec repli contrasté.                                                                   |
| `show_line`           | booléen               | non                   | `true`                       | Affiche le badge et l’identité de la ligne.                                                                         |
| `show_realtime_badge` | booléen               | non                   | `true`                       | Affiche le badge « Temps réel » ou « Théorique ».                                                                   |
| `show_absolute_time`  | booléen               | non                   | `false`                      | Ajoute l’heure annoncée `HH:mm` au compte à rebours.                                                                |
| `compact`             | booléen               | non                   | `false`                      | Réduit les espacements pour les dashboards denses.                                                                  |

Les valeurs hors limites sont bornées par la normalisation centrale. Une couleur personnalisée invalide est refusée afin de conserver un rendu sûr et lisible.
Pour un fond transparent ou fourni par une variable CSS personnalisée, renseignez aussi `text_color` si la couleur de texte du thème n’offre pas le contraste souhaité.

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

La carte interroge directement le jeu [`tam_mmm_tpsreel`](https://www.herault-data.fr/explore/dataset/tam_mmm_tpsreel/api/) avec l’[API Explore v2.1](https://help.opendatasoft.com/apis/ods-explore-v2/) de Hérault Data. La requête est construite avec `URLSearchParams`, des littéraux ODSQL échappés et des filtres sur l’arrêt, la ligne, la destination, le sens et les délais positifs. Aucun secret n’est nécessaire et aucune donnée distante n’est injectée comme HTML.

À la réception d’un passage, TAM Card calcule son instant prédit à partir de `delay_sec` et de l’heure locale de réception. L’affichage décroît ensuite toutes les secondes sans requête supplémentaire. Une arrivée à zéro est retirée et provoque un rafraîchissement anticipé. Les passages partagent les garanties suivantes :

- déduplication prioritaire par `course_sae`, avec clé de repli ;
- tri par temps restant et suppression des valeurs négatives ou invalides ;
- distinction entre données temps réel et horaires théoriques ;
- timeout réseau, annulation propre, traitement spécifique de HTTP 429 et des réponses invalides.

Les instances demandant la même combinaison arrêt/ligne/destination/sens partagent la même promesse et un cache de courte durée. La déconnexion d’une carte ne coupe pas une requête encore utilisée par une autre. Les listes de l’éditeur disposent d’un cache plus long, versionné dans `localStorage` ; les horaires live ne sont jamais conservés durablement sur disque.

Quand le navigateur passe hors connexion ou que l’API échoue, le dernier résultat valide en mémoire reste affiché avec un indicateur de donnée ancienne. Sans résultat antérieur, un message d’erreur explicite est présenté. Un résultat vide signifie « aucun passage annoncé » et n’est pas automatiquement transformé en « fin de service ».

Le rafraîchissement démarre à la connexion de la carte, s’arrête lorsqu’elle est retirée, se suspend lorsque le document est masqué et reprend immédiatement au retour. Aucune requête réseau n’est lancée depuis `render()` et les mises à jour fréquentes de l’objet `hass` ne redémarrent pas le cycle réseau.

## Couleurs et types de lignes

Hérault Data ne fournit pas les couleurs ou le type GTFS dans le jeu temps réel. TAM Card embarque donc uniquement une table compacte `route_short_name` → couleur de fond, couleur de texte et `route_type`, générée depuis les GTFS urbain et suburbain officiels. Le tram (`route_type: 0`), le bus (`3`) et le transport générique utilisent des icônes adaptées ; une ligne inconnue reçoit la couleur de thème Home Assistant et un contraste noir/blanc calculé.

La table committée permet au build et à la carte de fonctionner sans télécharger les GTFS. Sa date, ses empreintes et sa méthode de régénération figurent dans [DATA_LICENSE.md](DATA_LICENSE.md).

## Limites connues

- Le portail source est mis à jour approximativement minute par minute ; l’animation locale entre deux réponses n’augmente pas la précision de la donnée amont.
- La couverture temps réel peut être principalement urbaine selon le contenu actuel du jeu de données.
- Les alertes officielles, perturbations et positions de véhicules ne sont pas disponibles dans cette carte frontend pure.
- La carte dépend de l’accès CORS du navigateur à Hérault Data. Une politique réseau, un bloqueur ou une indisponibilité du portail peut empêcher les mises à jour.
- Les noms et associations de lignes suivent les données publiées. Une évolution du réseau peut nécessiter une nouvelle sélection dans l’éditeur et une régénération facultative des styles.
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

| Commande                   | Rôle                                                                         |
| -------------------------- | ---------------------------------------------------------------------------- |
| `yarn start`               | Build de développement, surveillance des fichiers et serveur du bundle.      |
| `yarn lint`                | Vérification ESLint.                                                         |
| `yarn format:check`        | Vérification Prettier sans modifier les fichiers.                            |
| `yarn typecheck`           | Vérification TypeScript sans émission.                                       |
| `yarn test`                | Tests Vitest déterministes, sans réseau.                                     |
| `yarn test:coverage`       | Tests avec rapport de couverture.                                            |
| `yarn build`               | Bundle de production minifié dans `dist/tam-card.js`.                        |
| `yarn check`               | Lint, format, types, tests et build en une commande.                         |
| `yarn check:api`           | Contrat manuel facultatif contre l’API publique réelle.                      |
| `yarn update:route-styles` | Régénération manuelle de la petite table GTFS ; jamais appelée par le build. |

La CI utilise Node.js 24, Yarn 4.12, `yarn install --immutable`, tous les contrôles ci-dessus, vérifie l’existence de `dist/tam-card.js`, lance la validation HACS et conserve le bundle comme artefact.

### Tester dans Home Assistant

1. Exécutez `yarn install --immutable && yarn build`.
2. Copiez `dist/tam-card.js` dans `<config>/www/tam-card.js` d’une instance Home Assistant de test.
3. Ajoutez `/local/tam-card.js?v=dev` comme ressource de type `module`, puis rechargez le frontend.
4. Ajoutez l’exemple Pablo Picasso ci-dessus et vérifiez les états chargement, succès, aucun passage et erreur.
5. Placez deux cartes identiques sur la même vue : une seule requête identique doit apparaître dans l’onglet Réseau des outils développeur.
6. Masquez puis rouvrez l’onglet, activez temporairement le mode hors-ligne du navigateur, passez sur un thème sombre et utilisez une largeur mobile pour vérifier reprise, donnée ancienne, contraste et responsive.

Le dépôt fournit des tests automatisés et un environnement de développement, mais un rendu Home Assistant réel reste une vérification manuelle avant publication.

## Préparer une release

La version 4.0.0 est préparée mais aucun workflow ne crée ni ne publie une release automatiquement.

1. Vérifier la version dans `package.json` et compléter [CHANGELOG.md](CHANGELOG.md).
2. Exécuter `yarn install --immutable` puis `yarn check`.
3. Vérifier que `dist/tam-card.js` existe et tester manuellement ce fichier dans Home Assistant.
4. Créer et pousser le tag signé ou annoté `v4.0.0` uniquement lorsque la publication est décidée.
5. Créer une **release brouillon** GitHub correspondant à ce tag.
6. Déclencher manuellement le workflow **Prepare draft release bundle** avec `tag: v4.0.0`.
7. Vérifier l’asset `tam-card.js`, puis publier explicitement la release.

Le workflow refuse une release déjà publiée : il construit le tag avec les dépendances verrouillées et attache exactement `tam-card.js` pendant que la release est encore un brouillon, ce qui reste compatible avec les releases GitHub immuables. Il ne publie rien, ne pousse aucun commit et ne crée aucun tag. Le même bundle reste versionné dans `dist/` pour l’installation HACS depuis le dépôt.

## Dépannage du cache

Si Home Assistant affiche encore une ancienne carte après une mise à jour :

1. dans HACS, retéléchargez la version et vérifiez que l’opération est terminée ;
2. contrôlez que la ressource pointe vers `/hacsfiles/lovelace-tam-card/tam-card.js` et utilise le type `module` ;
3. effectuez un rechargement forcé du navigateur ou videz le cache du frontend Home Assistant ;
4. pour une installation manuelle, ajoutez temporairement `?v=4.0.0` à l’URL de la ressource ;
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

The source generally updates about once per minute; the countdown ticks locally each second. Identical cards share in-flight requests and a short-lived memory cache. The last valid result can be shown as stale after an error, while editor catalogues have a versioned `localStorage` fallback. Live departures are never persisted indefinitely. Legacy `direction`, `textColor`, and `backgroundColor` fields are accepted but deprecated; new configuration uses `destination`, `direction_id`, `text_color`, and `background_color`.

Known limitations are upstream coverage, browser/CORS availability, and the absence of service alerts or vehicle positions in this frontend-only version. Code is MIT; transport data and the compact GTFS-derived route style table require attribution under ODbL: **Data: Montpellier Méditerranée Métropole / TaM; live access through Hérault Data.** See [DATA_LICENSE.md](DATA_LICENSE.md).

Development requires Node.js 24 and Yarn 4.12 via Corepack. Run `yarn install --immutable`, then `yarn check`; use `yarn check:api` only for an optional live contract check. The manually dispatched release workflow only attaches `dist/tam-card.js` to an existing draft release and never publishes it by itself.
