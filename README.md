[![HACS: Custom](https://img.shields.io/badge/HACS-Custom-orange?style=for-the-badge)](https://github.com/custom-components/hacs) [![License: MIT](https://img.shields.io/github/license/MathisAlepis/lovelace-tam-card?style=for-the-badge)](https://opensource.org/licenses/MIT) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/MathisAlepis/lovelace-tam-card?style=for-the-badge) ![Maintenance](https://img.shields.io/maintenance/yes/2022?style=for-the-badge)

# TAM Card

Montpellier Lovelace TAM card displays next two crossing times of the tramway or bus in Montpellier, France.

This is build with the [unofficial API](https://github.com/MathisAlepis/montpellier-tam-api-time). The API get's [csv files](https://data.montpellier3m.fr/dataset/offre-de-transport-tam-en-temps-reel) from official TAM services of city of Montpellier and "lovelace tam card" display's this data.


![Screenshot](/screenshot.png?raw=true 'Example Card')

## Options

| Name      | Type    | Requirement  | Description        | Default           |
| --------- | ------- | ------------ | ------------------ | ----------------- |
| type      | string  | **Required** | `custom:tam-card`  | `custom:tam-card` |
| stop      | string  | **Required** | Arrêt              | `PABLO PICASSO`   |
| direction | string  | **Required** | Direction          | `LATTES CENTRE`   |

## Developing with Rollup

1. Fork and clone the repository.
2. Open the folder and run `npm build` when it's ready.
3. The compiled `.js` file will be accessible at dist folder
4. On a running Home Assistant installation copy the compiled file to /www/community/XXXXX/
5. Add the ressouces to Home Assistant Lovelace
