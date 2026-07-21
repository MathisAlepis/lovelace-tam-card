/**
 * Module-level cache used by every TAM card/editor instance.
 *
 * Live departures are deliberately kept in memory only. Configuration lists
 * may additionally be persisted in localStorage and used as a stale fallback
 * while the public API is unavailable.
 */

export const DEPARTURES_CACHE_TTL_MS = 25_000;
export const CATALOG_CACHE_TTL_MS = 24 * 60 * 60 * 1_000;
export const CATALOG_CACHE_MAX_STALE_MS = 30 * 24 * 60 * 60 * 1_000;
export const CACHE_STORAGE_VERSION = 1;
export const CACHE_STORAGE_PREFIX = 'tam-card:catalog';

const DEFAULT_MAX_IDLE_MS = 30 * 60 * 1_000;
const CLEANUP_INTERVAL_MS = 5 * 60 * 1_000;

export type CacheSource = 'memory' | 'network' | 'storage';

export interface CacheSnapshot<T> {
  readonly value: T;
  readonly stale: boolean;
  readonly fetchedAt: number;
  readonly expiresAt: number;
  readonly source: CacheSource;
  readonly error?: unknown;
}

export interface CacheLease<T> {
  readonly key: string;
  readonly promise: Promise<CacheSnapshot<T>>;
  release(): void;
}

export interface CacheAcquireOptions {
  /** How long a successful value prevents another request. */
  readonly ttlMs?: number;
  /** Bypass a fresh value, but still join an already-running request. */
  readonly forceRefresh?: boolean;
  /** Return the last valid value when the refresh fails. */
  readonly staleIfError?: boolean;
  /** Maximum age of a stale fallback. Defaults to no age limit in memory. */
  readonly maxStaleMs?: number;
  /** Persist this entry. Reserved for non-live catalogue data. */
  readonly persist?: boolean;
  /** Validate a persisted value before exposing it to consumers. */
  readonly validate?: (value: unknown) => boolean;
}

export type CacheLoader<T> = (signal: AbortSignal) => Promise<T>;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SharedCacheOptions {
  readonly now?: () => number;
  /** Pass null to explicitly disable localStorage. */
  readonly storage?: StorageLike | null;
  readonly storagePrefix?: string;
  readonly storageVersion?: number;
  readonly maxIdleMs?: number;
}

export interface DepartureCacheKeyInput {
  readonly stop?: unknown;
  readonly stop_name?: unknown;
  readonly line?: unknown;
  readonly route_short_name?: unknown;
  readonly destination?: unknown;
  readonly trip_headsign?: unknown;
  readonly direction_id?: unknown;
}

export type CatalogCacheKind = 'stops' | 'lines' | 'destinations' | 'journeys';

function isCatalogValue(kind: CatalogCacheKind, value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  if (kind === 'stops' || kind === 'lines') return value.every((item) => typeof item === 'string');
  return value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      (kind !== 'journeys' || typeof (item as { line?: unknown }).line === 'string') &&
      typeof (item as { destination?: unknown }).destination === 'string' &&
      ((item as { direction_id?: unknown }).direction_id === undefined ||
        (item as { direction_id?: unknown }).direction_id === 0 ||
        (item as { direction_id?: unknown }).direction_id === 1),
  );
}

interface PersistedCacheValue<T> {
  readonly version: number;
  readonly generatedAt: number;
  readonly expiresAt: number;
  readonly value: T;
}

interface InFlight<T> {
  readonly generation: number;
  readonly controller: AbortController;
  readonly consumers: Set<symbol>;
  promise: Promise<CacheSnapshot<T>>;
}

interface CacheEntry<T> {
  hasValue: boolean;
  value?: T;
  fetchedAt: number;
  expiresAt: number;
  lastAccessedAt: number;
  source: CacheSource;
  generation: number;
  inFlight?: InFlight<T>;
}

function defaultStorage(): StorageLike | undefined {
  try {
    return typeof globalThis.localStorage === 'undefined' ? undefined : globalThis.localStorage;
  } catch {
    // Access to localStorage can throw in sandboxed/private browser contexts.
    return undefined;
  }
}

function normalizeKeyPart(value: unknown): string {
  if (value === null || value === undefined) return '';
  // Mirror the query builder exactly: it trims outer whitespace but preserves
  // case, Unicode form and inner whitespace because those can change ODSQL
  // equality semantics. Cache keys must never merge non-equivalent requests.
  return String(value).trim();
}

function encodeKeyParts(parts: readonly unknown[]): string {
  return parts.map((part) => encodeURIComponent(normalizeKeyPart(part))).join('|');
}

/** A deterministic key that intentionally ignores the requested display limit. */
export function createDepartureCacheKey(query: DepartureCacheKeyInput): string {
  return `departures:${encodeKeyParts([
    query.stop ?? query.stop_name,
    query.line ?? query.route_short_name,
    query.destination ?? query.trip_headsign,
    query.direction_id,
  ])}`;
}

export function createCatalogCacheKey(kind: CatalogCacheKind, context: readonly unknown[] = []): string {
  return `catalog:${kind}:${encodeKeyParts(context)}`;
}

function validDuration(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

/**
 * A deterministic cache with reference-counted in-flight requests.
 *
 * Releasing one lease never aborts work still leased by another consumer. The
 * underlying AbortController is triggered only after the last active consumer
 * releases the request.
 */
export class TamSharedCache {
  private readonly entries = new Map<string, CacheEntry<unknown>>();
  private readonly now: () => number;
  private readonly storage?: StorageLike;
  private readonly storagePrefix: string;
  private readonly storageVersion: number;
  private readonly maxIdleMs: number;
  private nextCleanupAt: number;

  public constructor(options: SharedCacheOptions = {}) {
    this.now = options.now ?? Date.now;
    this.storage = options.storage === null ? undefined : (options.storage ?? defaultStorage());
    this.storagePrefix = options.storagePrefix ?? CACHE_STORAGE_PREFIX;
    this.storageVersion = options.storageVersion ?? CACHE_STORAGE_VERSION;
    this.maxIdleMs = validDuration(options.maxIdleMs, DEFAULT_MAX_IDLE_MS);
    this.nextCleanupAt = this.now() + CLEANUP_INTERVAL_MS;
  }

  public acquire<T>(key: string, loader: CacheLoader<T>, options: CacheAcquireOptions = {}): CacheLease<T> {
    if (!key) throw new TypeError('A cache key is required');

    const now = this.now();
    this.cleanupIfNeeded(now);

    const ttlMs = validDuration(options.ttlMs, DEPARTURES_CACHE_TTL_MS);
    const staleIfError = options.staleIfError ?? true;
    const maxStaleMs = validDuration(options.maxStaleMs, Number.POSITIVE_INFINITY);
    const persist = options.persist ?? false;
    const entry = this.getOrCreateEntry<T>(key, now);

    entry.lastAccessedAt = now;
    if (persist && !entry.hasValue) this.restorePersistedValue(key, entry, maxStaleMs, now, options.validate);

    // A forced refresh joins existing work instead of starting a duplicate.
    if (entry.inFlight) return this.createLease(key, entry, entry.inFlight);

    if (entry.hasValue && !options.forceRefresh && entry.expiresAt > now) {
      return this.createSettledLease(key, this.snapshot(entry, false));
    }

    const generation = entry.generation + 1;
    entry.generation = generation;
    const controller = new AbortController();
    const request: InFlight<T> = {
      generation,
      controller,
      consumers: new Set<symbol>(),
      // Replaced synchronously below, before the request can be observed.
      promise: Promise.resolve(undefined as never),
    };

    request.promise = Promise.resolve()
      .then(() => loader(controller.signal))
      .then((value) => {
        const receivedAt = this.now();
        const snapshot: CacheSnapshot<T> = {
          value,
          stale: false,
          fetchedAt: receivedAt,
          expiresAt: receivedAt + ttlMs,
          source: 'network',
        };

        // A loader that ignores abort must not overwrite a newer generation.
        if (entry.generation === generation) {
          entry.hasValue = true;
          entry.value = value;
          entry.fetchedAt = snapshot.fetchedAt;
          entry.expiresAt = snapshot.expiresAt;
          entry.lastAccessedAt = receivedAt;
          entry.source = 'memory';
          if (persist) this.persistValue(key, snapshot);
        }

        return snapshot;
      })
      .catch((error: unknown) => {
        const failedAt = this.now();
        entry.lastAccessedAt = failedAt;
        const age = failedAt - entry.fetchedAt;

        if (staleIfError && entry.hasValue && age <= maxStaleMs) {
          return {
            value: entry.value as T,
            stale: true,
            fetchedAt: entry.fetchedAt,
            expiresAt: entry.expiresAt,
            source: entry.source,
            error,
          } satisfies CacheSnapshot<T>;
        }

        throw error;
      })
      .finally(() => {
        if (entry.inFlight === request) entry.inFlight = undefined;
      });

    entry.inFlight = request;
    return this.createLease(key, entry, request);
  }

  public acquireDepartures<T>(
    query: DepartureCacheKeyInput,
    loader: CacheLoader<T>,
    options: Omit<CacheAcquireOptions, 'ttlMs' | 'persist'> & { readonly ttlMs?: number } = {},
  ): CacheLease<T> {
    return this.acquire(createDepartureCacheKey(query), loader, {
      ...options,
      ttlMs: options.ttlMs ?? DEPARTURES_CACHE_TTL_MS,
      persist: false,
    });
  }

  public acquireCatalog<T>(
    kind: CatalogCacheKind,
    context: readonly unknown[],
    loader: CacheLoader<T>,
    options: Omit<CacheAcquireOptions, 'persist'> = {},
  ): CacheLease<T> {
    return this.acquire(createCatalogCacheKey(kind, context), loader, {
      ...options,
      ttlMs: options.ttlMs ?? CATALOG_CACHE_TTL_MS,
      maxStaleMs: options.maxStaleMs ?? CATALOG_CACHE_MAX_STALE_MS,
      persist: true,
      validate: (value) => isCatalogValue(kind, value),
    });
  }

  /** Acquire, await and automatically release a cache lease. */
  public async get<T>(
    key: string,
    loader: CacheLoader<T>,
    options: CacheAcquireOptions = {},
  ): Promise<CacheSnapshot<T>> {
    const lease = this.acquire(key, loader, options);
    try {
      return await lease.promise;
    } finally {
      lease.release();
    }
  }

  public async getCatalog<T>(
    kind: CatalogCacheKind,
    context: readonly unknown[],
    loader: CacheLoader<T>,
    options: Omit<CacheAcquireOptions, 'persist'> = {},
  ): Promise<CacheSnapshot<T>> {
    const lease = this.acquireCatalog(kind, context, loader, options);
    try {
      return await lease.promise;
    } finally {
      lease.release();
    }
  }

  public peek<T>(key: string): CacheSnapshot<T> | undefined {
    const entry = this.entries.get(key) as CacheEntry<T> | undefined;
    if (!entry?.hasValue) return undefined;

    const now = this.now();
    entry.lastAccessedAt = now;
    return this.snapshot(entry, entry.expiresAt <= now);
  }

  /** Expire a value without discarding its stale fallback. */
  public invalidate(key: string): void {
    const entry = this.entries.get(key);
    if (entry) entry.expiresAt = 0;
  }

  /** Number of in-memory keys, exposed for diagnostics and deterministic tests. */
  public get size(): number {
    return this.entries.size;
  }

  /** Remove idle entries. Active requests are never removed or aborted here. */
  public cleanup(now = this.now()): number {
    let removed = 0;
    for (const [key, entry] of this.entries) {
      if (!entry.inFlight && now - entry.lastAccessedAt >= this.maxIdleMs) {
        this.entries.delete(key);
        removed += 1;
      }
    }

    this.nextCleanupAt = now + CLEANUP_INTERVAL_MS;
    return removed;
  }

  /** Primarily useful for tests and explicit application teardown. */
  public clear(): void {
    for (const entry of this.entries.values()) {
      entry.generation += 1;
      entry.inFlight?.controller.abort();
    }
    this.entries.clear();
  }

  private getOrCreateEntry<T>(key: string, now: number): CacheEntry<T> {
    const current = this.entries.get(key) as CacheEntry<T> | undefined;
    if (current) return current;

    const entry: CacheEntry<T> = {
      hasValue: false,
      fetchedAt: 0,
      expiresAt: 0,
      lastAccessedAt: now,
      source: 'memory',
      generation: 0,
    };
    this.entries.set(key, entry as CacheEntry<unknown>);
    return entry;
  }

  private createSettledLease<T>(key: string, snapshot: CacheSnapshot<T>): CacheLease<T> {
    return {
      key,
      promise: Promise.resolve(snapshot),
      release: () => undefined,
    };
  }

  private createLease<T>(key: string, entry: CacheEntry<T>, request: InFlight<T>): CacheLease<T> {
    const consumer = Symbol(key);
    request.consumers.add(consumer);
    let released = false;

    return {
      key,
      promise: request.promise,
      release: () => {
        if (released) return;
        released = true;
        request.consumers.delete(consumer);

        if (request.consumers.size === 0 && entry.inFlight === request) {
          // Clear synchronously so a new consumer cannot join an aborted request.
          entry.inFlight = undefined;
          entry.generation += 1;
          request.controller.abort();
        }
      },
    };
  }

  private snapshot<T>(entry: CacheEntry<T>, stale: boolean): CacheSnapshot<T> {
    return {
      value: entry.value as T,
      stale,
      fetchedAt: entry.fetchedAt,
      expiresAt: entry.expiresAt,
      source: entry.source,
    };
  }

  private cleanupIfNeeded(now: number): void {
    if (now >= this.nextCleanupAt) this.cleanup(now);
  }

  private storageKey(key: string): string {
    return `${this.storagePrefix}:v${this.storageVersion}:${key}`;
  }

  private restorePersistedValue<T>(
    key: string,
    entry: CacheEntry<T>,
    maxStaleMs: number,
    now: number,
    validate?: (value: unknown) => boolean,
  ): void {
    if (!this.storage) return;

    const storageKey = this.storageKey(key);
    try {
      const serialized = this.storage.getItem(storageKey);
      if (!serialized) return;

      const parsed = JSON.parse(serialized) as Partial<PersistedCacheValue<T>>;
      if (
        parsed.version !== this.storageVersion ||
        typeof parsed.generatedAt !== 'number' ||
        !Number.isFinite(parsed.generatedAt) ||
        typeof parsed.expiresAt !== 'number' ||
        !Number.isFinite(parsed.expiresAt) ||
        !('value' in parsed) ||
        now - parsed.generatedAt > maxStaleMs ||
        parsed.generatedAt > now + 5 * 60 * 1_000 ||
        parsed.expiresAt < parsed.generatedAt ||
        parsed.expiresAt - parsed.generatedAt > CATALOG_CACHE_TTL_MS + 5 * 60 * 1_000 ||
        (validate !== undefined && !validate(parsed.value))
      ) {
        this.storage.removeItem(storageKey);
        return;
      }

      entry.hasValue = true;
      entry.value = parsed.value as T;
      entry.fetchedAt = parsed.generatedAt;
      entry.expiresAt = parsed.expiresAt;
      entry.lastAccessedAt = now;
      entry.source = 'storage';
    } catch {
      // Malformed data or unavailable storage must never break the card/editor.
      try {
        this.storage.removeItem(storageKey);
      } catch {
        // Ignore a second storage failure as well.
      }
    }
  }

  private persistValue<T>(key: string, snapshot: CacheSnapshot<T>): void {
    if (!this.storage) return;

    const persisted: PersistedCacheValue<T> = {
      version: this.storageVersion,
      generatedAt: snapshot.fetchedAt,
      expiresAt: snapshot.expiresAt,
      value: snapshot.value,
    };

    try {
      this.storage.setItem(this.storageKey(key), JSON.stringify(persisted));
    } catch {
      // Quota/security errors only disable persistence for this write.
    }
  }
}

/** Shared by all cards in the JavaScript module. */
export const sharedTamCache = new TamSharedCache();
