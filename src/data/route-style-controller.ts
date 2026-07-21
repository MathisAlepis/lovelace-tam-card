import type { ReactiveController } from 'lit';

import { type CacheLease, sharedTamCache, type TamSharedCache } from './shared-cache';
import {
  fetchRemoteRouteStyles,
  isRemoteRouteStyleDocument,
  type RemoteRouteStyleDocument,
} from './route-style-catalog';
import type { RouteStyleCatalog } from './route-styles';

export const ROUTE_STYLE_CACHE_KEY = 'route-styles:github:v1';
export const ROUTE_STYLE_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1_000;
export const ROUTE_STYLE_CACHE_MAX_STALE_MS = 180 * 24 * 60 * 60 * 1_000;
export const ROUTE_STYLE_RETRY_INTERVAL_MS = 60 * 60 * 1_000;

export interface RouteStyleControllerHost {
  addController(controller: ReactiveController): void;
  requestUpdate(): void;
}

export interface RouteStyleControllerOptions {
  readonly cache?: TamSharedCache;
  readonly loader?: (signal: AbortSignal) => Promise<RemoteRouteStyleDocument>;
  readonly now?: () => number;
}

/**
 * Refreshes the tiny public route-style catalogue weekly. Rendering never
 * waits for it: the committed GTFS table remains the immediate offline fallback.
 */
export class RouteStyleController implements ReactiveController {
  private readonly host: RouteStyleControllerHost;
  private readonly cache: TamSharedCache;
  private readonly loader: (signal: AbortSignal) => Promise<RemoteRouteStyleDocument>;
  private readonly now: () => number;

  private connected = false;
  private stylesValue?: RouteStyleCatalog;
  private lease?: CacheLease<RemoteRouteStyleDocument>;
  private request?: Promise<void>;
  private refreshTimer?: ReturnType<typeof setTimeout>;

  public constructor(host: RouteStyleControllerHost, options: RouteStyleControllerOptions = {}) {
    this.host = host;
    this.cache = options.cache ?? sharedTamCache;
    this.loader = options.loader ?? ((signal) => fetchRemoteRouteStyles(signal));
    this.now = options.now ?? Date.now;
    host.addController(this);
  }

  public get styles(): RouteStyleCatalog | undefined {
    return this.stylesValue;
  }

  public hostConnected(): void {
    if (this.connected) return;
    this.connected = true;
    void this.refresh();
  }

  public hostDisconnected(): void {
    this.connected = false;
    this.clearTimer();
    this.lease?.release();
    this.lease = undefined;
    this.request = undefined;
  }

  public refresh(): Promise<void> {
    if (!this.connected) return Promise.resolve();
    if (this.request) return this.request;

    const lease = this.cache.acquire<RemoteRouteStyleDocument>(ROUTE_STYLE_CACHE_KEY, this.loader, {
      ttlMs: ROUTE_STYLE_CACHE_TTL_MS,
      staleIfError: true,
      maxStaleMs: ROUTE_STYLE_CACHE_MAX_STALE_MS,
      persist: true,
      validate: isRemoteRouteStyleDocument,
    });
    this.lease = lease;

    const request = lease.promise
      .then((snapshot) => {
        if (!this.connected || this.lease !== lease) return;
        this.stylesValue = snapshot.value.routes;
        this.host.requestUpdate();
        const nextRefresh = snapshot.stale
          ? this.now() + ROUTE_STYLE_RETRY_INTERVAL_MS
          : Math.max(this.now() + 1_000, snapshot.expiresAt);
        this.scheduleRefresh(nextRefresh);
      })
      .catch(() => {
        if (this.connected && this.lease === lease) {
          this.scheduleRefresh(this.now() + ROUTE_STYLE_RETRY_INTERVAL_MS);
        }
      })
      .finally(() => {
        lease.release();
        if (this.lease === lease) this.lease = undefined;
        if (this.request === request) this.request = undefined;
      });
    this.request = request;
    return request;
  }

  private scheduleRefresh(at: number): void {
    this.clearTimer();
    if (!this.connected) return;
    this.refreshTimer = setTimeout(
      () => {
        this.refreshTimer = undefined;
        void this.refresh();
      },
      Math.max(1_000, at - this.now()),
    );
  }

  private clearTimer(): void {
    if (this.refreshTimer !== undefined) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }
}
