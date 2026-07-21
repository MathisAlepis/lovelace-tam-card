import { describe, expect, it } from 'vitest';

import type { HeraultApiError } from '../../src/api/errors';
import {
  asTheoretical,
  parseDeparturesResponse,
  parseDestinationsResponse,
  parseJourneysResponse,
  parseLinesResponse,
  parseStopsResponse,
} from '../../src/api/schemas';
import { departureRecord, validExplorePayload } from './fixtures';

describe('Explore response schemas', () => {
  it('parses tolerant numeric/string fields and computes predicted_at', () => {
    const departures = parseDeparturesResponse(validExplorePayload, 1_000_000, 5);

    expect(departures).toHaveLength(2);
    expect(departures[0]).toMatchObject({
      route_short_name: '3',
      direction_id: 1,
      is_theorical: true,
      delay_sec: 240,
      course_sae: 'other-course',
      predicted_at: 1_240_000,
    });
    expect(departures[1]).toMatchObject({
      route_short_name: '3',
      is_theorical: false,
      course_sae: '12345',
      stop_coordinates: { lon: 3.9, lat: 43.58 },
    });
  });

  it.each([
    [0, false],
    ['0', false],
    [false, false],
    [1, true],
    ['1', true],
    [true, true],
    ['false', false],
    ['true', true],
    [null, true],
  ])('normalizes is_theorical value %j', (input, expected) => {
    expect(asTheoretical(input)).toBe(expected);
  });

  it('accepts absent optional fields and ignores malformed records', () => {
    const payload = {
      results: [
        departureRecord(10, { course_sae: null, departure_time: null }),
        departureRecord(null),
        departureRecord(-1),
        departureRecord('not-a-number'),
        departureRecord(20, { stop_name: null }),
      ],
    };

    expect(parseDeparturesResponse(payload, 100, 5)).toEqual([
      expect.objectContaining({
        delay_sec: 10,
        predicted_at: 10_100,
        is_theorical: false,
      }),
    ]);
  });

  it('sorts, de-duplicates by course_sae with a fallback and applies the maximum', () => {
    const payload = {
      results: [
        departureRecord(50, { course_sae: 'same', departure_time: '12:05:00' }),
        departureRecord(10, { course_sae: 'same', departure_time: '12:01:00' }),
        departureRecord(20, { course_sae: null, departure_time: '12:02:00' }),
        departureRecord(25, { course_sae: null, departure_time: '12:02:00' }),
        departureRecord(30, { course_sae: 'three' }),
        departureRecord(40, { course_sae: 'four' }),
        departureRecord(60, { course_sae: 'five' }),
        departureRecord(70, { course_sae: 'six' }),
      ],
    };

    const result = parseDeparturesResponse(payload, 0, 99);
    expect(result).toHaveLength(5);
    expect(result.map((departure) => departure.delay_sec)).toEqual([10, 20, 30, 40, 60]);
  });

  it('retains more than five validated rows when an explicit aggregate maximum is supplied', () => {
    const payload = {
      results: Array.from({ length: 8 }, (_, index) =>
        departureRecord(index + 1, {
          course_sae: `aggregate-${index}`,
          trip_headsign: `DESTINATION ${index}`,
        }),
      ),
    };

    expect(parseDeparturesResponse(payload, 0, 100, 100)).toHaveLength(8);
    expect(parseDeparturesResponse(payload, 0, 100)).toHaveLength(5);

    const oversized = {
      results: Array.from({ length: 101 }, (_, index) =>
        departureRecord(index + 1, { course_sae: `bounded-${index}` }),
      ),
    };
    expect(parseDeparturesResponse(oversized, 0, 101, 100)).toHaveLength(100);
  });

  it('returns an empty array for a valid empty response', () => {
    expect(parseDeparturesResponse({ results: [] }, 0, 2)).toEqual([]);
  });

  it('rejects a structurally invalid API document', () => {
    expect(() => parseStopsResponse({ records: [] })).toThrowError(
      expect.objectContaining<Partial<HeraultApiError>>({ code: 'invalid-response' }),
    );
  });

  it('normalizes and de-duplicates catalog results', () => {
    expect(
      parseStopsResponse({
        results: [{ stop_name: 'B' }, { stop_name: null }, { stop_name: 'A' }, { stop_name: 'a' }],
      }),
    ).toEqual(['A', 'B']);
    expect(
      parseLinesResponse({ results: [{ route_short_name: 10 }, { route_short_name: '2' }, { route_short_name: 10 }] }),
    ).toEqual(['2', '10']);
    expect(
      parseDestinationsResponse({
        results: [
          { trip_headsign: 'LATTES', direction_id: '1' },
          { trip_headsign: 'LATTES', direction_id: 1 },
          { trip_headsign: 'MOSSON', direction_id: null },
        ],
      }),
    ).toEqual([{ destination: 'LATTES', direction_id: 1 }, { destination: 'MOSSON' }]);
    expect(
      parseJourneysResponse({
        results: [
          { route_short_name: 10, trip_headsign: 'LATTES', direction_id: '1' },
          { route_short_name: '10', trip_headsign: 'lattes', direction_id: 1 },
          { route_short_name: '2', trip_headsign: 'MOSSON', direction_id: null },
          { route_short_name: null, trip_headsign: 'INVALID' },
        ],
      }),
    ).toEqual([
      { line: '2', destination: 'MOSSON' },
      { line: '10', destination: 'LATTES', direction_id: 1 },
    ]);
  });
});
