[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration) [![License: MIT](https://img.shields.io/github/license/MathisAlepis/lovelace-tam-card?style=for-the-badge)](https://opensource.org/licenses/MIT) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/MathisAlepis/lovelace-tam-card?style=for-the-badge) ![Maintenance](https://img.shields.io/maintenance/yes/2024?style=for-the-badge)

# TAM Card

## 🟥 Suite à un changement de fonctionnement sur la transmission des données du côté de la métropole de Montpellier la "lovelace-card" ne fonctionne plus. Je vais développer une nouvelle version pour prendre en compte leur changement au plus vite.🟥

Montpellier Lovelace TAM card displays next two crossing times of the tramway or bus in Montpellier, France.

The APP get's [csv files](https://data.montpellier3m.fr/dataset/offre-de-transport-tam-en-temps-reel) from official TAM services of city of Montpellier and "lovelace tam card" display's this data.


![Screenshot](https://raw.githubusercontent.com/MathisAlepis/lovelace-tam-card/main/screenshot.png 'Example Card')

## Options

| Name				| Type		| Requirement		| Description			| Default			|
| ----------------- | --------- | ----------------- | --------------------- | ----------------- |
| type				|	string	|	**Required**	| `custom:tam-card`		| `custom:tam-card`	|
| stop				|	string	|	**Required**	| Arrêt					| `PABLO PICASSO`	|
| direction 		|	string	|	**Required**	| Direction				| `LATTES CENTRE`	|
| textColor			|	string	|	**NO**			| Text Color			| `auto` or ` ` 	|
| backgroundColor	|	string	|	**NO**			| Background Color		| `auto` or ` ` 	|

Leave the 'textColor' and 'BackgroundColor' fields empty (or enter 'auto') so that the color is automatically assigned according to the line.

## Developing

1. Fork and clone the repository.
2. Open the folder and run `npm run-script build` when it's ready.
3. The compiled `.js` file will be accessible at dist folder
4. On a running Home Assistant installation copy the compiled file to /www/community/XXXXX/
5. Add the ressouces to Home Assistant Lovelace
