import { describe, expect, it, vi } from 'vitest';

import generatedRouteStyles from '../../route-styles.json';
import {
  fetchRemoteRouteStyles,
  isRemoteRouteStyleDocument,
  parseRemoteRouteStyleDocument,
  REMOTE_ROUTE_STYLES_URL,
} from '../../src/data/route-style-catalog';

const VALID_DOCUMENT = {
  version: 1,
  routes: {
    '3': { route_color: '#C8D400', route_text_color: '#000000', route_type: 0 },
    A: { route_color: '#841931', route_text_color: '#FFFFFF', route_type: 3 },
  },
} as const;

describe('remote route-style catalogue', () => {
  it('accepts the exact JSON document published by the weekly workflow', () => {
    expect(isRemoteRouteStyleDocument(generatedRouteStyles)).toBe(true);
    expect(Object.keys(generatedRouteStyles.routes)).toHaveLength(55);
  });

  it('accepts only bounded GTFS styles with safe colours and normalized line names', () => {
    expect(isRemoteRouteStyleDocument(VALID_DOCUMENT)).toBe(true);
    expect(
      isRemoteRouteStyleDocument({
        version: 1,
        routes: { '3': { route_color: 'red;display:none', route_text_color: '#000000', route_type: 0 } },
      }),
    ).toBe(false);
    expect(
      isRemoteRouteStyleDocument({
        version: 1,
        routes: { lower: { route_color: '#FFFFFF', route_text_color: '#000000', route_type: 3 } },
      }),
    ).toBe(false);
    expect(() => parseRemoteRouteStyleDocument({ version: 2, routes: {} })).toThrow(/invalide/);
  });

  it('downloads and parses the small CORS-enabled JSON document', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(VALID_DOCUMENT), { status: 200 }));
    const signal = new AbortController().signal;

    await expect(fetchRemoteRouteStyles(signal, { fetch: fetchMock })).resolves.toMatchObject(VALID_DOCUMENT);
    expect(fetchMock).toHaveBeenCalledWith(
      REMOTE_ROUTE_STYLES_URL,
      expect.objectContaining({ headers: { Accept: 'application/json' }, signal: expect.any(AbortSignal) }),
    );
  });

  it('rejects HTTP failures without exposing an invalid catalogue', async () => {
    const fetchMock = vi.fn(async () => new Response('', { status: 503 }));
    await expect(
      fetchRemoteRouteStyles(new AbortController().signal, { fetch: fetchMock, timeoutMs: 100 }),
    ).rejects.toThrow('HTTP 503');
  });
});
