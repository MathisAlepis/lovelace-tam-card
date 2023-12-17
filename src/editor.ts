import { LitElement, html, property, TemplateResult, CSSResult, css } from 'lit-element';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { TamCardConfig } from './types';

export class TamCardEditor extends LitElement implements LovelaceCardEditor {
	@property() public hass?: HomeAssistant;
	@property() private _config?: TamCardConfig;
	@property() private allCourses = {};

	public setConfig(config: TamCardConfig): void {
		this._config = config;
		this.fetchDataApi();
	}

	get _stop(): string {
		if (this._config) {
			return this._config.stop || '';
		}

		return '';
	}

	get _direction(): string {
		if (this._config) {
			return this._config.direction || '';
		}

		return '';
	}

	get _backgroundColor(): string {
		if (this._config) {
			return this._config.backgroundColor || '';
		}

		return '';
	}

	get _textColor(): string {
		if (this._config) {
			return this._config.textColor || '';
		}

		return '';
	}

	protected parseCSV(str, delimiter = ';'): string[][] {
		const headers = str
			.slice(0, str.indexOf('\n'))
			.trim()
			.split(delimiter);
		const rows = str
			.slice(str.indexOf('\n') + 1)
			.trim()
			.split(/\r\n|\n|\r/);

		const arr = rows.map(function(row) {
			const values = row.split(delimiter);
			const el = headers.reduce(function(object, header, index) {
				object[header] = values[index];
				return object;
			}, {});
			return el;
		});
		const allCourses = arr.map(o => ({
			stop_name: o.stop_name,
			trip_headsign: o.trip_headsign,
			direction_id: o.direction_id,
		}));
		for (let index = 0; index < allCourses.length; index++) {
			if (allCourses[index].trip_headsign === 'GARCIA LORCA') {
				if (allCourses[index].direction_id === '1') {
					allCourses[index].trip_headsign = 'GARCIA LORCA SENS A';
				} else {
					allCourses[index].trip_headsign = 'GARCIA LORCA SENS B';
				}
			}
			delete allCourses[index].direction_id;
		}
		return allCourses;
	}

	protected async fetchDataApi(): Promise<void> {
		const res = {};
		const tamCSV = await (
			await fetch(
				'https://cors-proxy-tam.herokuapp.com/http://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_TpsReel.csv',
				{
					mode: 'cors',
					headers: {
						'Access-Control-Allow-Origin': '*',
					},
				},
			)
		).text();

		const records = this.parseCSV(tamCSV);
		const result: Array<any> = records.filter(
			(v, i, a) => a.findIndex(v2 => ['stop_name', 'trip_headsign'].every(k => v2[k] === v[k])) === i,
		);

		result.map(o => {
			const tab = [];
			const item = result.filter(item => item.stop_name === o.stop_name);
			item.map((j: { trip_headsign: never }) => tab.push(j.trip_headsign));
			const uniq = [...new Set(tab)];
			res[o.stop_name.toString()] = uniq;
		});

		this.allCourses = res;
		this.render();
	}

	protected render(): TemplateResult | void {
		if (!this.hass || !this._config) {
			return html`
				<div class="card-config">
					<div class="description">
						<p>Veuillez patienter le temps de charger les arrêts / directions disponibles.</p>
					</div>
				</div>
			`;
		}

		const allStop = Object.keys(this.allCourses);

		allStop.sort();

		let direction;
		if (this._config.stop) direction = this.allCourses[this._config.stop];

		return html`
			<div class="card-config">
				<div class="description">
					<p>
						Si votre arrêt / direction n'est pas disponible après le chargement, réessayer ultérieurement de
						préférence entre lundi et vendredi aux alentour de 12h.
					</p>
				</div>
				<div class="option1">
					<div class="values">
						<ha-textfield
							label="Couleur du fond"
							@input=${this._valueChanged}
							.configValue=${'backgroundColor'}
							.value=${this._backgroundColor}
							@closed=${(ev): void => ev.stopPropagation()}
						>
						</ha-textfield>
					</div>
					<div class="values">
						<ha-textfield
							label="Couleur du texte"
							@input=${this._valueChanged}
							.configValue=${'textColor'}
							.value=${this._textColor}
							@closed=${(ev): void => ev.stopPropagation()}
						>
						</ha-textfield>
					</div>
				</div>
				<div class="option2">
					<div class="values">
						<ha-select
							label="Arrêt"
							@selected=${this._valueChanged}
							.configValue=${'stop'}
							.value=${this._stop}
							@closed=${(ev): void => ev.stopPropagation()}
						>
							${allStop.map(val => {
								return html`
									<mwc-list-item .value="${val}">${val}</mwc-list-item>
								`;
							})}
						</ha-select>
					</div>
					${this._config.stop
						? html`
								<div class="values">
									<ha-select
										label="Direction"
										@selected=${this._valueChanged}
										.configValue=${'direction'}
										.value=${this._direction}
										@closed=${(ev): void => ev.stopPropagation()}
									>
										${direction.map(val => {
											return html`
												<mwc-list-item .value="${val}">${val}</mwc-list-item>
											`;
										})}
									</ha-select>
								</div>
						  `
						: html``}
				</div>
			</div>
		`;
	}

	private _valueChanged(ev): void {
		if (!this._config || !this.hass) {
			return;
		}
		const target = ev.target;
		if (this[`_${target.configValue}`] === target.value) {
			return;
		}
		if (target.configValue == 'stop') this._config['direction'] = '';
		if (target.configValue) {
			if (target.value === '') {
				delete this._config[target.configValue];
			} else {
				this._config = {
					...this._config,
					[target.configValue]: target.checked !== undefined ? target.checked : target.value,
				};
			}
		}
		fireEvent(this, 'config-changed', { config: this._config });
	}

	static get styles(): CSSResult {
		return css`
			.card-config {
				width: 95%;
				height: 100%;
				margin: auto;
			}
			.option1 {
				display: flex;
				margin: auto;
				height: auto;
			}
			.option2 {
				display: flex;
				margin: auto;
				height: 71vh;
			}
			.description {
				padding: 1em;
				margin: auto;
				max-width: 40em;
				font-size: 1em;
			}
			ha-select,
			ha-textfield {
				padding: 1em;
				width: 16em;
			}
			:host {
				--mdc-menu-max-height: 65vh;
			}
		`;
	}
}
customElements.define('tam-card-editor', TamCardEditor);
