import type { ReactiveController } from 'lit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { RemoteRouteStyleDocument } from '../../src/data/route-style-catalog';
import {
  ROUTE_STYLE_CACHE_TTL_MS,
  RouteStyleController,
  type RouteStyleControllerHost,
} from '../../src/data/route-style-controller';
import { TamSharedCache } from '../../src/data/shared-cache';

class TestHost implements RouteStyleControllerHost {
  public readonly controllers: ReactiveController[] = [];
  public updates = 0;

  public addController(controller: ReactiveController): void {
    this.controllers.push(controller);
  }

  public requestUpdate(): void {
    this.updates += 1;
  }
}

function document(color: string): RemoteRouteStyleDocument {
  return {
    version: 1,
    routes: { '3': { route_color: color, route_text_color: '#000000', route_type: 0 } },
  };
}

describe('RouteStyleController', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-22T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('loads immediately, shares the persistent cache and refreshes after one week', async () => {
    const cache = new TamSharedCache({ storage: null, now: Date.now });
    const loader = vi
      .fn<(signal: AbortSignal) => Promise<RemoteRouteStyleDocument>>()
      .mockResolvedValueOnce(document('#C8D400'))
      .mockResolvedValueOnce(document('#123456'));
    const firstHost = new TestHost();
    const first = new RouteStyleController(firstHost, { cache, loader, now: Date.now });
    const secondHost = new TestHost();
    const second = new RouteStyleController(secondHost, { cache, loader, now: Date.now });

    first.hostConnected();
    second.hostConnected();
    await Promise.all([first.refresh(), second.refresh()]);
    expect(loader).toHaveBeenCalledTimes(1);
    expect(first.styles?.['3']?.route_color).toBe('#C8D400');
    expect(second.styles?.['3']?.route_color).toBe('#C8D400');

    await vi.advanceTimersByTimeAsync(ROUTE_STYLE_CACHE_TTL_MS + 1_000);
    expect(loader).toHaveBeenCalledTimes(2);
    expect(first.styles?.['3']?.route_color).toBe('#123456');
    expect(second.styles?.['3']?.route_color).toBe('#123456');
    expect(firstHost.updates).toBeGreaterThanOrEqual(2);

    first.hostDisconnected();
    second.hostDisconnected();
  });

  it('silently keeps the embedded fallback available when the remote file fails', async () => {
    const host = new TestHost();
    const controller = new RouteStyleController(host, {
      cache: new TamSharedCache({ storage: null }),
      loader: vi.fn(async () => Promise.reject(new Error('offline'))),
    });

    controller.hostConnected();
    await controller.refresh();
    expect(controller.styles).toBeUndefined();
    expect(host.updates).toBe(0);
    controller.hostDisconnected();
  });
});
