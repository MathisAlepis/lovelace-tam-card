import { describe, expect, it } from 'vitest';

import {
  buildDeparturesParams,
  buildDeparturesUrl,
  buildDestinationsParams,
  buildJourneysForStopParams,
  buildLinesForStopParams,
  buildStopsParams,
  odsqlLineLiteral,
  odsqlStringLiteral,
  odsqlTextEquality,
} from '../../src/api/query-builder';

describe('ODSQL query builder', () => {
  it('builds the exact Pablo Picasso query with a numeric line and limit 5', () => {
    const params = buildDeparturesParams({
      stop: 'PABLO PICASSO',
      line: '3',
      direction_id: 1,
      destination: 'LATTES CENTRE',
      departures: 2,
    });

    expect(Object.fromEntries(params)).toEqual({
      select:
        'stop_name,route_short_name,trip_headsign,direction_id,departure_time,is_theorical,delay_sec,course_sae,stop_coordinates',
      where:
        'lower(stop_name) = "pablo picasso" AND route_short_name = 3 AND direction_id = 1 AND lower(trip_headsign) = "lattes centre" AND delay_sec >= 0',
      order_by: 'delay_sec ASC',
      limit: '5',
    });
  });

  it('escapes quotes, backslashes and control characters before URL encoding', () => {
    const stop = 'A" OR delay_sec < 0 OR "x"="x\\B\nC & D';
    const literal = odsqlStringLiteral(stop);
    const url = buildDeparturesUrl({
      stop,
      line: '3 OR 1=1',
      destination: 'Terminus "Nord"',
    });
    const decoded = new URL(url).searchParams.get('where');
    const normalizedStopLiteral = odsqlStringLiteral(stop.toLocaleLowerCase('fr-FR'));
    const normalizedDestinationLiteral = odsqlStringLiteral('Terminus "Nord"'.toLocaleLowerCase('fr-FR'));

    expect(literal).toBe('"A\\" OR delay_sec < 0 OR \\"x\\"=\\"x\\\\B\\nC & D"');
    expect(decoded).toContain(`lower(stop_name) = ${normalizedStopLiteral}`);
    expect(decoded).toContain('route_short_name = "3 OR 1=1"');
    expect(decoded).toContain(`lower(trip_headsign) = ${normalizedDestinationLiteral}`);
    expect(url).not.toContain(' & D');
  });

  it('only emits complete finite numeric line tokens without quotes', () => {
    expect(odsqlLineLiteral('3')).toBe('3');
    expect(odsqlLineLiteral(' 42.5 ')).toBe('42.5');
    expect(odsqlLineLiteral('3A')).toBe('"3A"');
    expect(odsqlLineLiteral('3 OR true')).toBe('"3 OR true"');
    expect(odsqlLineLiteral('Infinity')).toBe('"Infinity"');
  });

  it('matches canonical and historical labels without depending on case', () => {
    expect(odsqlTextEquality('stop_name', 'PABLO PICASSO')).toBe('lower(stop_name) = "pablo picasso"');
    expect(odsqlTextEquality('stop_name', 'Oxford')).toBe('lower(stop_name) = "oxford"');
    expect(buildLinesForStopParams('Pablo Picasso').get('where')).toBe('lower(stop_name) = "pablo picasso"');
  });

  it('ignores an invalid runtime direction id instead of interpolating it', () => {
    const params = buildDeparturesParams({
      stop: 'A',
      line: '1',
      direction_id: '1 OR true' as never,
    });
    expect(params.get('where')).not.toContain('direction_id');
    expect(() => odsqlTextEquality('stop_name OR true', 'A')).toThrow(TypeError);
  });

  it('builds grouped catalog queries', () => {
    expect(Object.fromEntries(buildStopsParams())).toEqual({
      select: 'stop_name',
      group_by: 'stop_name',
      order_by: 'stop_name ASC',
      limit: '20000',
    });
    expect(buildLinesForStopParams('A "B"').get('where')).toBe('lower(stop_name) = "a \\"b\\""');
    expect(Object.fromEntries(buildJourneysForStopParams('PABLO PICASSO'))).toEqual({
      select: 'route_short_name,trip_headsign,direction_id',
      where: 'lower(stop_name) = "pablo picasso"',
      group_by: 'route_short_name,trip_headsign,direction_id',
      order_by: 'route_short_name ASC,trip_headsign ASC',
      limit: '20000',
    });
    expect(Object.fromEntries(buildDestinationsParams('PABLO PICASSO', '3'))).toMatchObject({
      select: 'trip_headsign,direction_id',
      where: 'lower(stop_name) = "pablo picasso" AND route_short_name = 3',
      group_by: 'trip_headsign,direction_id',
      order_by: 'trip_headsign ASC',
      limit: '20000',
    });
  });
});
