import type { DepartureQuery, RequestOptions, TamDeparture, TamDestination, TamJourney } from '../types';
import { HeraultApiError } from './errors';
import {
  buildDeparturesParams,
  buildDestinationsParams,
  buildExploreUrl,
  buildJourneysForStopParams,
  buildLinesForStopParams,
  buildStopsParams,
  HERAULT_DATA_RECORDS_URL,
} from './query-builder';
import {
  parseDeparturesResponse,
  parseDestinationsResponse,
  parseJourneysResponse,
  parseLinesResponse,
  parseStopsResponse,
} from './schemas';

export const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface HeraultDataClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  fetch?: FetchLike;
  now?: () => number;
  isOnline?: () => boolean;
}

const browserFetch: FetchLike = (input, init) => {
  if (typeof globalThis.fetch !== 'function') {
    return Promise.reject(new TypeError('Fetch API is not available.'));
  }
  return globalThis.fetch(input, init);
};

const browserIsOnline = (): boolean => typeof navigator === 'undefined' || navigator.onLine !== false;

export class HeraultDataClient {
  private readonly baseUrl: string;

  private readonly timeoutMs: number;

  private readonly fetchImpl: FetchLike;

  private readonly now: () => number;

  private readonly isOnline: () => boolean;

  public constructor(options: HeraultDataClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? HERAULT_DATA_RECORDS_URL;
    this.timeoutMs =
      options.timeoutMs !== undefined && Number.isFinite(options.timeoutMs) && options.timeoutMs > 0
        ? options.timeoutMs
        : DEFAULT_REQUEST_TIMEOUT_MS;
    this.fetchImpl = options.fetch ?? browserFetch;
    this.now = options.now ?? Date.now;
    this.isOnline = options.isOnline ?? browserIsOnline;
  }

  public async listStops(options: RequestOptions = {}): Promise<string[]> {
    const payload = await this.request(buildStopsParams(), options);
    return parseStopsResponse(payload);
  }

  public async listLinesForStop(stop: string, options: RequestOptions = {}): Promise<string[]> {
    const payload = await this.request(buildLinesForStopParams(stop), options);
    return parseLinesResponse(payload);
  }

  public async listJourneysForStop(stop: string, options: RequestOptions = {}): Promise<TamJourney[]> {
    const payload = await this.request(buildJourneysForStopParams(stop), options);
    return parseJourneysResponse(payload);
  }

  public async listDestinations(stop: string, line: string, options: RequestOptions = {}): Promise<TamDestination[]> {
    const payload = await this.request(buildDestinationsParams(stop, line), options);
    return parseDestinationsResponse(payload);
  }

  public async getDepartures(query: DepartureQuery, options: RequestOptions = {}): Promise<TamDeparture[]> {
    const payload = await this.request(buildDeparturesParams(query), options);
    return parseDeparturesResponse(payload, this.now(), query.departures);
  }

  private async request(params: URLSearchParams, options: RequestOptions): Promise<unknown> {
    if (options.signal?.aborted) {
      throw new HeraultApiError('aborted', 'La requête a été annulée.');
    }
    if (!this.isOnline()) {
      throw new HeraultApiError('offline', 'Le navigateur est actuellement hors connexion.');
    }

    const controller = new AbortController();
    let timedOut = false;
    let externallyAborted = false;
    const abortFromCaller = (): void => {
      externallyAborted = true;
      controller.abort();
    };
    options.signal?.addEventListener('abort', abortFromCaller, { once: true });

    const timeout = globalThis.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, this.timeoutMs);

    try {
      let response: Response;
      try {
        response = await this.fetchImpl(buildExploreUrl(params, this.baseUrl), {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
      } catch (error) {
        throw this.classifyTransportError(error, timedOut, externallyAborted || options.signal?.aborted === true);
      }

      if (response.status === 429) {
        throw new HeraultApiError('rate-limit', 'Hérault Data limite temporairement le nombre de requêtes.', {
          status: response.status,
          retryAfter: response.headers.get('Retry-After') ?? undefined,
        });
      }
      if (!response.ok) {
        throw new HeraultApiError('http', `Hérault Data a répondu avec le statut HTTP ${response.status}.`, {
          status: response.status,
        });
      }

      try {
        return await response.json();
      } catch (error) {
        if (timedOut || externallyAborted || options.signal?.aborted) {
          throw this.classifyTransportError(error, timedOut, externallyAborted || options.signal?.aborted === true);
        }
        throw new HeraultApiError('invalid-json', 'Hérault Data a renvoyé un document JSON invalide.', {
          cause: error,
        });
      }
    } finally {
      globalThis.clearTimeout(timeout);
      options.signal?.removeEventListener('abort', abortFromCaller);
    }
  }

  private classifyTransportError(error: unknown, timedOut: boolean, externallyAborted: boolean): HeraultApiError {
    if (timedOut) {
      return new HeraultApiError('timeout', `Hérault Data n'a pas répondu sous ${this.timeoutMs / 1_000} secondes.`, {
        cause: error,
      });
    }
    if (externallyAborted) {
      return new HeraultApiError('aborted', 'La requête a été annulée.', {
        cause: error,
      });
    }
    if (!this.isOnline()) {
      return new HeraultApiError('offline', 'Le navigateur est actuellement hors connexion.', { cause: error });
    }
    return new HeraultApiError('network', 'Impossible de joindre Hérault Data.', { cause: error });
  }
}

export const heraultDataClient = new HeraultDataClient();
export const defaultHeraultClient = heraultDataClient;

export const listStops = (options?: RequestOptions): Promise<string[]> => heraultDataClient.listStops(options);

export const listLinesForStop = (stop: string, options?: RequestOptions): Promise<string[]> =>
  heraultDataClient.listLinesForStop(stop, options);

export const listJourneysForStop = (stop: string, options?: RequestOptions): Promise<TamJourney[]> =>
  heraultDataClient.listJourneysForStop(stop, options);

export const listDestinations = (stop: string, line: string, options?: RequestOptions): Promise<TamDestination[]> =>
  heraultDataClient.listDestinations(stop, line, options);

export const getDepartures = (query: DepartureQuery, options?: RequestOptions): Promise<TamDeparture[]> =>
  heraultDataClient.getDepartures(query, options);
