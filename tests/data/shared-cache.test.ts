import { describe, expect, it, vi } from 'vitest';

import {
  CACHE_STORAGE_PREFIX,
  CACHE_STORAGE_VERSION,
  createCatalogCacheKey,
  createDepartureCacheKey,
  TamSharedCache,
  type StorageLike,
} from '../../src/data/shared-cache';

class MemoryStorage implements StorageLike {
  public readonly values = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  public removeItem(key: string): void {
    this.values.delete(key);
  }
}

describe('TamSharedCache', () => {
  it('keeps semantically distinct departure requests in distinct cache keys', () => {
    const exact = createDepartureCacheKey({
      stop: 'Pablo Picasso',
      line: '3',
      destination: 'Lattes Centre',
      direction_id: 1,
    });

    expect(
      createDepartureCacheKey({
        stop_name: '  Pablo Picasso ',
        route_short_name: ' 3 ',
        trip_headsign: ' Lattes Centre ',
        direction_id: 1,
      }),
    ).toBe(exact);
    expect(createDepartureCacheKey({ stop: 'PABLO PICASSO', line: '3', destination: 'Lattes Centre' })).not.toBe(
      createDepartureCacheKey({ stop: 'Pablo Picasso', line: '3', destination: 'Lattes Centre' }),
    );
    expect(createDepartureCacheKey({ stop: 'Pablo   Picasso', line: '3', destination: 'Lattes Centre' })).not.toBe(
      exact,
    );
  });

  it('shares the exact in-flight promise for identical requests', async () => {
    const cache = new TamSharedCache({ storage: null });
    let resolveRequest: ((value: readonly string[]) => void) | undefined;
    const loader = vi.fn(
      () =>
        new Promise<readonly string[]>((resolve) => {
          resolveRequest = resolve;
        }),
    );

    const query = { stop: 'Pablo Picasso', line: '3', destination: 'Lattes Centre', direction_id: 1 } as const;
    const first = cache.acquireDepartures(query, loader);
    const second = cache.acquireDepartures({ ...query }, loader);

    expect(first.promise).toBe(second.promise);
    expect(loader).toHaveBeenCalledTimes(0);
    await Promise.resolve();
    expect(loader).toHaveBeenCalledTimes(1);

    resolveRequest?.(['shared']);
    await expect(first.promise).resolves.toMatchObject({ value: ['shared'], stale: false });
    first.release();
    second.release();
  });

  it('keeps different request keys isolated', async () => {
    const cache = new TamSharedCache({ storage: null });
    const loader = vi.fn(async (signal: AbortSignal) => (signal.aborted ? 'aborted' : 'ok'));

    const first = cache.acquire('one', loader);
    const second = cache.acquire('two', loader);

    await Promise.all([first.promise, second.promise]);
    expect(loader).toHaveBeenCalledTimes(2);
    first.release();
    second.release();
  });

  it('honours TTL and refreshes only after expiry', async () => {
    let now = 10_000;
    const cache = new TamSharedCache({ now: () => now, storage: null });
    const loader = vi.fn(async () => `value-${loader.mock.calls.length}`);

    const first = cache.acquire('ttl', loader, { ttlMs: 25_000 });
    await expect(first.promise).resolves.toMatchObject({ value: 'value-1' });
    first.release();

    now += 24_999;
    const fresh = cache.acquire('ttl', loader, { ttlMs: 25_000 });
    await expect(fresh.promise).resolves.toMatchObject({ value: 'value-1', stale: false });
    fresh.release();
    expect(loader).toHaveBeenCalledTimes(1);

    now += 2;
    const expired = cache.acquire('ttl', loader, { ttlMs: 25_000 });
    await expect(expired.promise).resolves.toMatchObject({ value: 'value-2' });
    expired.release();
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('returns the last valid value explicitly marked stale after an error', async () => {
    let now = 1_000;
    const cache = new TamSharedCache({ now: () => now, storage: null });
    const first = cache.acquire('stale', async () => ['last-valid'], { ttlMs: 100 });
    await first.promise;
    first.release();

    const failure = new Error('offline');
    now += 101;
    const fallback = cache.acquire('stale', async () => Promise.reject(failure), {
      ttlMs: 100,
    });

    await expect(fallback.promise).resolves.toMatchObject({
      value: ['last-valid'],
      stale: true,
      error: failure,
    });
    fallback.release();
  });

  it('does not abort shared work while another consumer still holds a lease', async () => {
    const cache = new TamSharedCache({ storage: null });
    let requestSignal: AbortSignal | undefined;
    let rejectRequest: ((reason: unknown) => void) | undefined;
    const loader = vi.fn(
      (signal: AbortSignal) =>
        new Promise<string>((_resolve, reject) => {
          requestSignal = signal;
          rejectRequest = reject;
          if (signal.aborted) reject(new DOMException('Aborted', 'AbortError'));
          signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
        }),
    );

    const first = cache.acquire('shared-release', loader, { staleIfError: false });
    const second = cache.acquire('shared-release', loader, { staleIfError: false });
    const rejected = expect(first.promise).rejects.toMatchObject({ name: 'AbortError' });
    await Promise.resolve();

    first.release();
    expect(requestSignal?.aborted).toBe(false);
    second.release();
    expect(requestSignal?.aborted).toBe(true);

    await rejected;
    // Keep the explicit reference live so the test also verifies one request.
    expect(rejectRequest).toBeTypeOf('function');
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('persists only versioned catalogue values and uses expired data as fallback', async () => {
    let now = 5_000;
    const storage = new MemoryStorage();
    const firstCache = new TamSharedCache({ now: () => now, storage });
    const first = firstCache.acquireCatalog('stops', [], async () => ['A', 'B'], {
      ttlMs: 100,
      maxStaleMs: 10_000,
    });
    await first.promise;
    first.release();

    const storageKey = `${CACHE_STORAGE_PREFIX}:v${CACHE_STORAGE_VERSION}:${createCatalogCacheKey('stops')}`;
    expect(JSON.parse(storage.getItem(storageKey) ?? 'null')).toMatchObject({
      version: CACHE_STORAGE_VERSION,
      generatedAt: 5_000,
      value: ['A', 'B'],
    });

    const freshCache = new TamSharedCache({ now: () => now, storage });
    const unnecessaryLoader = vi.fn(async () => ['new']);
    const fresh = freshCache.acquireCatalog('stops', [], unnecessaryLoader, {
      ttlMs: 100,
      maxStaleMs: 10_000,
    });
    await expect(fresh.promise).resolves.toMatchObject({
      value: ['A', 'B'],
      source: 'storage',
      stale: false,
    });
    fresh.release();
    expect(unnecessaryLoader).not.toHaveBeenCalled();

    now += 101;
    const secondCache = new TamSharedCache({ now: () => now, storage });
    const loader = vi.fn(async () => Promise.reject(new Error('catalogue unavailable')));
    const restored = secondCache.acquireCatalog('stops', [], loader, {
      ttlMs: 100,
      maxStaleMs: 10_000,
    });

    await expect(restored.promise).resolves.toMatchObject({
      value: ['A', 'B'],
      source: 'storage',
      stale: true,
    });
    restored.release();
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('falls back cleanly when localStorage is unavailable or contains another version', async () => {
    const storage = new MemoryStorage();
    const mismatchedKey = `${CACHE_STORAGE_PREFIX}:v2:${createCatalogCacheKey('lines', ['Gare'])}`;
    storage.setItem(mismatchedKey, JSON.stringify({ version: 1, generatedAt: 1, expiresAt: 100_000, value: ['old'] }));
    const mismatchedLoader = vi.fn(async () => ['3']);
    const versionedCache = new TamSharedCache({ storage, storageVersion: 2, now: () => 10 });
    const versionedLease = versionedCache.acquireCatalog('lines', ['Gare'], mismatchedLoader);
    await expect(versionedLease.promise).resolves.toMatchObject({ value: ['3'], stale: false });
    versionedLease.release();
    expect(mismatchedLoader).toHaveBeenCalledTimes(1);
    expect(JSON.parse(storage.getItem(mismatchedKey) ?? 'null')).toMatchObject({
      version: 2,
      value: ['3'],
    });

    const throwingStorage: StorageLike = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
      removeItem: () => {
        throw new Error('denied');
      },
    };
    const cache = new TamSharedCache({ storage: throwingStorage, storageVersion: 2 });
    const loader = vi.fn(async () => ['3']);
    const lease = cache.acquireCatalog('lines', ['Gare'], loader);

    await expect(lease.promise).resolves.toMatchObject({ value: ['3'], stale: false });
    lease.release();
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it.each([
    {
      name: 'a value with the wrong catalogue shape',
      envelope: { generatedAt: 1_000, expiresAt: 2_000, value: [{ destination: 42 }] },
    },
    {
      name: 'an envelope generated too far in the future',
      envelope: { generatedAt: 1_000 + 10 * 60_000, expiresAt: 1_000 + 10 * 60_000 + 100, value: ['old'] },
    },
  ])('rejects $name from localStorage before loading fresh catalogue data', async ({ envelope }) => {
    const now = 1_000;
    const storage = new MemoryStorage();
    const storageKey = `${CACHE_STORAGE_PREFIX}:v${CACHE_STORAGE_VERSION}:${createCatalogCacheKey('stops')}`;
    storage.setItem(storageKey, JSON.stringify({ version: CACHE_STORAGE_VERSION, ...envelope }));
    const cache = new TamSharedCache({ now: () => now, storage });
    const loader = vi.fn(async () => ['fresh']);

    const lease = cache.acquireCatalog('stops', [], loader, { ttlMs: 100 });

    await expect(lease.promise).resolves.toMatchObject({ value: ['fresh'], source: 'network', stale: false });
    lease.release();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(JSON.parse(storage.getItem(storageKey) ?? 'null')).toMatchObject({ value: ['fresh'] });
  });

  it('cleans idle entries without touching active requests', async () => {
    let now = 0;
    const cache = new TamSharedCache({ now: () => now, storage: null, maxIdleMs: 100 });
    const settled = cache.acquire('settled', async () => 'ok');
    await settled.promise;
    settled.release();

    let resolveActive: ((value: string) => void) | undefined;
    const active = cache.acquire(
      'active',
      async () =>
        new Promise<string>((resolve) => {
          resolveActive = resolve;
        }),
    );
    await Promise.resolve();
    now = 100;

    expect(cache.cleanup()).toBe(1);
    expect(cache.size).toBe(1);
    resolveActive?.('done');
    await active.promise;
    active.release();
  });
});
