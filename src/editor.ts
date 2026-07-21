import type { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { heraultDataClient } from './api';
import { normalizeConfig } from './config';
import { CARD_TYPE, EDITOR_TAG } from './const';
import { sharedTamCache } from './data/shared-cache';
import { localize } from './localize/localize';
import { editorStyles } from './styles';
import type { DirectionId, TamCardConfig, TamDestination, TamJourney } from './types';

type EditableConfig = Omit<Partial<TamCardConfig>, 'type'> & { type: typeof CARD_TYPE };
type CatalogLoading = 'stops' | 'lines' | 'destinations';
type SelectorEvent = CustomEvent<{ value: unknown }>;

const textValue = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const sameText = (left: string, right: string): boolean =>
  left.localeCompare(right, 'fr', { sensitivity: 'base' }) === 0;

function canonicalEditorConfig(config: Partial<TamCardConfig>): EditableConfig {
  return { ...normalizeConfig(config), type: CARD_TYPE };
}

@customElement(EDITOR_TAG)
export class TamCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: EditableConfig;
  @state() private stops: string[] = [];
  @state() private lines: string[] = [];
  @state() private destinations: TamDestination[] = [];
  @state() private loading?: CatalogLoading;
  @state() private catalogError?: string;
  @state() private manual = false;

  private generation = 0;

  public setConfig(config: TamCardConfig): void {
    this.config = canonicalEditorConfig(config);
    const generation = ++this.generation;
    void this.loadInitialCatalog(generation);
  }

  protected render(): TemplateResult {
    if (!this.config) return html`<p>${localize('card.loading', this.language)}</p>`;

    return html`
      <div class="editor">
        <section class="section" aria-labelledby="tam-editor-data">
          <h3 id="tam-editor-data">${localize('editor.data', this.language)}</h3>
          ${this.renderCatalogFeedback()}
          <div class="actions">
            <button type="button" @click=${this.toggleManual}>
              ${localize(this.manual ? 'editor.catalog_mode' : 'editor.manual_mode', this.language)}
            </button>
            ${
              this.catalogError
                ? html`<button type="button" @click=${this.retryCatalog}>
                    ${localize('common.retry', this.language)}
                  </button>`
                : nothing
            }
          </div>
          ${this.manual ? this.renderManualJourney() : this.renderCatalogJourney()}
        </section>

        <section class="section" aria-labelledby="tam-editor-display">
          <h3 id="tam-editor-display">${localize('editor.display', this.language)}</h3>
          ${this.selector(
            localize('editor.departures', this.language),
            { number: { min: 1, max: 5, step: 1, mode: 'box' } },
            this.config.departures ?? 2,
            (event) => this.changeNumber('departures', event, 1, 5),
          )}
          ${this.selector(
            localize('editor.refresh_interval', this.language),
            { number: { min: 30, max: 300, step: 30, mode: 'box', unit_of_measurement: 's' } },
            this.config.refresh_interval ?? 60,
            (event) => this.changeNumber('refresh_interval', event, 30, 300),
          )}
          ${this.booleanSelector('show_line')}${this.booleanSelector('show_realtime_badge')}
          ${this.booleanSelector('show_absolute_time')}${this.booleanSelector('compact')}
        </section>

        <section class="section" aria-labelledby="tam-editor-colors">
          <h3 id="tam-editor-colors">${localize('editor.colors', this.language)}</h3>
          ${this.selector(
            localize('editor.background_color', this.language),
            { text: { type: 'text' } },
            this.config.background_color ?? 'auto',
            (event) => this.changeText('background_color', event),
          )}
          ${this.selector(
            localize('editor.text_color', this.language),
            { text: { type: 'text' } },
            this.config.text_color ?? 'auto',
            (event) => this.changeText('text_color', event),
          )}
          <p class="hint">${localize('editor.auto', this.language)} : <code>auto</code></p>
        </section>
      </div>
    `;
  }

  private get language(): string | undefined {
    return this.hass?.language;
  }

  private renderCatalogFeedback(): TemplateResult | typeof nothing {
    if (this.loading) {
      const key =
        this.loading === 'stops'
          ? 'editor.loading_stops'
          : this.loading === 'lines'
            ? 'editor.loading_lines'
            : 'editor.loading_destinations';
      return html`<p class="hint" role="status">${localize(key, this.language)}</p>`;
    }
    if (this.catalogError) return html`<p class="error" role="alert">${this.catalogError}</p>`;
    return nothing;
  }

  private renderCatalogJourney(): TemplateResult {
    if (!this.stops.length && !this.loading) return this.renderManualJourney();

    const destinationValue = this.selectedDestinationKey();
    return html`
      ${this.selector(
        localize('editor.stop', this.language),
        { select: { options: this.stops, custom_value: true, mode: 'dropdown' } },
        this.config?.stop ?? '',
        this.changeStop,
      )}
      ${
        this.config?.stop
          ? this.selector(
              localize('editor.line', this.language),
              { select: { options: this.lines.map((line) => ({ value: line, label: line })), mode: 'dropdown' } },
              this.config.line ?? '',
              this.changeLine,
            )
          : html`<p class="hint">${localize('editor.select_stop_first', this.language)}</p>`
      }
      ${
        this.config?.stop && this.config.line
          ? this.selector(
              localize('editor.destination', this.language),
              {
                select: {
                  options: this.destinationOptions(),
                  mode: 'dropdown',
                },
              },
              destinationValue,
              this.changeDestination,
            )
          : html`<p class="hint">${localize('editor.select_line_first', this.language)}</p>`
      }
    `;
  }

  private renderManualJourney(): TemplateResult {
    return html`
      <p class="hint">${localize('editor.manual_hint', this.language)}</p>
      ${this.selector(
        localize('editor.stop', this.language),
        { text: { type: 'text' } },
        this.config?.stop ?? '',
        (event) => this.changeText('stop', event, ['line', 'destination', 'direction_id']),
      )}
      ${this.selector(
        localize('editor.line', this.language),
        { text: { type: 'text' } },
        this.config?.line ?? '',
        (event) => this.changeText('line', event, ['destination', 'direction_id']),
      )}
      ${this.selector(
        localize('editor.destination', this.language),
        { text: { type: 'text' } },
        this.config?.destination ?? '',
        (event) => this.changeText('destination', event),
      )}
      ${this.selector(
        localize('editor.direction_id', this.language),
        {
          select: {
            options: [
              { value: 'auto', label: localize('editor.direction_auto', this.language) },
              { value: '0', label: localize('editor.direction_0', this.language) },
              { value: '1', label: localize('editor.direction_1', this.language) },
            ],
            mode: 'dropdown',
          },
        },
        this.config?.direction_id === undefined ? 'auto' : String(this.config.direction_id),
        this.changeDirection,
      )}
    `;
  }

  private selector(
    label: string,
    selector: Record<string, unknown>,
    value: unknown,
    onChange: (event: SelectorEvent) => void,
  ): TemplateResult {
    return html`
      <ha-selector
        .hass=${this.hass}
        .selector=${selector}
        .value=${value}
        .label=${label}
        @value-changed=${onChange}
      ></ha-selector>
    `;
  }

  private booleanSelector(key: 'show_line' | 'show_realtime_badge' | 'show_absolute_time' | 'compact'): TemplateResult {
    return this.selector(
      localize(`editor.${key}`, this.language),
      { boolean: {} },
      this.config?.[key] ?? false,
      (event) => {
        if (!this.config) return;
        this.config = { ...this.config, [key]: Boolean(event.detail.value) };
        this.emitConfig();
      },
    );
  }

  private readonly changeStop = (event: SelectorEvent): void => {
    if (!this.config) return;
    const generation = ++this.generation;
    const stop = textValue(event.detail.value);
    this.config = { ...this.config, stop };
    delete this.config.line;
    delete this.config.destination;
    delete this.config.direction_id;
    this.lines = [];
    this.destinations = [];
    this.emitConfig();
    if (stop) void this.loadLines(stop, generation);
    else this.loading = undefined;
  };

  private readonly changeLine = (event: SelectorEvent): void => {
    if (!this.config) return;
    const generation = ++this.generation;
    const line = textValue(event.detail.value);
    this.config = { ...this.config, ...(line ? { line } : {}) };
    if (!line) delete this.config.line;
    delete this.config.destination;
    delete this.config.direction_id;
    this.destinations = [];
    this.emitConfig();
    if (this.config.stop && line) void this.loadDestinations(this.config.stop, line, generation);
    else this.loading = undefined;
  };

  private readonly changeDestination = (event: SelectorEvent): void => {
    if (!this.config) return;
    const key = textValue(event.detail.value);
    const known = this.destinations.find(
      (destination) => this.destinationKey(destination.destination, destination.direction_id) === key,
    );
    if (known) {
      this.config = { ...this.config, destination: known.destination };
      if (known.direction_id === undefined) delete this.config.direction_id;
      else this.config.direction_id = known.direction_id;
    } else {
      const [destination, rawDirection] = key.split('\u0000');
      this.config = { ...this.config, destination };
      if (rawDirection === '0' || rawDirection === '1') this.config.direction_id = Number(rawDirection) as DirectionId;
      else delete this.config.direction_id;
    }
    this.emitConfig();
  };

  private readonly changeDirection = (event: SelectorEvent): void => {
    if (!this.config) return;
    const value = textValue(event.detail.value);
    if (value === '0' || value === '1') this.config = { ...this.config, direction_id: Number(value) as DirectionId };
    else {
      this.config = { ...this.config };
      delete this.config.direction_id;
    }
    this.emitConfig();
  };

  private changeText(
    key: 'stop' | 'line' | 'destination' | 'background_color' | 'text_color',
    event: SelectorEvent,
    reset: Array<'line' | 'destination' | 'direction_id'> = [],
  ): void {
    if (!this.config) return;
    if (reset.length > 0) {
      this.generation += 1;
      this.loading = undefined;
    }
    const value = textValue(event.detail.value);
    this.config = { ...this.config, [key]: value };
    if (!value && key !== 'background_color' && key !== 'text_color') delete this.config[key];
    for (const field of reset) delete this.config[field];
    if (reset.includes('line')) this.lines = [];
    if (reset.includes('destination')) this.destinations = [];
    this.emitConfig();
  }

  private changeNumber(key: 'departures' | 'refresh_interval', event: SelectorEvent, min: number, max: number): void {
    if (!this.config) return;
    const numeric = Number(event.detail.value);
    if (!Number.isFinite(numeric)) return;
    this.config = { ...this.config, [key]: Math.min(max, Math.max(min, Math.round(numeric))) };
    this.emitConfig();
  }

  private toggleManual(): void {
    this.manual = !this.manual;
    if (!this.manual) void this.loadInitialCatalog(++this.generation);
  }

  private retryCatalog(): void {
    this.catalogError = undefined;
    this.manual = false;
    const generation = ++this.generation;
    void this.loadInitialCatalog(generation, true);
  }

  private async loadInitialCatalog(generation: number, forceRefresh = false): Promise<void> {
    this.loading = 'stops';
    this.catalogError = undefined;
    try {
      const snapshot = await sharedTamCache.getCatalog(
        'stops',
        [],
        (signal) => heraultDataClient.listStops({ signal }),
        { forceRefresh },
      );
      if (generation !== this.generation) return;
      this.stops = snapshot.value;
      if (!this.config?.stop) return;

      const canonicalStop = this.stops.find((stop) => sameText(stop, this.config?.stop ?? ''));
      if (canonicalStop) this.config = { ...this.config, stop: canonicalStop };
      await this.loadLines(this.config.stop, generation, forceRefresh, true);
    } catch {
      if (generation !== this.generation) return;
      this.catalogError = localize('editor.catalog_error', this.language);
      this.manual = true;
    } finally {
      if (generation === this.generation) this.loading = undefined;
    }
  }

  private async loadLines(stop: string, generation: number, forceRefresh = false, inferLegacy = false): Promise<void> {
    this.loading = 'lines';
    this.catalogError = undefined;
    try {
      const snapshot = await sharedTamCache.getCatalog(
        'lines',
        [stop],
        (signal) => heraultDataClient.listLinesForStop(stop, { signal }),
        { forceRefresh },
      );
      if (generation !== this.generation) return;
      this.lines = snapshot.value;

      if (this.config?.line) {
        const canonicalLine = this.lines.find((line) => sameText(line, this.config?.line ?? ''));
        if (canonicalLine) this.config = { ...this.config, line: canonicalLine };
        await this.loadDestinations(stop, this.config.line, generation, forceRefresh);
      } else if (inferLegacy && this.config?.destination) {
        await this.inferLine(stop, this.config.destination, generation, forceRefresh);
      }
    } catch {
      if (generation !== this.generation) return;
      this.catalogError = localize('editor.catalog_error', this.language);
      this.manual = true;
    } finally {
      if (generation === this.generation) this.loading = undefined;
    }
  }

  private async loadDestinations(stop: string, line: string, generation: number, forceRefresh = false): Promise<void> {
    this.loading = 'destinations';
    this.catalogError = undefined;
    try {
      const snapshot = await sharedTamCache.getCatalog(
        'destinations',
        [stop, line],
        (signal) => heraultDataClient.listDestinations(stop, line, { signal }),
        { forceRefresh },
      );
      if (generation !== this.generation) return;
      this.destinations = snapshot.value;
      if (this.config?.destination) {
        const canonical = this.destinations.find(
          (item) =>
            sameText(item.destination, this.config?.destination ?? '') &&
            (this.config?.direction_id === undefined || item.direction_id === this.config.direction_id),
        );
        if (canonical) {
          this.config = { ...this.config, destination: canonical.destination };
        }
      }
    } catch {
      if (generation !== this.generation) return;
      this.catalogError = localize('editor.catalog_error', this.language);
      this.manual = true;
    } finally {
      if (generation === this.generation) this.loading = undefined;
    }
  }

  private async inferLine(stop: string, destination: string, generation: number, forceRefresh: boolean): Promise<void> {
    const snapshot = await sharedTamCache.getCatalog<TamJourney[]>(
      'journeys',
      [stop],
      (signal) => heraultDataClient.listJourneysForStop(stop, { signal }),
      { forceRefresh },
    );
    const matches = snapshot.value.filter(
      (journey) =>
        sameText(journey.destination, destination) &&
        (this.config?.direction_id === undefined || journey.direction_id === this.config.direction_id),
    );
    if (generation !== this.generation || !this.config) return;
    const lines = [...new Set(matches.map((journey) => journey.line))];
    if (lines.length === 1) {
      const [line] = lines;
      const match = matches[0];
      this.config = { ...this.config, line, destination: match.destination };
      if (this.config.direction_id !== undefined && match.direction_id !== undefined) {
        this.config.direction_id = match.direction_id;
      }
      this.destinations = snapshot.value
        .filter((journey) => sameText(journey.line, line))
        .map(({ destination: itemDestination, direction_id }) => ({
          destination: itemDestination,
          ...(direction_id === undefined ? {} : { direction_id }),
        }));
      this.emitConfig();
      return;
    }
    if (lines.length > 1) {
      this.catalogError = localize('editor.ambiguous_line', this.language, {
        lines: lines.join(', '),
      });
    }
  }

  private destinationKey(destination?: string, directionId?: DirectionId): string {
    if (!destination) return '';
    return `${destination}\u0000${directionId ?? ''}`;
  }

  private selectedDestinationKey(): string {
    const destination = this.config?.destination;
    if (!destination) return '';
    if (this.config?.direction_id !== undefined) return this.destinationKey(destination, this.config.direction_id);
    const matches = this.destinations.filter((item) => sameText(item.destination, destination));
    return matches.length === 1
      ? this.destinationKey(matches[0].destination, matches[0].direction_id)
      : this.destinationKey(destination);
  }

  private destinationOptions(): Array<{ value: string; label: string }> {
    const options: Array<{ value: string; label: string }> = [];
    const genericAdded = new Set<string>();
    for (const destination of this.destinations) {
      const normalized = destination.destination.normalize('NFKC').toLocaleUpperCase('fr-FR');
      const duplicates = this.destinations.filter((item) => sameText(item.destination, destination.destination));
      if (duplicates.length > 1 && !genericAdded.has(normalized)) {
        genericAdded.add(normalized);
        options.push({
          value: this.destinationKey(destination.destination),
          label: `${destination.destination} — ${localize('editor.all_directions', this.language)}`,
        });
      }
      options.push({
        value: this.destinationKey(destination.destination, destination.direction_id),
        label: this.destinationLabel(destination),
      });
    }
    return options;
  }

  private destinationLabel(destination: TamDestination): string {
    const duplicates = this.destinations.filter((item) => sameText(item.destination, destination.destination)).length;
    return duplicates > 1 && destination.direction_id !== undefined
      ? `${destination.destination} — ${localize(`editor.direction_${destination.direction_id}`, this.language)}`
      : destination.destination;
  }

  private emitConfig(): void {
    if (!this.config) return;
    const config = { ...this.config, type: CARD_TYPE };
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  static styles = editorStyles;
}
