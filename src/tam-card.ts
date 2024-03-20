import { LitElement, html, property, CSSResult, TemplateResult, css } from 'lit-element';
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import './editor';

import { getData } from './utils';
import { TamCardConfig } from './types';
import { CARD_VERSION } from './const';

import { color } from './color';
import { icon } from './icon';

import { localize } from './localize/localize';
import validateColor from 'validate-color';
import moment from 'moment-timezone';
/* eslint no-console: 0 */
console.info(
	`%c	TAM-CARD \n%c	${localize('common.version')} ${CARD_VERSION}	`,
	'color: orange; font-weight: bold; background: black',
	'color: white; font-weight: bold; background: dimgray',
);

export class TamCard extends LitElement {
	public static async getConfigElement(): Promise<LovelaceCardEditor> {
		return document.createElement('tam-card-editor') as LovelaceCardEditor;
	}

	public static getStubConfig(): object {
		return {};
	}

	@property() public hass?: HomeAssistant;
	@property() private _config?: TamCardConfig;
	@property() private waitFetch = false;
	@property() private fetchedData = {};

	public async setConfig(config: TamCardConfig): Promise<void> {
		if (!config) {
			throw new Error(localize('common.invalid_configuration'));
		}
		if (!config.stop || config.stop.length === 0 || !config.direction || config.direction.length === 0) {
			return;
		}

		this._config = {
			...config,
		};
	}
	protected timeConvert(n, nb): string {
		const num = n;
		const hours = num / 60;
		const rhours = Math.floor(hours);
		const minutes = (hours - rhours) * 60;
		const rminutes = Math.round(minutes);
		if (rhours != 0) return rhours + ' h ' + rminutes + ' min';
		else if (nb === 1) return rminutes + ' minutes';
		else return rminutes + ' min';
	}

	protected sleep(ms): unknown {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	protected checkBackgroundColor(number): string {
		if (this._config?.backgroundColor) {
			if (this._config?.backgroundColor !== 'auto')
				return validateColor(this._config?.backgroundColor) ? this._config?.backgroundColor : color[number];
		}
		return color[number];
	}

	protected checkTextColor(defaultColor): string {
		if (this._config?.textColor) {
			if (this._config?.textColor !== 'auto')
				return validateColor(this._config?.textColor) ? this._config?.textColor : defaultColor;
		}
		return defaultColor;
	}

	protected parseCourseTam(result, query): object {
		const res = {};
		const time: string[] = [];
		const now = moment(new Date()).tz('Europe/Paris');

		if (result.length === 0) {
			res['time'] = ['Fin de service'];
			res['stop'] = query.stop_name;
			res['direction'] = query.trip_headsign;
			res['icon'] = icon[0];
			res['backgroundColor'] = this.checkBackgroundColor(0);
			res['textColor'] = this.checkTextColor('black');
		} else {
			for (const course of result) {
				const fullDateOfTimeCourse = moment(new Date()).tz('Europe/Paris');
				const [hours, minutes, seconds] = course.departure_time.split(':');
				if (hours >= '00' && hours <= '03' && (now.hour() == 22 || now.hour() == 23))
					fullDateOfTimeCourse.add(1, 'days');
				fullDateOfTimeCourse.set({ hour: hours, minute: minutes, second: seconds });
				if (fullDateOfTimeCourse > now) {
					const min = fullDateOfTimeCourse.diff(now, 'minutes');
					time.push(min.toString());
				}
			}
			if (time.length === 0) {
				time.push('Indisponible');
				res['time'] = time;
			} else {
				const sortedTime = time.sort(function(a: any, b: any) {
					return a - b;
				});
				for (let i = 0; i < sortedTime.length; i++) {
					if (parseInt(sortedTime[i]) < 2) {
						sortedTime[i] = 'Proche !!';
					}
				}
				res['time'] = [...new Set(sortedTime)];
			}
			res['stop'] = result[0].stop_name;
			res['direction'] = result[0].trip_headsign;
			res['icon'] = icon[result[0].route_short_name];
			res['backgroundColor'] = this.checkBackgroundColor(result[0].route_short_name);
			res['textColor'] = this.checkTextColor('black');
		}
		return res;
	}

	protected async fetchDataApi(): Promise<void> {
		const filters = { stop_name: this._config?.stop, trip_headsign: this._config?.direction };
		const resultToParse = await getData(this._config?.stop, this._config?.direction);
		this.fetchedData = { result: this.parseCourseTam(resultToParse, filters) };
	}

	protected async waitFetchApi(): Promise<void> {
		if (this.waitFetch === false) {
			this.waitFetch = true;
			this.fetchDataApi();
			await this.sleep(20000);
			this.waitFetch = false;
		}
	}

	protected render(): TemplateResult | void {
		if (!this._config || !this.hass) {
			return html`
				Prévisualisation: Veuillez sélectionner un arrêt et une direction
			`;
		}

		this.waitFetchApi();

		if (!this.fetchedData) {
			return html`
				<p class="dot-loading">
					Chargement&nbsp<span>.</span><span>.</span><span>.</span><span>.</span><span>.</span>
				</p>
			`;
		} else {
			const proche = this.fetchedData['result']?.time[0] == 'Proche !!';
			const noConversion =
				this.fetchedData['result']?.time[0] == 'Proche !!' ||
				this.fetchedData['result']?.time[0] == 'Indisponible' ||
				this.fetchedData['result']?.time[0] == 'Fin de service';

			if (this.fetchedData['result']?.time.length > 1) {
				return html`
					<ha-card tabindex="0" aria-label="TAM">
						<div
							id="states"
							style="background-color: ${this.fetchedData['result']?.backgroundColor}; color: ${this
								.fetchedData['result']?.textColor}"
							class="${proche ? 'card-content clignote' : 'card-content'}"
						>
							<div class="flex">
								<div class="badge">
									<ha-icon icon="${this.fetchedData['result']?.icon || 'mdi:tram'}"></ha-icon>
								</div>
								<div class="text cap info flexAlign">
									<div>${this.fetchedData['result']?.stop.toLowerCase()}</div>
									&nbsp&nbsp
									<div class="">➜</div>
									&nbsp&nbsp
									<div>${this.fetchedData['result']?.direction.toLowerCase()}</div>
								</div>

								<div class="text right flexAlign">
									<div>
										${noConversion
											? this.fetchedData['result']?.time[0]
											: this.timeConvert(this.fetchedData['result']?.time[0], 2)}
									</div>
									&nbsp&nbsp&nbsp
									<div class="bold">|</div>
									&nbsp&nbsp&nbsp
									<div>
										${this.timeConvert(this.fetchedData['result']?.time[1], 2)}
									</div>
								</div>
							</div>
						</div>
					</ha-card>
				`;
			} else {
				return html`
					<ha-card tabindex="0" aria-label="TAM">
						<div
							id="states"
							style="background-color: ${this.fetchedData['result']?.backgroundColor}; color: ${this
								.fetchedData['result']?.textColor}"
							class="${proche ? 'card-content clignote' : 'card-content'}"
						>
							<div class="flex">
								<div class="badge">
									<ha-icon icon="${this.fetchedData['result']?.icon || 'mdi:tram'}"></ha-icon>
								</div>
								<div class="text cap info flexAlign">
									<div class="">
										${this.fetchedData['result']?.stop.toLowerCase()}
									</div>
									&nbsp&nbsp
									<div class="">➜</div>
									&nbsp&nbsp
									<div class="text">
										${this.fetchedData['result']?.direction.toLowerCase()}
									</div>
								</div>
								<div class="text right flexAlign">
									<div class="">
										${noConversion
											? this.fetchedData['result']?.time
											: this.timeConvert(this.fetchedData['result']?.time[0], 1)}
									</div>
								</div>
							</div>
						</div>
					</ha-card>
				`;
			}
		}
	}

	static get styles(): CSSResult {
		return css`
			.flex {
				display: flex;
				justify-content: space-between;
				align-items: center;
				min-width: 0px;
				flex: 1 1 0%;
			}
			.card-content {
				border-radius: 0.3em;
			}
			.flexAlign {
				display: flex;
			}
			.info {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				flex: 1 0 60px;
				margin-left: 1em;
			}
			.right {
				text-align: right;
			}
			.cap {
				text-transform: capitalize;
			}
			.bold {
				font-weight: 700;
				font-size: 2em;
				margin-top: -0.1em;
			}
			.text {
				font-size: 1em;
			}
			.ha-icon {
				width: 10px;
				height: 10px;
			}
			.clignote {
				animation-duration: 2.5s;
				animation-name: clignoter;
				animation-iteration-count: infinite;
				transition: none;
			}
			@keyframes clignoter {
				0% {
					opacity: 1;
				}
				50% {
					opacity: 0.2;
				}
				100% {
					opacity: 1;
				}
			}
			.dot-loading {
				font-size: 1.6em;
			}

			.dot-loading span {
				font-size: 1.9em;
				animation-name: blink;
				animation-duration: 1.4s;
				animation-iteration-count: infinite;
				animation-fill-mode: both;
			}

			.dot-loading span:nth-child(2) {
				animation-delay: 0.2s;
			}

			.dot-loading span:nth-child(3) {
				animation-delay: 0.4s;
			}
			.dot-loading span:nth-child(4) {
				animation-delay: 0.6s;
			}
			.dot-loading span:nth-child(5) {
				animation-delay: 0.8s;
			}

			@keyframes blink {
				0% {
					opacity: 0.2;
				}
				20% {
					opacity: 1;
				}
				100% {
					opacity: 0.2;
				}
			}
		`;
	}
}

customElements.define('tam-card', TamCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
	type: 'tam-card',
	name: 'TAM Montpellier',
	preview: false,
	description: "La carte TAM Montpellier affiche les horaires des prochains TRAM / Bus d'un arrêt défini.",
});
