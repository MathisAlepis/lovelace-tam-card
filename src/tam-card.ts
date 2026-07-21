import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import './editor';
import { HeraultApiError, heraultDataClient } from './api';
import {
  isConfigComplete,
  LineInferenceError,
  needsLineInference,
  resolveConfigLine,
  TamConfigError,
  validateConfig,
} from './config';
import { CARD_TAG, CARD_VERSION, EDITOR_TAG } from './const';
import { RouteStyleController } from './data/route-style-controller';
import { getRoutePresentation, readableTextColor } from './data/route-styles';
import { type CacheLease, sharedTamCache } from './data/shared-cache';
import { TamDataController, type LiveTamDeparture } from './data/tam-data-controller';
import { localize } from './localize/localize';
import { cardStyles } from './styles';
import type { NormalizedTamCardConfig, TamCardConfig, TamJourney } from './types';

const DOCUMENTATION_URL = 'https://github.com/MathisAlepis/lovelace-tam-card';

interface HassThemeView {
  language?: string;
  themes?: { darkMode?: boolean; theme?: string };
}

interface DestinationDepartureGroup {
  readonly destination: string;
  readonly departures: readonly LiveTamDeparture[];
}

const sameText = (left: string, right: string): boolean =>
  left.localeCompare(right, 'fr', { sensitivity: 'base' }) === 0;

@customElement(CARD_TAG)
export class TamCard extends LitElement {
  @state() private config?: NormalizedTamCardConfig;
  @state() private configError?: Error;
  @state() private configIssues: string[] = [];
  @state() private resolvingLine = false;
  @state() private language = 'fr';

  private readonly data = new TamDataController(this, heraultDataClient);
  private readonly routeStyles = new RouteStyleController(this);
  private hassValue?: HomeAssistant;
  private themeSignature = '';
  private themePrimaryColor = '#03A9F4';
  private resolutionGeneration = 0;
  private lineResolutionLease?: CacheLease<TamJourney[]>;

  public static getConfigElement(): LovelaceCardEditor {
    return document.createElement(EDITOR_TAG) as LovelaceCardEditor;
  }

  /** Empty on purpose: the preview renders a local prompt and does not query live data. */
  public static getStubConfig(): Record<string, never> {
    return {};
  }

  public get hass(): HomeAssistant | undefined {
    return this.hassValue;
  }

  public set hass(value: HomeAssistant | undefined) {
    this.hassValue = value;
    const view = value as HassThemeView | undefined;
    const nextLanguage = view?.language ?? 'fr';
    const nextThemeSignature = JSON.stringify([view?.themes?.theme ?? '', view?.themes?.darkMode ?? false]);
    if (nextLanguage !== this.language) this.language = nextLanguage;
    if (nextThemeSignature !== this.themeSignature) {
      this.themeSignature = nextThemeSignature;
      queueMicrotask(() => this.updateThemeColor());
    }
  }

  public setConfig(input: TamCardConfig): void {
    const result = validateConfig(input);
    const fatal = result.errors.filter((issue) => issue.code === 'invalid-config' || issue.code === 'invalid-type');
    if (fatal.length) throw new TamConfigError(fatal.map((issue) => issue.message).join(' '), fatal);

    this.cancelLineResolution();
    this.config = result.config;
    this.configError = undefined;
    this.configIssues = result.errors.map((issue) => issue.code);
    this.resolvingLine = false;
    this.toggleAttribute('compact', result.config.compact);

    if (isConfigComplete(result.config)) {
      this.data.setConfig(result.config);
    } else {
      this.data.setConfig(null);
      if (needsLineInference(result.config) && this.isConnected) void this.resolveLegacyLine(result.config);
    }
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.updateThemeColor();
    if (this.config && needsLineInference(this.config)) void this.resolveLegacyLine(this.config);
  }

  public disconnectedCallback(): void {
    this.cancelLineResolution();
    super.disconnectedCallback();
  }

  public getCardSize(): number {
    return this.config?.display_mode === 'all_destinations'
      ? Math.max(3, 2 + this.groupDeparturesByDestination(this.data.state.departures).length)
      : 2;
  }

  public getGridOptions(): Record<string, number> {
    return { columns: 12, min_columns: this.config?.display_mode === 'all_destinations' ? 6 : 3 };
  }

  protected render(): TemplateResult {
    if (!this.config || !this.config.stop || (this.config.display_mode === 'destination' && !this.config.destination)) {
      return this.renderMessage(
        'mdi:tune-variant',
        localize('card.incomplete_title', this.language),
        this.incompleteConfigurationDetail(),
      );
    }

    if (this.resolvingLine) return this.renderLoading(localize('editor.loading_lines', this.language));
    if (this.configError) {
      return this.renderMessage(
        'mdi:alert-circle-outline',
        localize('card.configuration_error', this.language),
        this.configurationErrorDetail(this.configError),
      );
    }
    if (!this.config.line) {
      return this.renderMessage(
        'mdi:tune-variant',
        localize('card.incomplete_title', this.language),
        this.incompleteConfigurationDetail(),
      );
    }

    const state = this.data.state;
    if (state.status === 'idle' || (state.status === 'loading' && state.departures.length === 0)) {
      return this.renderLoading(localize('card.loading', this.language));
    }
    if (state.status === 'error') return this.renderDataError(state.error);
    if (state.status === 'empty' || state.departures.length === 0) {
      if (state.isStale) {
        return this.renderMessage(
          'mdi:clock-alert-outline',
          localize('card.stale', this.language),
          localize('card.stale_detail', this.language),
          true,
        );
      }
      return this.renderMessage(
        'mdi:clock-outline',
        localize('card.no_departures_title', this.language),
        localize('card.no_departures_detail', this.language),
        true,
      );
    }

    return this.renderDepartures(state.departures, state.isStale, state.isLoading);
  }

  private renderDepartures(departures: readonly LiveTamDeparture[], stale: boolean, loading: boolean): TemplateResult {
    return this.config?.display_mode === 'all_destinations'
      ? this.renderAllDestinations(departures, stale, loading)
      : this.renderDestinationDepartures(departures, stale, loading);
  }

  private renderDestinationDepartures(
    departures: readonly LiveTamDeparture[],
    stale: boolean,
    loading: boolean,
  ): TemplateResult {
    const config = this.config as NormalizedTamCardConfig & { line: string; destination: string };
    const route = getRoutePresentation(config.line, this.themePrimaryColor, this.routeStyles.styles);
    const background = config.background_color === 'auto' ? route.background : config.background_color;
    const text =
      config.text_color === 'auto'
        ? config.background_color === 'auto'
          ? route.text
          : readableTextColor(background)
        : config.text_color;
    const approaching = departures[0]?.isApproaching ?? false;
    const sourceLabel = this.departureSourceLabel(departures);
    const accessibilityStates = [
      sourceLabel,
      ...(stale ? [localize('card.stale', this.language)] : []),
      ...(approaching ? [localize('card.approaching', this.language)] : []),
    ].join('. ');
    const lineLabel = localize('card.line_label', this.language, { line: config.line });
    const departureSummary = departures.map((departure) => this.departureAccessibilityLabel(departure)).join(', ');
    const styles = {
      '--tam-background': background,
      '--tam-text': text,
      '--tam-badge-background': text,
      '--tam-badge-text': background,
    };

    return html`
      <ha-card
        class=${approaching ? 'approaching' : ''}
        style=${styleMap(styles)}
        tabindex="0"
        aria-label=${`${localize('card.label', this.language)}. ${lineLabel}. ${config.stop} → ${config.destination}. ${departureSummary}. ${accessibilityStates}`}
      >
        <div class="layout">
          <div class="identity" aria-label=${lineLabel}>
            <ha-icon class="mode-icon" .icon=${route.icon} aria-hidden="true"></ha-icon>
            ${config.show_line ? html`<span class="line-badge">${config.line}</span>` : nothing}
          </div>

          <div class="journey" title=${`${config.stop} → ${config.destination}`}>
            <span class="stop">${config.stop}</span>
            <span class="arrow" aria-hidden="true">→</span>
            <span class="destination">${config.destination}</span>
          </div>

          <div class="departures" aria-label=${localize('card.label', this.language)}>
            ${departures.map((departure) => this.renderDeparture(departure))}
          </div>
        </div>

        <div class="metadata" aria-hidden="true">
          ${approaching ? html`<span class="approaching-dot"></span>` : nothing}
          ${
            approaching
              ? html`<span class="status-badge approaching-badge">${localize('card.approaching', this.language)}</span>`
              : nothing
          }
          ${stale ? html`<span class="status-badge">${localize('card.stale', this.language)}</span>` : nothing}
          ${loading ? html`<span class="status-badge">↻</span>` : nothing}
          ${config.show_realtime_badge ? html`<span class="status-badge">${sourceLabel}</span>` : nothing}
        </div>
      </ha-card>
    `;
  }

  private renderAllDestinations(
    departures: readonly LiveTamDeparture[],
    stale: boolean,
    loading: boolean,
  ): TemplateResult {
    const config = this.config as NormalizedTamCardConfig & { line: string };
    const route = getRoutePresentation(config.line, this.themePrimaryColor, this.routeStyles.styles);
    const background = config.background_color === 'auto' ? route.background : config.background_color;
    const text =
      config.text_color === 'auto'
        ? config.background_color === 'auto'
          ? route.text
          : readableTextColor(background)
        : config.text_color;
    const approaching = departures.some((departure) => departure.isApproaching);
    const destinationGroups = this.groupDeparturesByDestination(departures);
    const sourceLabel = this.departureSourceLabel(departures);
    const lineLabel = localize('card.line_label', this.language, { line: config.line });
    const directionLabel =
      config.direction_id === undefined
        ? localize('card.all_directions', this.language)
        : localize('card.direction_label', this.language, { direction: config.direction_id });
    const countLabel = localize(
      destinationGroups.length === 1 ? 'card.destination_count_one' : 'card.destination_count',
      this.language,
      { count: destinationGroups.length },
    );
    const departureSummary = destinationGroups
      .map(
        (group) =>
          `${group.destination}, ${group.departures
            .map((departure) => this.departureAccessibilityLabel(departure))
            .join(', ')}`,
      )
      .join('. ');
    const accessibilityStates = [
      sourceLabel,
      ...(stale ? [localize('card.stale', this.language)] : []),
      ...(approaching ? [localize('card.approaching', this.language)] : []),
    ].join('. ');
    const styles = {
      '--tam-background': background,
      '--tam-text': text,
      '--tam-badge-background': text,
      '--tam-badge-text': background,
    };

    return html`
      <ha-card
        class=${approaching ? 'overview-card approaching' : 'overview-card'}
        style=${styleMap(styles)}
        tabindex="0"
        aria-label=${`${localize('card.label', this.language)}. ${lineLabel}. ${config.stop}. ${countLabel}. ${directionLabel}. ${departureSummary}. ${accessibilityStates}`}
      >
        <div class="overview-header">
          <div class="identity" aria-label=${lineLabel}>
            <ha-icon class="mode-icon" .icon=${route.icon} aria-hidden="true"></ha-icon>
            ${config.show_line ? html`<span class="line-badge">${config.line}</span>` : nothing}
          </div>
          <div class="overview-heading">
            <span class="stop">${config.stop}</span>
            <span class="overview-summary">
              ${localize('card.all_destinations', this.language)} · ${directionLabel}
            </span>
          </div>
        </div>

        <ul class="destination-list" role="list">
          ${destinationGroups.map((group) => this.renderDestinationRow(group))}
        </ul>

        <div class="metadata" aria-hidden="true">
          ${approaching ? html`<span class="approaching-dot"></span>` : nothing}
          ${
            approaching
              ? html`<span class="status-badge approaching-badge">${localize('card.approaching', this.language)}</span>`
              : nothing
          }
          ${stale ? html`<span class="status-badge">${localize('card.stale', this.language)}</span>` : nothing}
          ${loading ? html`<span class="status-badge">↻</span>` : nothing}
          ${config.show_realtime_badge ? html`<span class="status-badge">${sourceLabel}</span>` : nothing}
        </div>
      </ha-card>
    `;
  }

  private renderDestinationRow(group: DestinationDepartureGroup): TemplateResult {
    const approaching = group.departures.some((departure) => departure.isApproaching);
    return html`
      <li class=${approaching ? 'destination-row has-approaching' : 'destination-row'}>
        <span class="destination-name" title=${group.destination}>
          <span class="arrow" aria-hidden="true">→</span>
          <span>${group.destination}</span>
        </span>
        <span class="destination-times">
          ${group.departures.map((departure) => this.renderDestinationTime(departure))}
        </span>
      </li>
    `;
  }

  private renderDestinationTime(departure: LiveTamDeparture): TemplateResult {
    return html`
      <span class=${departure.isApproaching ? 'destination-time approaching-departure' : 'destination-time'}>
        <span class="time">${this.departureTimeLabel(departure)}</span>
        ${
          this.config?.show_absolute_time && departure.departure_time
            ? html`<span class="absolute">${this.formatAbsoluteTime(departure.departure_time)}</span>`
            : nothing
        }
      </span>
    `;
  }

  private groupDeparturesByDestination(departures: readonly LiveTamDeparture[]): DestinationDepartureGroup[] {
    const groups = new Map<string, { destination: string; departures: LiveTamDeparture[] }>();
    for (const departure of departures) {
      const key = departure.trip_headsign.normalize('NFKC').toLocaleUpperCase('fr-FR');
      const group = groups.get(key);
      if (group) group.departures.push(departure);
      else groups.set(key, { destination: departure.trip_headsign, departures: [departure] });
    }
    return [...groups.values()];
  }

  private renderDeparture(departure: LiveTamDeparture): TemplateResult {
    const label = this.departureTimeLabel(departure);
    return html`
      <div class=${departure.isApproaching ? 'departure approaching-departure' : 'departure'}>
        <span class="time">${label}</span>
        ${
          this.config?.show_absolute_time && departure.departure_time
            ? html`<span class="absolute">${this.formatAbsoluteTime(departure.departure_time)}</span>`
            : nothing
        }
      </div>
    `;
  }

  private departureTimeLabel(departure: LiveTamDeparture): string {
    return departure.isApproaching
      ? localize('card.approaching', this.language)
      : this.formatRemainingTime(departure.remainingMinutes);
  }

  private departureAccessibilityLabel(departure: LiveTamDeparture): string {
    const relative = this.departureTimeLabel(departure);
    if (!this.config?.show_absolute_time || !departure.departure_time) return relative;
    return `${relative}, ${this.formatAbsoluteTime(departure.departure_time)}`;
  }

  private renderLoading(label: string): TemplateResult {
    return html`
      <ha-card aria-label=${label} aria-busy="true">
        <div class="message-layout">
          <ha-icon icon="mdi:tram" aria-hidden="true"></ha-icon>
          <div>
            <span class="skeleton"></span>
            <span class="skeleton"></span>
          </div>
        </div>
      </ha-card>
    `;
  }

  private renderDataError(error: unknown): TemplateResult {
    let detail = localize('card.api_unavailable', this.language);
    let icon = 'mdi:cloud-alert-outline';
    if (error instanceof HeraultApiError) {
      if (error.code === 'rate-limit') detail = localize('card.rate_limited', this.language);
      if (error.code === 'offline') {
        detail = localize('card.offline', this.language);
        icon = 'mdi:wifi-off';
      }
    }
    return this.renderMessage(icon, localize('card.error_title', this.language), detail, true, true);
  }

  private renderMessage(
    icon: string,
    title: string,
    detail: string,
    useRouteColor = false,
    retry = false,
  ): TemplateResult {
    const route = this.config?.line
      ? getRoutePresentation(this.config.line, this.themePrimaryColor, this.routeStyles.styles)
      : undefined;
    const styles = useRouteColor && route ? { '--tam-background': route.background, '--tam-text': route.text } : {};
    return html`
      <ha-card style=${styleMap(styles)} tabindex="0" aria-label=${`${title}. ${detail}`}>
        <div class="message-layout">
          <ha-icon .icon=${icon} aria-hidden="true"></ha-icon>
          <div>
            <div class="message-title">${title}</div>
            <div class="message-detail">${detail}</div>
            ${
              retry
                ? html`<button class="retry" type="button" @click=${this.retry}>
                    ${localize('common.retry', this.language)}
                  </button>`
                : nothing
            }
          </div>
        </div>
      </ha-card>
    `;
  }

  private readonly retry = (): void => {
    void this.data.refresh({ force: true });
  };

  private departureSourceLabel(departures: readonly LiveTamDeparture[]): string {
    const theoretical = departures.filter((departure) => departure.is_theorical).length;
    if (theoretical === 0) return localize('card.realtime', this.language);
    if (theoretical === departures.length) return localize('card.theoretical', this.language);
    return localize('card.mixed', this.language);
  }

  private configurationErrorDetail(error: Error): string {
    if (error instanceof LineInferenceError) {
      return localize(error.code === 'ambiguous-line' ? 'card.ambiguous_line' : 'card.line_not_found', this.language, {
        lines: error.candidates.join(', '),
      });
    }
    if (error instanceof HeraultApiError) return localize('editor.catalog_error', this.language);
    return error.message;
  }

  private incompleteConfigurationDetail(): string {
    const labels = this.configIssues.map((issue) =>
      issue === 'missing-stop'
        ? localize('card.missing_stop', this.language)
        : issue === 'missing-line'
          ? localize('card.missing_line', this.language)
          : issue === 'missing-destination'
            ? localize('card.missing_destination', this.language)
            : localize('card.incomplete_detail', this.language),
    );
    return [...new Set(labels)].join(' ') || localize('card.incomplete_detail', this.language);
  }

  private formatRemainingTime(minutes: number): string {
    if (minutes <= 0) return localize('card.now', this.language);
    if (minutes < 60) return `${minutes} ${localize('common.minutes', this.language)}`;
    const hours = Math.floor(minutes / 60);
    return localize('common.hour_minutes', this.language, { hours, minutes: minutes % 60 });
  }

  private formatAbsoluteTime(value: string): string {
    const match = /^(\d{1,2}):(\d{2})/.exec(value.trim());
    return match ? `${match[1].padStart(2, '0')}:${match[2]}` : value;
  }

  private async resolveLegacyLine(config: NormalizedTamCardConfig): Promise<void> {
    if (!config.stop || !config.destination || config.line) return;
    this.cancelLineResolution();
    const generation = this.resolutionGeneration;
    this.resolvingLine = true;
    this.configError = undefined;
    this.requestUpdate();

    const lease = sharedTamCache.acquireCatalog<TamJourney[]>('journeys', [config.stop], (signal) =>
      heraultDataClient.listJourneysForStop(config.stop, { signal }),
    );
    this.lineResolutionLease = lease;
    try {
      const snapshot = await lease.promise;
      const candidates = snapshot.value.filter(
        (journey) =>
          sameText(journey.destination, config.destination ?? '') &&
          (config.direction_id === undefined || journey.direction_id === config.direction_id),
      );
      if (generation !== this.resolutionGeneration || !this.isConnected) return;
      const resolved = resolveConfigLine(
        config,
        candidates.map((journey) => journey.line),
      );
      const selected = candidates.find((journey) => sameText(journey.line, resolved.line ?? ''));
      this.config = {
        ...resolved,
        ...(selected ? { destination: selected.destination } : {}),
        ...(config.direction_id === undefined || selected?.direction_id === undefined
          ? {}
          : { direction_id: selected.direction_id }),
      };
      this.configIssues = [];
      this.data.setConfig(this.config);
    } catch (error) {
      if (generation !== this.resolutionGeneration || !this.isConnected) return;
      this.data.setConfig(null);
      this.configError = error instanceof Error ? error : new LineInferenceError('line-not-found', String(error), []);
    } finally {
      lease.release();
      if (this.lineResolutionLease === lease) this.lineResolutionLease = undefined;
      if (generation === this.resolutionGeneration) {
        this.resolvingLine = false;
        this.requestUpdate();
      }
    }
  }

  private cancelLineResolution(): void {
    this.resolutionGeneration += 1;
    this.lineResolutionLease?.release();
    this.lineResolutionLease = undefined;
  }

  private updateThemeColor(): void {
    if (!this.isConnected || typeof getComputedStyle !== 'function') return;
    const color = getComputedStyle(this).getPropertyValue('--primary-color').trim();
    if (color && color !== this.themePrimaryColor) {
      this.themePrimaryColor = color;
      this.requestUpdate();
    }
  }

  static styles = cardStyles;
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: 'TAM Card',
    description: 'Prochains passages TaM à Montpellier via Hérault Data',
    documentationURL: DOCUMENTATION_URL,
    preview: true,
  });
}

console.info(
  `%c TAM Card %c v${CARD_VERSION} `,
  'color:#fff;background:#005ca9;font-weight:700;border-radius:3px 0 0 3px;padding:2px 5px',
  'color:#005ca9;background:#eef6fb;border-radius:0 3px 3px 0;padding:2px 5px',
);
