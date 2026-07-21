# Licence et attribution des données

Le code source de TAM Card est distribué sous licence MIT (voir [LICENSE](LICENSE)). Cette licence ne se substitue pas à la licence des données de transport décrites ci-dessous.

## Données de transport

**Données : Montpellier Méditerranée Métropole / TaM, licence ODbL.**

- Prochains passages consultés à l’exécution via le jeu `tam_mmm_tpsreel` de [Hérault Data](https://www.herault-data.fr/explore/dataset/tam_mmm_tpsreel/).
- Styles et types de lignes dérivés des fichiers `routes.txt` des [GTFS urbain](https://data.montpellier3m.fr/GTFS/Urbain/GTFS.zip) et [GTFS suburbain](https://data.montpellier3m.fr/GTFS/Suburbain/GTFS.zip) officiels de Montpellier Méditerranée Métropole / TaM.

Ces bases sont mises à disposition selon l’[Open Database License 1.0 (ODbL)](https://opendatacommons.org/licenses/odbl/1-0/). Les éventuels droits sur le contenu individuel d’une base restent soumis aux conditions applicables publiées par le producteur.

Le fichier [`src/data/route-styles.generated.ts`](src/data/route-styles.generated.ts) est une petite base dérivée : il ne conserve que l’identifiant commercial, les couleurs et le type GTFS des lignes. Il est donc documenté et distribué comme dérivé ODbL, séparément du code sous licence MIT. Ses métadonnées indiquent les URL sources et l’empreinte SHA-256 de chaque `routes.txt` utilisé. Les en-têtes HTTP volatils ne sont pas inscrits afin qu’un contenu GTFS identique produise un fichier strictement identique.

Les réponses de temps réel ne sont ni incorporées au dépôt ni redistribuées durablement : elles sont interrogées directement par le navigateur et conservées brièvement en mémoire. Toute redistribution publique d’une base adaptée ou enrichie doit conserver l’attribution et respecter les obligations de partage à l’identique de l’ODbL.

## Régénération

La table a été régénérée le **21 juillet 2026**. Pour la mettre à jour à partir des sources officielles :

```bash
yarn update:route-styles
```

Le script télécharge seulement les deux archives nécessaires, extrait `routes.txt`, valide les champs retenus, trie les lignes de façon déterministe et donne priorité au GTFS urbain lorsqu’un même identifiant est présent dans les deux flux. Cette commande de maintenance n’est jamais exécutée pendant le build ; le bundle reste reproductible et ne dépend pas du réseau.
