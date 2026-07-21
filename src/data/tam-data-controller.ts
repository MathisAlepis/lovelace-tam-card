import type { ReactiveController } from 'lit';

import { HeraultApiError } from '../api/errors';
import type { DepartureQuery, NormalizedTamCardConfig, RequestOptions, TamDeparture } from '../types';
import { type CacheLease, type CacheSnapshot, sharedTamCache, type TamSharedCache } from './shared-cache';

export const MIN_REFRESH_INTERVAL_SECONDS = 30;
export const MAX_REFRESH_INTERVAL_SECONDS = 300;
export const DEFAULT_REFRESH_INTERVAL_SECONDS = 60;
export const LOCAL_TICK_INTERVAL_MS = 1_000;
export const APPROACHING_THRESHOLD_SECONDS = 120;

const MAX_SHARED_DEPARTURES = 5;

export type TamDataControllerStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

export interface LiveTamDeparture extends TamDeparture {
  readonly remainingSeconds: number;
  readonly remainingMinutes: number;
  readonly isApproaching: boolean;
}

export interface TamDataControllerState {
  readonly status: TamDataControllerStatus;
  readonly departures: readonly LiveTamDeparture[];
  readonly isLoading: boolean;
  readonly isStale: boolean;
  readonly error?: unknown;
  readonly fetchedAt?: number;
  readonly expiresAt?: number;
}

export interface TamDepartureClient {
  getDepartures(query: DepartureQuery, options?: RequestOptions): Promise<TamDeparture[]>;
}

/** The small ReactiveControllerHost surface this controller actually needs. */
export interface TamDataControllerHost {
  addController(controller: ReactiveController): void;
  requestUpdate(): void;
}

export interface VisibilitySource {
  readonly hidden?: boolean;
  readonly visibilityState?: DocumentVisibilityState;
  addEventListener(type: 'visibilitychange', listener: EventListener): void;
  removeEventListener(type: 'visibilitychange', listener: EventListener): void;
}

export interface TamDataControllerOptions {
  readonly cache?: TamSharedCache;
  readonly now?: () => number;
  /** Pass null in non-browser tests to disable visibility observation. */
  readonly visibilitySource?: VisibilitySource | null;
}

type DataConfig = Pick<
  NormalizedTamCardConfig,
  'stop' | 'line' | 'destination' | 'direction_id' | 'departures' | 'refresh_interval'
>;

const INITIAL_STATE: TamDataControllerState = {
  status: 'idle',
  departures: [],
  isLoading: false,
  isStale: false,
};

function browserVisibilitySource(): VisibilitySource | undefined {
  return typeof document === 'undefined' ? undefined : document;
}

function clampInteger(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}

function cleanOptionalString(value: string | undefined): string | undefined {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

function dataConfig(config: NormalizedTamCardConfig): DataConfig {
  return {
    stop: config.stop.trim(),
    line: cleanOptionalString(config.line),
    destination: cleanOptionalString(config.destination),
    direction_id: config.direction_id,
    departures: clampInteger(config.departures, 1, MAX_SHARED_DEPARTURES),
    refresh_interval: clampInteger(config.refresh_interval, MIN_REFRESH_INTERVAL_SECONDS, MAX_REFRESH_INTERVAL_SECONDS),
  };
}

function configSignature(config: DataConfig | undefined): string {
  if (!config) return '';
  return JSON.stringify([
    config.stop,
    config.line ?? '',
    config.destination ?? '',
    config.direction_id ?? '',
    config.departures,
    config.refresh_interval,
  ]);
}

/**
 * Lit-compatible lifecycle controller for departures.
 *
 * The card only reads `state` from render(). All network and timer side effects
 * live here and are tied to hostConnected/hostDisconnected.
 */
export class TamDataController implements ReactiveController {
  private readonly host: TamDataControllerHost;
  private readonly client: TamDepartureClient;
  private readonly cache: TamSharedCache;
  private readonly now: () => number;
  private readonly visibilitySource?: VisibilitySource;

  private config?: DataConfig;
  private signature = '';
  private connected = false;
  private stateValue: TamDataControllerState = INITIAL_STATE;
  private rawDepartures: TamDeparture[] = [];
  private aliveDepartureCount = 0;
  private earlyRefreshRequested = false;
  private lastEarlyRefreshFingerprint = '';
  private retryNotBefore = 0;
  private requestGeneration = 0;
  private requestLease?: CacheLease<TamDeparture[]>;
  private requestPromise?: Promise<void>;
  private refreshTimer?: ReturnType<typeof setTimeout>;
  private tickTimer?: ReturnType<typeof setInterval>;

  private readonly visibilityChanged: EventListener = () => {
    if (!this.connected) return;

    if (this.isDocumentHidden()) {
      this.stopTimers();
      this.cancelActiveRequest();
      if (this.stateValue.isLoading) {
        this.updateState({ ...this.stateValue, isLoading: false });
      }
      return;
    }

    // Returning to the tab always re-evaluates data immediately.
    this.startCycle(true);
  };

  public constructor(host: TamDataControllerHost, client: TamDepartureClient, options: TamDataControllerOptions = {}) {
    this.host = host;
    this.client = client;
    this.cache = options.cache ?? sharedTamCache;
    this.now = options.now ?? Date.now;
    this.visibilitySource =
      options.visibilitySource === null ? undefined : (options.visibilitySource ?? browserVisibilitySource());
    host.addController(this);
  }

  public get state(): TamDataControllerState {
    return this.stateValue;
  }

  public get isConfigured(): boolean {
    return Boolean(this.config?.stop && this.config.line);
  }

  /** Set normalized config. Display-only config changes are intentionally ignored. */
  public setConfig(config: NormalizedTamCardConfig | null | undefined): void {
    const nextConfig = config ? dataConfig(config) : undefined;
    const nextSignature = configSignature(nextConfig);
    if (nextSignature === this.signature) return;

    this.signature = nextSignature;
    this.config = nextConfig;
    this.stopTimers();
    this.cancelActiveRequest();
    this.rawDepartures = [];
    this.aliveDepartureCount = 0;
    this.earlyRefreshRequested = false;
    this.lastEarlyRefreshFingerprint = '';
    this.retryNotBefore = 0;
    this.updateState(INITIAL_STATE);

    if (this.connected && !this.isDocumentHidden()) this.startCycle();
  }

  /** Alias that reads naturally in hosts which do not use a setConfig method. */
  public configure(config: NormalizedTamCardConfig | null | undefined): void {
    this.setConfig(config);
  }

  public hostConnected(): void {
    if (this.connected) return;
    this.connected = true;
    this.visibilitySource?.addEventListener('visibilitychange', this.visibilityChanged);
    if (!this.isDocumentHidden()) this.startCycle();
  }

  public hostDisconnected(): void {
    if (!this.connected) return;
    this.connected = false;
    this.visibilitySource?.removeEventListener('visibilitychange', this.visibilityChanged);
    this.stopTimers();
    this.cancelActiveRequest();
    if (this.stateValue.isLoading) {
      this.updateState({ ...this.stateValue, isLoading: false });
    }
  }

  /**
   * Refresh departures outside render(). `force` bypasses a fresh cached value
   * but still joins any identical in-flight request.
   */
  public refresh(options: { readonly force?: boolean } = {}): Promise<void> {
    if (!this.canRun()) return Promise.resolve();
    if (this.requestPromise) return this.requestPromise;

    const config = this.config as DataConfig & { line: string };
    const query: DepartureQuery = {
      stop: config.stop,
      line: config.line,
      destination: config.destination,
      direction_id: config.direction_id,
      // Fetch the shared maximum so cards displaying 1 and 5 passages can share.
      departures: MAX_SHARED_DEPARTURES,
    };
    const generation = this.requestGeneration + 1;
    this.requestGeneration = generation;
    const lease = this.cache.acquireDepartures<TamDeparture[]>(
      query,
      (signal) => this.client.getDepartures(query, { signal }),
      { forceRefresh: options.force ?? false },
    );
    this.requestLease = lease;

    if (this.stateValue.departures.length === 0) {
      this.updateState({
        ...this.stateValue,
        status: 'loading',
        isLoading: true,
        error: undefined,
      });
    } else {
      this.updateState({ ...this.stateValue, isLoading: true });
    }

    const promise = lease.promise
      .then((snapshot) => {
        if (!this.isCurrentRequest(generation)) return;
        this.applySnapshot(snapshot);
      })
      .catch((error: unknown) => {
        if (!this.isCurrentRequest(generation)) return;
        this.applyError(error);
      })
      .finally(() => {
        lease.release();
        if (this.requestLease === lease) this.requestLease = undefined;
        if (this.requestGeneration === generation) {
          this.requestPromise = undefined;
          if (this.earlyRefreshRequested && this.canRun()) {
            this.earlyRefreshRequested = false;
            queueMicrotask(() => void this.refresh({ force: true }));
          }
        }
      });

    this.requestPromise = promise;
    return promise;
  }

  private startCycle(forceRefresh = false): void {
    this.stopTimers();
    if (!this.canRun()) return;

    this.tickTimer = setInterval(() => this.tick(), LOCAL_TICK_INTERVAL_MS);
    // Reconcile locally before the network round-trip, especially after the
    // tab has spent a long time hidden.
    this.tick();
    this.scheduleRefresh();
    void this.refresh({ force: forceRefresh });
  }

  private scheduleRefresh(): void {
    if (!this.canRun() || !this.config) return;
    if (this.refreshTimer !== undefined) clearTimeout(this.refreshTimer);

    const retryDelay = Math.max(0, this.retryNotBefore - this.now());
    const delay = Math.max(this.config.refresh_interval * 1_000, retryDelay);
    this.refreshTimer = setTimeout(() => {
      this.refreshTimer = undefined;
      void this.refresh().finally(() => this.scheduleRefresh());
    }, delay);
  }

  private stopTimers(): void {
    if (this.refreshTimer !== undefined) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }
    if (this.tickTimer !== undefined) {
      clearInterval(this.tickTimer);
      this.tickTimer = undefined;
    }
  }

  private cancelActiveRequest(): void {
    this.requestGeneration += 1;
    this.requestLease?.release();
    this.requestLease = undefined;
    this.requestPromise = undefined;
  }

  private applySnapshot(snapshot: CacheSnapshot<TamDeparture[]>): void {
    this.rawDepartures = snapshot.value
      .map((departure) => this.normalizePrediction(departure, snapshot.fetchedAt))
      .filter((departure): departure is TamDeparture => departure !== undefined)
      .sort((left, right) => left.predicted_at - right.predicted_at)
      .slice(0, MAX_SHARED_DEPARTURES);
    this.aliveDepartureCount = this.countAlive(this.now());
    this.earlyRefreshRequested = false;
    if (snapshot.stale) this.applyRetryAfter(snapshot.error);
    else {
      this.retryNotBefore = 0;
      this.scheduleRefresh();
    }

    if (this.rawDepartures.length > 0 && this.aliveDepartureCount === 0) {
      this.requestEarlyRefresh();
    } else if (this.aliveDepartureCount > 0) {
      this.lastEarlyRefreshFingerprint = '';
    }

    const departures = this.liveDepartures(this.now());
    this.updateState({
      status: departures.length > 0 ? 'ready' : 'empty',
      departures,
      isLoading: false,
      isStale: snapshot.stale,
      error: snapshot.error,
      fetchedAt: snapshot.fetchedAt,
      expiresAt: snapshot.expiresAt,
    });
  }

  private applyError(error: unknown): void {
    this.earlyRefreshRequested = false;
    this.applyRetryAfter(error);
    if (this.rawDepartures.length > 0) {
      this.updateState({
        ...this.stateValue,
        status: this.stateValue.departures.length > 0 ? 'ready' : 'empty',
        isLoading: false,
        isStale: true,
        error,
      });
      return;
    }

    this.updateState({
      status: 'error',
      departures: [],
      isLoading: false,
      isStale: false,
      error,
    });
  }

  private tick(): void {
    if (!this.canRun()) return;

    const now = this.now();
    const nextAliveCount = this.countAlive(now);
    const departureExpired = nextAliveCount < this.aliveDepartureCount;
    this.aliveDepartureCount = nextAliveCount;

    if (this.rawDepartures.length > 0) {
      const departures = this.liveDepartures(now);
      this.updateState({
        ...this.stateValue,
        status: departures.length > 0 ? 'ready' : 'empty',
        departures,
      });
    }

    if (departureExpired) this.requestEarlyRefresh();
  }

  private requestEarlyRefresh(): void {
    // Automatic expiry refreshes must not bypass a server-provided 429 window.
    // The regular timer was already moved to retryNotBefore by applyRetryAfter.
    if (this.retryNotBefore > this.now()) return;
    const fingerprint = this.rawDepartures
      .map(
        (departure) =>
          departure.course_sae ??
          [
            departure.route_short_name,
            departure.trip_headsign,
            departure.direction_id ?? '',
            departure.departure_time ?? '',
          ].join('\u0000'),
      )
      .join('\u0001');
    if (!fingerprint || fingerprint === this.lastEarlyRefreshFingerprint) return;
    this.lastEarlyRefreshFingerprint = fingerprint;
    this.earlyRefreshRequested = true;
    if (!this.requestPromise) void this.refresh({ force: true });
  }

  private applyRetryAfter(error: unknown): void {
    if (!(error instanceof HeraultApiError) || error.code !== 'rate-limit' || !error.retryAfter) return;
    const seconds = Number(error.retryAfter);
    const retryAt = Number.isFinite(seconds) ? this.now() + Math.max(0, seconds) * 1_000 : Date.parse(error.retryAfter);
    if (!Number.isFinite(retryAt)) return;
    this.retryNotBefore = Math.max(this.retryNotBefore, retryAt);
    this.scheduleRefresh();
  }

  private normalizePrediction(departure: TamDeparture, fetchedAt: number): TamDeparture | undefined {
    const delaySeconds = Number(departure.delay_sec);
    const predictedAt = Number(departure.predicted_at);
    const effectivePrediction = Number.isFinite(predictedAt) ? predictedAt : fetchedAt + delaySeconds * 1_000;

    if (!Number.isFinite(delaySeconds) || delaySeconds < 0 || !Number.isFinite(effectivePrediction)) {
      return undefined;
    }

    return { ...departure, delay_sec: delaySeconds, predicted_at: effectivePrediction };
  }

  private liveDepartures(now: number): LiveTamDeparture[] {
    const limit = this.config?.departures ?? 0;
    return this.rawDepartures
      .filter((departure) => departure.predicted_at > now)
      .slice(0, limit)
      .map((departure) => {
        const remainingSeconds = Math.ceil((departure.predicted_at - now) / 1_000);
        return {
          ...departure,
          remainingSeconds,
          remainingMinutes: Math.ceil(remainingSeconds / 60),
          isApproaching: remainingSeconds <= APPROACHING_THRESHOLD_SECONDS,
        };
      });
  }

  private countAlive(now: number): number {
    return this.rawDepartures.reduce((count, departure) => count + (departure.predicted_at > now ? 1 : 0), 0);
  }

  private canRun(): boolean {
    return this.connected && this.isConfigured && !this.isDocumentHidden();
  }

  private isCurrentRequest(generation: number): boolean {
    return this.canRun() && this.requestGeneration === generation;
  }

  private isDocumentHidden(): boolean {
    return Boolean(this.visibilitySource?.hidden || this.visibilitySource?.visibilityState === 'hidden');
  }

  private updateState(state: TamDataControllerState): void {
    this.stateValue = state;
    this.host.requestUpdate();
  }
}
