# TAM Card

La carte TAM Montpellier affiche les horaires des prochains TRAM / Bus d'un arrêt défini.

![Screenshot](/screenshot.png?raw=true 'Example Card')

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)


![Project Maintenance][maintenance-shield]
[![GitHub Activity][commits-shield]][commits]

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
