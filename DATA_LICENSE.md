# Licence et attribution des données

Le code source de TAM Card est distribué sous licence MIT (voir [LICENSE](LICENSE)). Cette licence ne se substitue pas à la licence des données de transport décrites ci-dessous.

## Données de transport

**Données : Montpellier Méditerranée Métropole / TaM, licence ODbL.**

- Prochains passages consultés à l’exécution via le jeu `tam_mmm_tpsreel` de [Hérault Data](https://www.herault-data.fr/explore/dataset/tam_mmm_tpsreel/).
- Styles et types de lignes dérivés des fichiers `routes.txt` des [GTFS urbain](https://data.montpellier3m.fr/GTFS/Urbain/GTFS.zip) et [GTFS suburbain](https://data.montpellier3m.fr/GTFS/Suburbain/GTFS.zip) officiels de Montpellier Méditerranée Métropole / TaM.

Ces bases sont mises à disposition selon l’[Open Database License 1.0 (ODbL)](https://opendatacommons.org/licenses/odbl/1-0/). Les éventuels droits sur le contenu individuel d’une base restent soumis aux conditions applicables publiées par le producteur.

Les fichiers [`src/data/route-styles.generated.ts`](src/data/route-styles.generated.ts) et [`route-styles.json`](route-styles.json) sont de petites bases dérivées : ils ne conservent que l’identifiant commercial, les couleurs et le type GTFS des lignes. Ils sont donc documentés et distribués comme dérivés ODbL, séparément du code sous licence MIT. Les métadonnées de la table TypeScript indiquent les URL sources et l’empreinte SHA-256 de chaque `routes.txt` utilisé. Le catalogue JSON est déterministe et ne contient aucun horodatage, afin qu’il ne change que lorsque les styles utiles changent réellement.

Les réponses de temps réel ne sont ni incorporées au dépôt ni redistribuées durablement : elles sont interrogées directement par le navigateur et conservées brièvement en mémoire. Toute redistribution publique d’une base adaptée ou enrichie doit conserver l’attribution et respecter les obligations de partage à l’identique de l’ODbL.

## Régénération

Le catalogue JSON a été régénéré le **22 juillet 2026**. Pour mettre à jour les deux formats à partir des sources officielles :

```bash
yarn update:route-styles
yarn update:route-catalog
```

Le script télécharge seulement les deux archives nécessaires, extrait `routes.txt`, valide les champs retenus, trie les lignes de façon déterministe et donne priorité au GTFS urbain lorsqu’un même identifiant est présent dans les deux flux. Chaque lundi, l’Action GitHub **Refresh route catalogue** régénère le JSON et ne pousse un commit que si son contenu change. Ces commandes ne sont jamais exécutées pendant le build ; le bundle reste reproductible et ne dépend pas du réseau.
