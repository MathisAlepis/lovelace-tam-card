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

	protected async fetchDataApi(): Promise<void> {
		const res = {};
		const tamCSV = await (await fetch('https://montpellier-tam-api-time.vercel.app/api/')).json();

		tamCSV.result.map(o => {
			const tab = [];
			const item = tamCSV.result.filter(item => item.stop_name === o.stop_name);
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
				<div class="option">
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
			.option {
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
			ha-select {
				padding: 1em;
			}
			:host {
				--mdc-menu-max-height: 65vh;
			}
		`;
	}
}
customElements.define('tam-card-editor', TamCardEditor);
