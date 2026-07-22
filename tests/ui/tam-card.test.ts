import type { HomeAssistant } from 'custom-card-helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { TamCardConfig, TamDeparture } from '../../src/types';

interface UiDeparture extends TamDeparture {
  remainingSeconds: number;
  remainingMinutes: number;
  isApproaching: boolean;
}

interface UiState {
  status: 'idle' | 'loading' | 'ready' | 'empty' | 'error';
  departures: readonly UiDeparture[];
  isLoading: boolean;
  isStale: boolean;
  error?: unknown;
}

interface ControllerDouble {
  state: UiState;
  setConfig: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
}

const controllerHarness = vi.hoisted(() => ({ instances: [] as unknown[] }));
const routeStyleHarness = vi.hoisted(() => ({
  styles: undefined as
    Record<string, { route_color: string; route_text_color: string; route_type: number }> | undefined,
}));

vi.mock('../../src/data/tam-data-controller', () => {
  class TamDataController {
    public state: UiState = {
      status: 'idle',
      departures: [],
      isLoading: false,
      isStale: false,
    };

    public readonly setConfig = vi.fn();

    public readonly refresh = vi.fn(async () => undefined);

    public constructor(host: { addController(controller: object): void }) {
      host.addController(this);
      controllerHarness.instances.push(this);
    }
  }

  return { TamDataController };
});

vi.mock('../../src/data/route-style-controller', () => ({
  RouteStyleController: class RouteStyleController {
    public constructor(host: { addController(controller: object): void }) {
      host.addController(this);
    }

    public get styles(): typeof routeStyleHarness.styles {
      return routeStyleHarness.styles;
    }
  },
}));

import { HeraultApiError } from '../../src/api';
import { TamCard } from '../../src/tam-card';

const COMPLETE_CONFIG: TamCardConfig = {
  type: 'custom:tam-card',
  stop: 'PABLO PICASSO',
  line: '3',
  destination: 'LATTES CENTRE',
  direction_id: 1,
  departures: 2,
  refresh_interval: 60,
  background_color: 'auto',
  text_color: 'auto',
  show_icon: true,
  show_line: true,
  show_realtime_badge: true,
  show_absolute_time: false,
  compact: false,
};

function departure(minutes: number, overrides: Partial<UiDeparture> = {}): UiDeparture {
  return {
    stop_name: 'PABLO PICASSO',
    route_short_name: '3',
    trip_headsign: 'LATTES CENTRE',
    direction_id: 1,
    departure_time: `10:${String(minutes).padStart(2, '0')}:00`,
    is_theorical: false,
    delay_sec: minutes * 60,
    course_sae: `course-${minutes}`,
    predicted_at: Date.now() + minutes * 60_000,
    remainingSeconds: minutes * 60,
    remainingMinutes: minutes,
    isApproaching: false,
    ...overrides,
  };
}

async function mountCard(config: TamCardConfig = COMPLETE_CONFIG): Promise<TamCard> {
  const card = document.createElement('tam-card') as TamCard;
  card.setConfig(config);
  document.body.append(card);
  await card.updateComplete;
  return card;
}

function latestController(): ControllerDouble {
  const instance = controllerHarness.instances.at(-1);
  if (!instance) throw new Error('The card did not construct its data controller.');
  return instance as ControllerDouble;
}

async function renderState(card: TamCard, state: UiState): Promise<void> {
  latestController().state = state;
  card.requestUpdate();
  await card.updateComplete;
}

function cardShadow(card: TamCard): ShadowRoot {
  if (!card.shadowRoot) throw new Error('The card has no shadow root.');
  return card.shadowRoot;
}

describe('TAM card UI', () => {
  beforeEach(() => {
    controllerHarness.instances.length = 0;
    routeStyleHarness.styles = undefined;
  });

  it('renders an actionable local message for an incomplete configuration', async () => {
    const card = await mountCard({ type: 'custom:tam-card', stop: 'PABLO PICASSO' });
    const shadow = cardShadow(card);

    expect(shadow.querySelector('.message-title')?.textContent).toBe('Configuration incomplète');
    expect(shadow.querySelector('.message-detail')?.textContent).toContain('Sélectionnez une destination.');
    expect(latestController().setConfig).toHaveBeenCalledWith(null);
  });

  it('requires a line but no destination in all-destinations mode', async () => {
    const incomplete = await mountCard({
      type: 'custom:tam-card',
      stop: 'PABLO PICASSO',
      display_mode: 'all_destinations',
    });
    expect(cardShadow(incomplete).querySelector('.message-detail')?.textContent).toContain('Sélectionnez une ligne.');
    expect(latestController().setConfig).toHaveBeenCalledWith(null);

    const complete = await mountCard({
      type: 'custom:tam-card',
      stop: 'PABLO PICASSO',
      line: '3',
      display_mode: 'all_destinations',
    });
    expect(latestController().setConfig).toHaveBeenCalledWith(
      expect.objectContaining({ display_mode: 'all_destinations', stop: 'PABLO PICASSO', line: '3' }),
    );
    expect(cardShadow(complete).querySelector('[aria-busy="true"]')).not.toBeNull();
  });

  it('shows the initial loading skeleton without announcing a live region every second', async () => {
    const card = await mountCard();
    await renderState(card, {
      status: 'loading',
      departures: [],
      isLoading: true,
      isStale: false,
    });

    const shadow = cardShadow(card);
    const loadingCard = shadow.querySelector('ha-card');
    expect(loadingCard?.getAttribute('aria-busy')).toBe('true');
    expect(loadingCard?.getAttribute('aria-label')).toBe('Chargement des passages…');
    expect(shadow.querySelectorAll('.skeleton')).toHaveLength(2);
    expect(shadow.querySelector('[aria-live]')).toBeNull();
  });

  it.each([1, 2])('renders a successful result with %i departure(s)', async (count) => {
    const card = await mountCard({ ...COMPLETE_CONFIG, departures: count });
    const departures = Array.from({ length: count }, (_, index) => departure(index === 0 ? 4 : 13));
    await renderState(card, {
      status: 'ready',
      departures,
      isLoading: false,
      isStale: false,
    });

    const shadow = cardShadow(card);
    expect(shadow.querySelectorAll('.departure')).toHaveLength(count);
    expect([...shadow.querySelectorAll('.time')].map((node) => node.textContent?.trim())).toEqual(
      departures.map((item) => `${item.remainingMinutes} min`),
    );
    expect(shadow.querySelector('.stop')?.textContent).toBe('PABLO PICASSO');
    expect(shadow.querySelector('.destination')?.textContent).toBe('LATTES CENTRE');
  });

  it('uses the weekly route catalogue before the embedded fallback', async () => {
    routeStyleHarness.styles = {
      '3': { route_color: '#123456', route_text_color: '#FFFFFF', route_type: 3 },
    };
    const card = await mountCard();
    await renderState(card, {
      status: 'ready',
      departures: [departure(4)],
      isLoading: false,
      isStale: false,
    });

    const root = cardShadow(card).querySelector('ha-card');
    expect(root?.getAttribute('style')).toContain('--tam-background:#123456');
    expect((root?.querySelector('.mode-icon') as { icon?: string } | null)?.icon).toBe('mdi:bus');
  });

  it('hides the vehicle icon independently from the line badge', async () => {
    const card = await mountCard({ ...COMPLETE_CONFIG, show_icon: false });
    await renderState(card, {
      status: 'ready',
      departures: [departure(4)],
      isLoading: false,
      isStale: false,
    });

    const shadow = cardShadow(card);
    expect(shadow.querySelector('.mode-icon')).toBeNull();
    expect(shadow.querySelector('.line-badge')?.textContent).toBe('3');
    expect(shadow.querySelector('.identity')).not.toBeNull();
    expect(shadow.querySelector('.layout')?.classList.contains('without-identity')).toBe(false);
  });

  it.each([
    { displayMode: 'destination' as const, container: '.layout' },
    { displayMode: 'all_destinations' as const, container: '.overview-header' },
  ])('removes the empty identity column in $displayMode mode', async ({ displayMode, container }) => {
    const card = await mountCard({
      ...COMPLETE_CONFIG,
      display_mode: displayMode,
      ...(displayMode === 'all_destinations' ? { destination: undefined } : {}),
      show_icon: false,
      show_line: false,
    });
    await renderState(card, {
      status: 'ready',
      departures: [departure(4)],
      isLoading: false,
      isStale: false,
    });

    const shadow = cardShadow(card);
    expect(shadow.querySelector('.identity')).toBeNull();
    expect(shadow.querySelector(container)?.classList.contains('without-identity')).toBe(true);
  });

  it('uses a restrained approaching state and the “À l’approche” wording', async () => {
    const card = await mountCard();
    await renderState(card, {
      status: 'ready',
      departures: [departure(1, { isApproaching: true })],
      isLoading: false,
      isStale: false,
    });

    const shadow = cardShadow(card);
    expect(shadow.querySelector('ha-card')?.classList.contains('approaching')).toBe(true);
    expect(shadow.querySelector('.time')?.textContent?.trim()).toBe('À l’approche');
    expect(shadow.querySelector('.departure')?.classList.contains('approaching-departure')).toBe(true);
    expect(shadow.querySelector('.approaching-dot')).not.toBeNull();
    expect(shadow.querySelector('.approaching-badge')).not.toBeNull();
    expect([...shadow.querySelectorAll('.status-badge')].map((node) => node.textContent?.trim())).toContain(
      'À l’approche',
    );
  });

  it('renders one responsive row per destination in the aggregate mode', async () => {
    const card = await mountCard({
      ...COMPLETE_CONFIG,
      display_mode: 'all_destinations',
      destination: undefined,
      direction_id: undefined,
      departures_per_destination: 3,
      show_absolute_time: true,
    });
    const departures = [
      departure(7, { trip_headsign: 'JUVIGNAC', course_sae: 'juvignac' }),
      departure(8, { trip_headsign: 'LATTES CENTRE', course_sae: 'lattes', isApproaching: true }),
      departure(17, { trip_headsign: 'juvignac', course_sae: 'juvignac-2' }),
      departure(18, { trip_headsign: 'LATTES CENTRE', course_sae: 'lattes-2' }),
      departure(27, { trip_headsign: 'JUVIGNAC', course_sae: 'juvignac-3' }),
      departure(32, { trip_headsign: 'PEROLS ETANG', course_sae: 'perols', is_theorical: true }),
      departure(62, { trip_headsign: 'MOSSON', course_sae: 'mosson', departure_time: '11:02:00' }),
    ];
    await renderState(card, {
      status: 'ready',
      departures,
      isLoading: false,
      isStale: false,
    });

    const shadow = cardShadow(card);
    expect(shadow.querySelector('ha-card')?.classList.contains('overview-card')).toBe(true);
    expect(shadow.querySelector('ha-card')?.classList.contains('approaching')).toBe(true);
    expect(
      [...shadow.querySelectorAll('.destination-name > span:last-child')].map((node) => node.textContent?.trim()),
    ).toEqual(['JUVIGNAC', 'LATTES CENTRE', 'PEROLS ETANG', 'MOSSON']);
    expect(shadow.querySelectorAll('.destination-row')).toHaveLength(4);
    expect(shadow.querySelector('.destination-list')?.getAttribute('role')).toBe('list');
    expect(shadow.querySelectorAll('.destination-row.has-approaching')).toHaveLength(1);
    expect(shadow.querySelectorAll('.destination-time')).toHaveLength(7);
    expect(shadow.querySelectorAll('.destination-time.approaching-departure')).toHaveLength(1);
    expect([...shadow.querySelectorAll('.destination-time .absolute')].map((node) => node.textContent?.trim())).toEqual(
      ['10:07', '10:17', '10:27', '10:08', '10:18', '10:32', '11:02'],
    );
    expect(shadow.querySelector('.overview-summary')?.textContent).toContain('Toutes les destinations');
    expect(shadow.querySelector('ha-card')?.getAttribute('aria-label')).toContain('4 destinations');
    expect(shadow.querySelector('[aria-live]')).toBeNull();
    expect(card.getCardSize()).toBe(6);
    expect(card.getGridOptions()).toEqual({ columns: 12, min_columns: 6 });
  });

  it('announces a singular destination count in the aggregate mode', async () => {
    const card = await mountCard({
      ...COMPLETE_CONFIG,
      display_mode: 'all_destinations',
      destination: undefined,
    });
    await renderState(card, {
      status: 'ready',
      departures: [departure(7, { trip_headsign: 'JUVIGNAC' }), departure(17, { trip_headsign: 'juvignac' })],
      isLoading: false,
      isStale: false,
    });

    const label = cardShadow(card).querySelector('ha-card')?.getAttribute('aria-label');
    expect(label).toContain('1 destination.');
    expect(label).not.toContain('1 destinations');
  });

  it('does not mislabel an empty response as the end of service', async () => {
    const card = await mountCard({
      ...COMPLETE_CONFIG,
      background_color: '#12345680',
      text_color: 'white',
    });
    await renderState(card, {
      status: 'empty',
      departures: [],
      isLoading: false,
      isStale: false,
    });

    const shadow = cardShadow(card);
    expect(shadow.querySelector('.message-title')?.textContent).toBe('Aucun passage annoncé');
    expect(shadow.textContent).not.toContain('Fin de service');
    const emptyCard = shadow.querySelector('ha-card') as HTMLElement;
    expect(emptyCard.style.getPropertyValue('--tam-background')).toBe('#12345680');
    expect(emptyCard.style.getPropertyValue('--tam-text')).toBe('white');
  });

  it('preserves configured colors while loading and on errors', async () => {
    const card = await mountCard({
      ...COMPLETE_CONFIG,
      background_color: 'navy',
      text_color: '#ffffff',
    });
    const expectConfiguredColors = (): void => {
      const surface = cardShadow(card).querySelector('ha-card') as HTMLElement;
      expect(surface.style.getPropertyValue('--tam-background')).toBe('navy');
      expect(surface.style.getPropertyValue('--tam-text')).toBe('#ffffff');
    };

    await renderState(card, { status: 'loading', departures: [], isLoading: true, isStale: false });
    expectConfiguredColors();

    await renderState(card, {
      status: 'error',
      departures: [],
      isLoading: false,
      isStale: false,
      error: new HeraultApiError('network', 'Failed to fetch'),
    });
    expectConfiguredColors();
  });

  it('renders a network error and wires the retry button to a forced refresh', async () => {
    const card = await mountCard();
    await renderState(card, {
      status: 'error',
      departures: [],
      isLoading: false,
      isStale: false,
      error: new HeraultApiError('network', 'Failed to fetch'),
    });

    const shadow = cardShadow(card);
    expect(shadow.querySelector('.message-title')?.textContent).toBe('Passages indisponibles');
    expect(shadow.querySelector('.message-detail')?.textContent).toBe('Hérault Data est momentanément indisponible.');

    (shadow.querySelector('.retry') as HTMLButtonElement).click();
    expect(latestController().refresh).toHaveBeenCalledWith({ force: true });
  });

  it('keeps rendering a stale successful result with an explicit warning badge', async () => {
    const card = await mountCard();
    await renderState(card, {
      status: 'ready',
      departures: [departure(7)],
      isLoading: false,
      isStale: true,
      error: new Error('refresh failed'),
    });

    const shadow = cardShadow(card);
    expect(shadow.querySelectorAll('.departure')).toHaveLength(1);
    expect([...shadow.querySelectorAll('.status-badge')].map((node) => node.textContent?.trim())).toContain(
      'Dernier résultat connu',
    );
  });

  it('explains a stale empty fallback instead of presenting a normal empty response', async () => {
    const card = await mountCard();
    await renderState(card, {
      status: 'empty',
      departures: [],
      isLoading: false,
      isStale: true,
    });

    const shadow = cardShadow(card);
    expect(shadow.querySelector('.message-title')?.textContent).toBe('Dernier résultat connu');
    expect(shadow.querySelector('.message-detail')?.textContent).toContain('peuvent être anciens');
  });

  it.each([
    { label: 'Temps réel', departures: [departure(4, { is_theorical: false })] },
    { label: 'Théorique', departures: [departure(4, { is_theorical: true })] },
    {
      label: 'Temps réel + théorique',
      departures: [departure(4, { is_theorical: false }), departure(9, { is_theorical: true })],
    },
  ])('labels the source as $label', async ({ label, departures }) => {
    const card = await mountCard();
    await renderState(card, {
      status: 'ready',
      departures,
      isLoading: false,
      isStale: false,
    });

    expect([...cardShadow(card).querySelectorAll('.status-badge')].map((node) => node.textContent?.trim())).toContain(
      label,
    );
  });

  it('keeps readable automatic text colors on explicit light and dark surfaces', async () => {
    const light = await mountCard({ ...COMPLETE_CONFIG, background_color: '#ffffff', text_color: 'auto' });
    light.hass = {
      language: 'fr',
      themes: { darkMode: false, theme: 'light' },
    } as unknown as HomeAssistant;
    await renderState(light, {
      status: 'ready',
      departures: [departure(4)],
      isLoading: false,
      isStale: false,
    });
    const lightSurface = cardShadow(light).querySelector('ha-card') as HTMLElement;

    const dark = await mountCard({ ...COMPLETE_CONFIG, background_color: '#111111', text_color: 'auto' });
    dark.hass = {
      language: 'fr',
      themes: { darkMode: true, theme: 'dark' },
    } as unknown as HomeAssistant;
    await renderState(dark, {
      status: 'ready',
      departures: [departure(4)],
      isLoading: false,
      isStale: false,
    });
    const darkSurface = cardShadow(dark).querySelector('ha-card') as HTMLElement;

    expect(lightSurface.style.getPropertyValue('--tam-background')).toBe('#ffffff');
    expect(lightSurface.style.getPropertyValue('--tam-text')).toBe('#000000');
    expect(darkSurface.style.getPropertyValue('--tam-background')).toBe('#111111');
    expect(darkSurface.style.getPropertyValue('--tam-text')).toBe('#FFFFFF');
  });

  it('keeps badges readable on translucent hexadecimal backgrounds', async () => {
    const card = await mountCard({
      ...COMPLETE_CONFIG,
      background_color: '#12345680',
      text_color: 'white',
    });
    await renderState(card, {
      status: 'ready',
      departures: [departure(4)],
      isLoading: false,
      isStale: false,
    });
    const surface = cardShadow(card).querySelector('ha-card') as HTMLElement;

    expect(surface.style.getPropertyValue('--tam-background')).toBe('#12345680');
    expect(surface.style.getPropertyValue('--tam-text')).toBe('white');
    expect(surface.style.getPropertyValue('--tam-badge-background')).toBe('');
    expect(surface.style.getPropertyValue('--tam-badge-text')).toBe('');
  });

  it('exposes the Lovelace sizing, editor, preview and customCards contracts', async () => {
    const card = await mountCard();

    expect(card.getCardSize()).toBe(2);
    expect(card.getGridOptions()).toEqual({ columns: 12, min_columns: 3 });
    expect(TamCard.getStubConfig()).toEqual({});
    expect(TamCard.getConfigElement().tagName.toLowerCase()).toBe('tam-card-editor');

    const registrations = (window.customCards ?? []).filter((entry) => entry.type === 'tam-card');
    expect(registrations).toHaveLength(1);
    expect(registrations[0]).toMatchObject({
      type: 'tam-card',
      name: 'TAM Card',
      documentationURL: 'https://github.com/MathisAlepis/lovelace-tam-card',
      preview: true,
    });
  });
});
