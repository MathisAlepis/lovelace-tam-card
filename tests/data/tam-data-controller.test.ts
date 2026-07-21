import type { ReactiveController } from 'lit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HeraultApiError } from '../../src/api/errors';
import {
  APPROACHING_THRESHOLD_SECONDS,
  predictionFromDepartureTime,
  TamDataController,
  type TamDataControllerHost,
  type TamDepartureClient,
  type VisibilitySource,
} from '../../src/data/tam-data-controller';
import { TamSharedCache } from '../../src/data/shared-cache';
import type { NormalizedTamCardConfig, TamDeparture } from '../../src/types';

class TestHost implements TamDataControllerHost {
  public readonly controllers: ReactiveController[] = [];
  public updates = 0;

  public addController(controller: ReactiveController): void {
    this.controllers.push(controller);
  }

  public requestUpdate(): void {
    this.updates += 1;
  }
}

class FakeVisibility implements VisibilitySource {
  public hidden = false;
  public visibilityState: DocumentVisibilityState = 'visible';
  private readonly listeners = new Set<EventListener>();

  public addEventListener(_type: 'visibilitychange', listener: EventListener): void {
    this.listeners.add(listener);
  }

  public removeEventListener(_type: 'visibilitychange', listener: EventListener): void {
    this.listeners.delete(listener);
  }

  public setHidden(hidden: boolean): void {
    this.hidden = hidden;
    this.visibilityState = hidden ? 'hidden' : 'visible';
    const event = new Event('visibilitychange');
    for (const listener of this.listeners) listener(event);
  }
}

function createConfig(overrides: Partial<NormalizedTamCardConfig> = {}): NormalizedTamCardConfig {
  return {
    type: 'custom:tam-card',
    stop: 'PABLO PICASSO',
    display_mode: 'destination',
    line: '3',
    destination: 'LATTES CENTRE',
    direction_id: 1,
    departures: 2,
    departures_per_destination: 1,
    refresh_interval: 60,
    background_color: 'auto',
    text_color: 'auto',
    show_line: true,
    show_realtime_badge: true,
    show_absolute_time: false,
    compact: false,
    ...overrides,
  };
}

function createDeparture(predictedAt: number, overrides: Partial<TamDeparture> = {}): TamDeparture {
  const delay = Math.max(0, Math.ceil((predictedAt - Date.now()) / 1_000));
  return {
    stop_name: 'PABLO PICASSO',
    route_short_name: '3',
    trip_headsign: 'LATTES CENTRE',
    direction_id: 1,
    is_theorical: false,
    delay_sec: delay,
    course_sae: `course-${predictedAt}`,
    predicted_at: predictedAt,
    ...overrides,
  };
}

function createController(
  client: TamDepartureClient,
  options: {
    cache?: TamSharedCache;
    visibility?: FakeVisibility;
  } = {},
): { controller: TamDataController; host: TestHost; visibility: FakeVisibility } {
  const host = new TestHost();
  const visibility = options.visibility ?? new FakeVisibility();
  const controller = new TamDataController(host, client, {
    cache: options.cache ?? new TamSharedCache({ storage: null }),
    visibilitySource: visibility,
  });
  return { controller, host, visibility };
}

describe('TamDataController', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-21T10:00:00.000Z'));
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('loads immediately on connection and updates the countdown locally each second', async () => {
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [createDeparture(Date.now() + 65_000)]),
    };
    const { controller, host } = createController(client);
    controller.setConfig(createConfig());

    expect(client.getDepartures).not.toHaveBeenCalled();
    controller.hostConnected();
    expect(controller.state.status).toBe('loading');
    await controller.refresh();

    expect(client.getDepartures).toHaveBeenCalledTimes(1);
    expect(controller.state.status).toBe('ready');
    expect(controller.state.departures[0]).toMatchObject({
      remainingSeconds: 65,
      remainingMinutes: 1,
      isApproaching: true,
    });

    const updatesBeforeTick = host.updates;
    await vi.advanceTimersByTimeAsync(1_000);
    expect(controller.state.departures[0]?.remainingSeconds).toBe(64);
    expect(host.updates).toBeGreaterThan(updatesBeforeTick);
    expect(client.getDepartures).toHaveBeenCalledTimes(1);

    controller.hostDisconnected();
  });

  it('keeps the countdown aligned with departure_time when the API snapshot delay is older', async () => {
    vi.setSystemTime(new Date('2026-07-21T21:01:16.000Z')); // 23:01:16 in Europe/Paris
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [
        createDeparture(Date.now() + 1_084_000, {
          departure_time: '23:17:04',
          delay_sec: 1_084,
        }),
        createDeparture(Date.now() + 4_380_000, {
          course_sae: 'after-midnight',
          departure_time: '00:12:00',
          delay_sec: 4_380,
        }),
      ]),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig());
    controller.hostConnected();
    await controller.refresh();

    expect(controller.state.departures).toEqual([
      expect.objectContaining({ departure_time: '23:17:04', remainingSeconds: 948, remainingMinutes: 16 }),
      expect.objectContaining({ departure_time: '00:12:00', remainingSeconds: 4_244, remainingMinutes: 71 }),
    ]);

    await vi.advanceTimersByTimeAsync(1_000);
    expect(controller.state.departures[0]?.remainingSeconds).toBe(947);
    controller.hostDisconnected();
  });

  it('uses the displayed HH:mm minute boundary instead of rounding hidden seconds upward', async () => {
    vi.setSystemTime(new Date('2026-07-21T21:10:35.000Z')); // 23:10:35 in Europe/Paris
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [
        createDeparture(Date.now() + 8 * 60_000, {
          departure_time: '23:17:52',
          delay_sec: 8 * 60,
        }),
      ]),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig());
    controller.hostConnected();
    await controller.refresh();

    expect(controller.state.departures[0]).toMatchObject({
      departure_time: '23:17:52',
      remainingSeconds: 437,
      remainingMinutes: 7,
    });
    controller.hostDisconnected();
  });

  it('shows one nearest passage per destination and promotes its backup without an early request', async () => {
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [
        createDeparture(Date.now() + 1_500, { course_sae: 'lattes-first', trip_headsign: 'LATTES CENTRE' }),
        createDeparture(Date.now() + 30_000, { course_sae: 'lattes-next', trip_headsign: 'lattes centre' }),
        createDeparture(Date.now() + 20_000, { course_sae: 'juvignac', trip_headsign: 'JUVIGNAC' }),
        createDeparture(Date.now() + 25_000, { course_sae: 'perols', trip_headsign: 'PEROLS ETANG' }),
        createDeparture(Date.now() + 40_000, { course_sae: 'mosson', trip_headsign: 'MOSSON' }),
      ]),
    };
    const { controller } = createController(client);
    controller.setConfig(
      createConfig({
        display_mode: 'all_destinations',
        destination: undefined,
        direction_id: 0,
        departures: 2,
      }),
    );
    controller.hostConnected();
    await controller.refresh();

    expect(controller.state.departures.map((departure) => departure.course_sae)).toEqual([
      'lattes-first',
      'juvignac',
      'perols',
      'mosson',
    ]);
    expect(client.getDepartures).toHaveBeenCalledWith(
      expect.objectContaining({ all_destinations: true, destination: undefined, direction_id: 0 }),
      expect.anything(),
    );

    await vi.advanceTimersByTimeAsync(2_000);
    expect(controller.state.departures.map((departure) => departure.course_sae)).toEqual([
      'juvignac',
      'perols',
      'lattes-next',
      'mosson',
    ]);
    expect(client.getDepartures).toHaveBeenCalledTimes(1);
    controller.hostDisconnected();
  });

  it('shows up to three chronological passages for every destination', async () => {
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [
        createDeparture(Date.now() + 5 * 60_000, { course_sae: 'lattes-1', trip_headsign: 'LATTES CENTRE' }),
        createDeparture(Date.now() + 7 * 60_000, { course_sae: 'juvignac-1', trip_headsign: 'JUVIGNAC' }),
        createDeparture(Date.now() + 15 * 60_000, { course_sae: 'lattes-2', trip_headsign: 'lattes centre' }),
        createDeparture(Date.now() + 17 * 60_000, { course_sae: 'juvignac-2', trip_headsign: 'JUVIGNAC' }),
        createDeparture(Date.now() + 25 * 60_000, { course_sae: 'lattes-3', trip_headsign: 'LATTES CENTRE' }),
        createDeparture(Date.now() + 27 * 60_000, { course_sae: 'juvignac-3', trip_headsign: 'JUVIGNAC' }),
        createDeparture(Date.now() + 35 * 60_000, { course_sae: 'lattes-4', trip_headsign: 'LATTES CENTRE' }),
      ]),
    };
    const { controller } = createController(client);
    controller.setConfig(
      createConfig({
        display_mode: 'all_destinations',
        destination: undefined,
        departures_per_destination: 3,
      }),
    );
    controller.hostConnected();
    await controller.refresh();

    expect(controller.state.departures.map((departure) => departure.course_sae)).toEqual([
      'lattes-1',
      'juvignac-1',
      'lattes-2',
      'juvignac-2',
      'lattes-3',
      'juvignac-3',
    ]);
    controller.hostDisconnected();
  });

  it('requests exactly one early refresh when a destination loses its final live passage', async () => {
    let resolveEarlyRequest: ((departures: TamDeparture[]) => void) | undefined;
    const client: TamDepartureClient = {
      getDepartures: vi
        .fn<TamDepartureClient['getDepartures']>()
        .mockResolvedValueOnce([
          createDeparture(Date.now() + 1_500, { course_sae: 'last-lattes', trip_headsign: 'LATTES CENTRE' }),
          createDeparture(Date.now() + 30_000, { course_sae: 'juvignac', trip_headsign: 'JUVIGNAC' }),
        ])
        .mockImplementationOnce(
          async () =>
            new Promise<TamDeparture[]>((resolve) => {
              resolveEarlyRequest = resolve;
            }),
        ),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig({ display_mode: 'all_destinations', destination: undefined }));
    controller.hostConnected();
    await controller.refresh();

    await vi.advanceTimersByTimeAsync(2_000);
    expect(controller.state.departures.map((departure) => departure.trip_headsign)).toEqual(['JUVIGNAC']);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(5_000);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);

    const earlyRequest = controller.refresh();
    resolveEarlyRequest?.([
      createDeparture(Date.now() + 60_000, { course_sae: 'new-lattes', trip_headsign: 'LATTES CENTRE' }),
    ]);
    await earlyRequest;
    controller.hostDisconnected();
  });

  it('uses delay_sec as a fallback when departure_time is not a valid clock', () => {
    const fetchedAt = Date.now();
    expect(predictionFromDepartureTime('not-a-time', fetchedAt, 75)).toBeUndefined();
  });

  it('clamps refresh intervals to 30-300 seconds', async () => {
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [createDeparture(Date.now() + 10 * 60_000)]),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig({ refresh_interval: 1 }));
    controller.hostConnected();
    await controller.refresh();

    await vi.advanceTimersByTimeAsync(29_999);
    expect(client.getDepartures).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);

    controller.setConfig(createConfig({ line: '4', refresh_interval: 999 }));
    await controller.refresh();
    const callsAfterChange = vi.mocked(client.getDepartures).mock.calls.length;
    await vi.advanceTimersByTimeAsync(299_999);
    expect(client.getDepartures).toHaveBeenCalledTimes(callsAfterChange);
    await vi.advanceTimersByTimeAsync(1);
    expect(client.getDepartures).toHaveBeenCalledTimes(callsAfterChange + 1);

    controller.hostDisconnected();
  });

  it('pauses while hidden and performs a forced refresh immediately on return', async () => {
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [createDeparture(Date.now() + 5 * 60_000)]),
    };
    const { controller, visibility } = createController(client);
    controller.setConfig(createConfig());
    controller.hostConnected();
    await controller.refresh();

    visibility.setHidden(true);
    const frozenSeconds = controller.state.departures[0]?.remainingSeconds;
    await vi.advanceTimersByTimeAsync(120_000);
    expect(controller.state.departures[0]?.remainingSeconds).toBe(frozenSeconds);
    expect(client.getDepartures).toHaveBeenCalledTimes(1);

    visibility.setHidden(false);
    await controller.refresh();
    expect(client.getDepartures).toHaveBeenCalledTimes(2);
    expect(controller.state.status).toBe('ready');

    controller.hostDisconnected();
  });

  it('removes expired departures immediately and shows loading while resuming a hidden tab', async () => {
    let resolveResumedRequest: ((departures: TamDeparture[]) => void) | undefined;
    const client: TamDepartureClient = {
      getDepartures: vi
        .fn<TamDepartureClient['getDepartures']>()
        .mockResolvedValueOnce([createDeparture(Date.now() + 10_000)])
        .mockImplementationOnce(
          async () =>
            new Promise<TamDeparture[]>((resolve) => {
              resolveResumedRequest = resolve;
            }),
        ),
    };
    const { controller, visibility } = createController(client);
    controller.setConfig(createConfig());
    controller.hostConnected();
    await controller.refresh();
    expect(controller.state.departures).toHaveLength(1);

    visibility.setHidden(true);
    await vi.advanceTimersByTimeAsync(20_000);
    expect(controller.state.departures).toHaveLength(1);

    visibility.setHidden(false);
    expect(controller.state).toMatchObject({ status: 'loading', departures: [], isLoading: true });
    await Promise.resolve();
    expect(client.getDepartures).toHaveBeenCalledTimes(2);

    const resumedRequest = controller.refresh();
    resolveResumedRequest?.([createDeparture(Date.now() + 60_000)]);
    await resumedRequest;
    expect(controller.state).toMatchObject({ status: 'ready', isLoading: false });
    expect(controller.state.departures[0]?.remainingSeconds).toBe(60);
    controller.hostDisconnected();
  });

  it('restarts only for useful config changes, never for display-only or host updates', async () => {
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [createDeparture(Date.now() + 5 * 60_000)]),
    };
    const { controller, host } = createController(client);
    const initial = createConfig();
    controller.setConfig(initial);
    controller.hostConnected();
    await controller.refresh();

    host.requestUpdate(); // Equivalent to an unrelated hass-driven host update.
    controller.setConfig({ ...initial, background_color: '#123456', compact: true });
    await Promise.resolve();
    expect(client.getDepartures).toHaveBeenCalledTimes(1);

    controller.setConfig({ ...initial, line: '4' });
    await controller.refresh();
    expect(client.getDepartures).toHaveBeenCalledTimes(2);

    controller.hostDisconnected();
  });

  it('restarts when casing changes the exact ODSQL query semantics', async () => {
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [createDeparture(Date.now() + 5 * 60_000)]),
    };
    const { controller } = createController(client);
    const initial = createConfig();
    controller.setConfig(initial);
    controller.hostConnected();
    await controller.refresh();
    expect(client.getDepartures).toHaveBeenCalledTimes(1);

    controller.setConfig({ ...initial, stop: 'Pablo Picasso' });
    await controller.refresh();
    expect(client.getDepartures).toHaveBeenCalledTimes(2);
    controller.hostDisconnected();
  });

  it('hides a departure at zero and requests one early forced refresh', async () => {
    let resolveSecond: ((departures: TamDeparture[]) => void) | undefined;
    const client: TamDepartureClient = {
      getDepartures: vi
        .fn<TamDepartureClient['getDepartures']>()
        .mockResolvedValueOnce([createDeparture(Date.now() + 1_500)])
        .mockImplementationOnce(
          async () =>
            new Promise<TamDeparture[]>((resolve) => {
              resolveSecond = resolve;
            }),
        ),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig());
    controller.hostConnected();
    await controller.refresh();

    await vi.advanceTimersByTimeAsync(1_000);
    expect(controller.state.departures[0]?.remainingSeconds).toBe(1);
    await vi.advanceTimersByTimeAsync(1_000);

    expect(controller.state.departures).toHaveLength(0);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(5_000);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);

    resolveSecond?.([createDeparture(Date.now() + 90_000)]);
    await controller.refresh();
    expect(controller.state.departures[0]?.remainingSeconds).toBe(90);

    controller.hostDisconnected();
  });

  it('keeps extra cached departures ready when a displayed one expires', async () => {
    const departures = [
      createDeparture(Date.now() + 500, { course_sae: 'first' }),
      createDeparture(Date.now() + 60_000, { course_sae: 'second' }),
      createDeparture(Date.now() + 120_000, { course_sae: 'third' }),
    ];
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => departures),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig({ departures: 2 }));
    controller.hostConnected();
    await controller.refresh();
    expect(controller.state.departures.map((item) => item.course_sae)).toEqual(['first', 'second']);

    await vi.advanceTimersByTimeAsync(1_000);
    expect(controller.state.departures.map((item) => item.course_sae)).toEqual(['second', 'third']);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);

    controller.hostDisconnected();
  });

  it('marks the last valid result stale when the scheduled refresh fails', async () => {
    const failure = new Error('network unavailable');
    const client: TamDepartureClient = {
      getDepartures: vi
        .fn<TamDepartureClient['getDepartures']>()
        .mockResolvedValueOnce([createDeparture(Date.now() + 2 * 60_000)])
        .mockRejectedValueOnce(failure),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig({ refresh_interval: 30 }));
    controller.hostConnected();
    await controller.refresh();

    await vi.advanceTimersByTimeAsync(30_000);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);
    expect(controller.state).toMatchObject({
      status: 'ready',
      isLoading: false,
      isStale: true,
      error: failure,
    });
    expect(controller.state.departures).toHaveLength(1);

    controller.hostDisconnected();
  });

  it('honors Retry-After even when the last known departure expires during the backoff', async () => {
    const rateLimit = new HeraultApiError('rate-limit', 'Too many requests', { status: 429, retryAfter: '90' });
    const client: TamDepartureClient = {
      getDepartures: vi
        .fn<TamDepartureClient['getDepartures']>()
        .mockResolvedValueOnce([createDeparture(Date.now() + 40_000)])
        .mockRejectedValueOnce(rateLimit)
        .mockImplementationOnce(async () => [createDeparture(Date.now() + 5 * 60_000)]),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig({ refresh_interval: 30 }));
    controller.hostConnected();
    await controller.refresh();

    await vi.advanceTimersByTimeAsync(30_000);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);
    expect(controller.state).toMatchObject({ status: 'ready', isStale: true, error: rateLimit });

    // The cached departure reaches zero ten seconds into the 90-second backoff.
    await vi.advanceTimersByTimeAsync(10_000);
    expect(controller.state.departures).toHaveLength(0);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(79_999);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(client.getDepartures).toHaveBeenCalledTimes(3);
    controller.hostDisconnected();
  });

  it('requests exactly one early refresh for a zero-delay snapshot without looping', async () => {
    const zeroDelay = createDeparture(Date.now(), {
      course_sae: 'zero-delay',
      delay_sec: 0,
      predicted_at: Date.now(),
    });
    let resolveEarlyRequest: ((departures: TamDeparture[]) => void) | undefined;
    const client: TamDepartureClient = {
      getDepartures: vi
        .fn<TamDepartureClient['getDepartures']>()
        .mockResolvedValueOnce([zeroDelay])
        .mockImplementationOnce(
          async () =>
            new Promise<TamDeparture[]>((resolve) => {
              resolveEarlyRequest = resolve;
            }),
        ),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig());
    controller.hostConnected();
    await controller.refresh();
    await Promise.resolve();

    expect(client.getDepartures).toHaveBeenCalledTimes(2);
    expect(controller.state).toMatchObject({ status: 'loading', departures: [], isLoading: true });
    const earlyRequest = controller.refresh();
    resolveEarlyRequest?.([zeroDelay]);
    await earlyRequest;
    expect(controller.state).toMatchObject({ status: 'empty', departures: [], isLoading: false });

    await vi.advanceTimersByTimeAsync(5_000);
    expect(client.getDepartures).toHaveBeenCalledTimes(2);
    controller.hostDisconnected();
  });

  it('handles an empty valid response without calling it end of service', async () => {
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => []),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig());
    controller.hostConnected();
    await controller.refresh();

    expect(controller.state).toMatchObject({
      status: 'empty',
      departures: [],
      isLoading: false,
      isStale: false,
    });
    controller.hostDisconnected();
  });

  it('derives predicted_at from reception time and preserves theoretical data', async () => {
    const departure = createDeparture(Date.now(), {
      predicted_at: Number.NaN,
      delay_sec: 75,
      is_theorical: true,
    });
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [departure]),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig());
    controller.hostConnected();
    await controller.refresh();

    expect(controller.state.departures[0]).toMatchObject({
      predicted_at: Date.now() + 75_000,
      remainingSeconds: 75,
      is_theorical: true,
    });
    controller.hostDisconnected();
  });

  it('shows an error when no previous valid result exists', async () => {
    const failure = new Error('rate limited');
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => Promise.reject(failure)),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig());
    controller.hostConnected();
    await controller.refresh();

    expect(controller.state).toMatchObject({
      status: 'error',
      departures: [],
      isStale: false,
      error: failure,
    });
    controller.hostDisconnected();
  });

  it('releases one disconnected consumer without aborting the other', async () => {
    const cache = new TamSharedCache({ storage: null });
    let signal: AbortSignal | undefined;
    const client: TamDepartureClient = {
      getDepartures: vi.fn(
        async (_query, options) =>
          new Promise<TamDeparture[]>((_resolve, reject) => {
            signal = options?.signal;
            if (signal?.aborted) reject(new DOMException('Aborted', 'AbortError'));
            signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
          }),
      ),
    };
    const first = createController(client, { cache }).controller;
    const second = createController(client, { cache }).controller;
    first.setConfig(createConfig());
    second.setConfig(createConfig());
    first.hostConnected();
    second.hostConnected();
    await Promise.resolve();

    expect(client.getDepartures).toHaveBeenCalledTimes(1);
    first.hostDisconnected();
    expect(signal?.aborted).toBe(false);
    second.hostDisconnected();
    expect(signal?.aborted).toBe(true);
    await Promise.resolve();
  });

  it('fully stops timers and requests after disconnection, then refreshes on reconnect', async () => {
    const client: TamDepartureClient = {
      getDepartures: vi.fn(async () => [createDeparture(Date.now() + APPROACHING_THRESHOLD_SECONDS * 1_000 + 60_000)]),
    };
    const { controller } = createController(client);
    controller.setConfig(createConfig({ refresh_interval: 30 }));
    controller.hostConnected();
    await controller.refresh();
    expect(controller.state.departures[0]?.isApproaching).toBe(false);

    controller.hostDisconnected();
    const callsAtDisconnect = vi.mocked(client.getDepartures).mock.calls.length;
    await vi.advanceTimersByTimeAsync(5 * 60_000);
    expect(client.getDepartures).toHaveBeenCalledTimes(callsAtDisconnect);

    controller.hostConnected();
    await controller.refresh({ force: true });
    expect(client.getDepartures).toHaveBeenCalledTimes(callsAtDisconnect + 1);
    controller.hostDisconnected();
  });
});
