import { describe, expect, it, vi } from 'vitest';

import type { HeraultApiError } from '../../src/api/errors';
import { type FetchLike, HeraultDataClient } from '../../src/api/herault-client';
import { departureRecord, validExplorePayload } from './fixtures';

const jsonResponse = (payload: unknown, status = 200, headers?: HeadersInit): Response =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

const expectApiError = async (promise: Promise<unknown>, code: HeraultApiError['code']): Promise<void> => {
  await expect(promise).rejects.toMatchObject({
    name: 'HeraultApiError',
    code,
  });
};

describe('HeraultDataClient', () => {
  it('calls the catalog endpoints and parses their results', async () => {
    const fetchMock = vi
      .fn<FetchLike>()
      .mockResolvedValueOnce(jsonResponse({ results: [{ stop_name: 'B' }, { stop_name: 'A' }] }))
      .mockResolvedValueOnce(jsonResponse({ results: [{ route_short_name: 3 }] }))
      .mockResolvedValueOnce(
        jsonResponse({ results: [{ route_short_name: 3, trip_headsign: 'LATTES', direction_id: 1 }] }),
      )
      .mockResolvedValueOnce(jsonResponse({ results: [{ trip_headsign: 'LATTES', direction_id: 1 }] }));
    const client = new HeraultDataClient({ fetch: fetchMock, baseUrl: 'https://example.test/records' });

    await expect(client.listStops()).resolves.toEqual(['A', 'B']);
    await expect(client.listLinesForStop('PABLO PICASSO')).resolves.toEqual(['3']);
    await expect(client.listJourneysForStop('PABLO PICASSO')).resolves.toEqual([
      { line: '3', destination: 'LATTES', direction_id: 1 },
    ]);
    await expect(client.listDestinations('PABLO PICASSO', '3')).resolves.toEqual([
      { destination: 'LATTES', direction_id: 1 },
    ]);

    expect(new URL(String(fetchMock.mock.calls[0][0])).searchParams.get('group_by')).toBe('stop_name');
    expect(new URL(String(fetchMock.mock.calls[1][0])).searchParams.get('where')).toContain(
      'lower(stop_name) = "pablo picasso"',
    );
    expect(new URL(String(fetchMock.mock.calls[2][0])).searchParams.get('group_by')).toBe(
      'route_short_name,trip_headsign,direction_id',
    );
  });

  it('parses departures at the instant the JSON response is received', async () => {
    const fetchMock = vi.fn<FetchLike>().mockResolvedValue(jsonResponse(validExplorePayload));
    const client = new HeraultDataClient({ fetch: fetchMock, now: () => 5_000 });

    const result = await client.getDepartures({
      stop: 'PABLO PICASSO',
      line: '3',
      destination: 'LATTES CENTRE',
      departures: 1,
    });

    expect(result).toEqual([expect.objectContaining({ delay_sec: 240, predicted_at: 245_000 })]);
  });

  it('retains the wider response window only for all-destinations requests', async () => {
    const payload = {
      results: Array.from({ length: 8 }, (_, index) =>
        departureRecord(index + 1, {
          course_sae: `course-${index}`,
          trip_headsign: `DESTINATION ${index}`,
        }),
      ),
    };
    const aggregateFetch = vi.fn<FetchLike>().mockResolvedValue(jsonResponse(payload));
    const aggregateClient = new HeraultDataClient({ fetch: aggregateFetch });

    await expect(
      aggregateClient.getDepartures({ stop: 'PABLO PICASSO', line: '3', all_destinations: true }),
    ).resolves.toHaveLength(8);
    expect(new URL(String(aggregateFetch.mock.calls[0][0])).searchParams.get('limit')).toBe('100');

    const regularClient = new HeraultDataClient({ fetch: vi.fn<FetchLike>().mockResolvedValue(jsonResponse(payload)) });
    await expect(regularClient.getDepartures({ stop: 'PABLO PICASSO', line: '3' })).resolves.toHaveLength(2);
  });

  it('maps invalid JSON, HTTP and rate-limit responses to stable errors', async () => {
    const invalidJson = vi.fn<FetchLike>().mockResolvedValue(new Response('{', { status: 200 }));
    await expectApiError(new HeraultDataClient({ fetch: invalidJson }).listStops(), 'invalid-json');

    const unavailable = vi.fn<FetchLike>().mockResolvedValue(jsonResponse({}, 503));
    await expect(new HeraultDataClient({ fetch: unavailable }).listStops()).rejects.toMatchObject({
      code: 'http',
      status: 503,
    });

    const limited = vi.fn<FetchLike>().mockResolvedValue(jsonResponse({}, 429, { 'Retry-After': '30' }));
    await expect(new HeraultDataClient({ fetch: limited }).listStops()).rejects.toMatchObject({
      code: 'rate-limit',
      status: 429,
      retryAfter: '30',
    });
  });

  it('distinguishes network and offline failures', async () => {
    const failingFetch = vi.fn<FetchLike>().mockRejectedValue(new TypeError('Failed to fetch'));
    await expectApiError(new HeraultDataClient({ fetch: failingFetch }).listStops(), 'network');

    const neverCalled = vi.fn<FetchLike>();
    await expectApiError(new HeraultDataClient({ fetch: neverCalled, isOnline: () => false }).listStops(), 'offline');
    expect(neverCalled).not.toHaveBeenCalled();
  });

  it('times out and aborts the underlying request', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn<FetchLike>().mockImplementation((_input, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    });
    const request = new HeraultDataClient({ fetch: fetchMock, timeoutMs: 1_000 }).listStops();
    const assertion = expectApiError(request, 'timeout');

    await vi.advanceTimersByTimeAsync(1_000);
    await assertion;
    expect((fetchMock.mock.calls[0][1]?.signal as AbortSignal).aborted).toBe(true);
  });

  it('honors caller cancellation separately from timeout', async () => {
    const fetchMock = vi.fn<FetchLike>().mockImplementation((_input, init) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
      });
    });
    const controller = new AbortController();
    const request = new HeraultDataClient({ fetch: fetchMock }).listStops({ signal: controller.signal });
    controller.abort();

    await expectApiError(request, 'aborted');
  });

  it('does not call fetch for an already cancelled request', async () => {
    const fetchMock = vi.fn<FetchLike>();
    const controller = new AbortController();
    controller.abort();

    await expectApiError(
      new HeraultDataClient({ fetch: fetchMock }).listStops({ signal: controller.signal }),
      'aborted',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
