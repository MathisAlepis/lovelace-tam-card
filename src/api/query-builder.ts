import type { DepartureQuery } from '../types';

export const HERAULT_DATA_RECORDS_URL =
  'https://www.herault-data.fr/api/explore/v2.1/catalog/datasets/tam_mmm_tpsreel/records';

export const CATALOG_LIMIT = 20_000;
export const DEPARTURES_API_LIMIT = 5;

export const DEPARTURE_SELECT_FIELDS = [
  'stop_name',
  'route_short_name',
  'trip_headsign',
  'direction_id',
  'departure_time',
  'is_theorical',
  'delay_sec',
  'course_sae',
  'stop_coordinates',
] as const;

/**
 * Quote an ODSQL string literal. ODSQL accepts backslash escapes inside quoted
 * literals; the result is then encoded separately by URLSearchParams.
 */
export const odsqlStringLiteral = (value: string): string => {
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replaceAll('\0', '\\0')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');

  return `"${escaped}"`;
};

/** Alias kept explicit for callers/tests searching for an escaping primitive. */
export const escapeOdsqlString = odsqlStringLiteral;

/**
 * Historical YAML and upstream catalogue values vary in casing, sometimes for
 * the same physical stop. Use the documented lower() scalar consistently so a
 * de-duplicated catalogue label cannot hide records with another case variant.
 * The literal remains escaped separately from the ODSQL expression.
 */
export const odsqlTextEquality = (field: string, value: string): string => {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(field)) {
    throw new TypeError('Invalid ODSQL field name.');
  }
  const original = value.trim();
  return `lower(${field}) = ${odsqlStringLiteral(original.toLocaleLowerCase('fr-FR'))}`;
};

const ODSQL_NUMBER = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

/**
 * Route numbers are numeric in this dataset today, while some commercial
 * identifiers are alphanumeric. Only an entire, finite numeric token is emitted
 * unquoted; everything else goes through the string literal escaper.
 */
export const odsqlLineLiteral = (line: string): string => {
  const value = line.trim();
  if (ODSQL_NUMBER.test(value) && Number.isFinite(Number(value))) {
    return value;
  }

  return odsqlStringLiteral(value);
};

export const buildStopsParams = (): URLSearchParams =>
  new URLSearchParams({
    select: 'stop_name',
    group_by: 'stop_name',
    order_by: 'stop_name ASC',
    limit: String(CATALOG_LIMIT),
  });

export const buildLinesForStopParams = (stop: string): URLSearchParams =>
  new URLSearchParams({
    select: 'route_short_name',
    where: odsqlTextEquality('stop_name', stop),
    group_by: 'route_short_name',
    order_by: 'route_short_name ASC',
    limit: String(CATALOG_LIMIT),
  });

/**
 * Fetch every canonical journey served at a stop in one bounded request.
 * Legacy line inference filters this catalogue locally, avoiding one request
 * per line and preserving the exact destination spelling returned upstream.
 */
export const buildJourneysForStopParams = (stop: string): URLSearchParams =>
  new URLSearchParams({
    select: 'route_short_name,trip_headsign,direction_id',
    where: odsqlTextEquality('stop_name', stop),
    group_by: 'route_short_name,trip_headsign,direction_id',
    order_by: 'route_short_name ASC,trip_headsign ASC',
    limit: String(CATALOG_LIMIT),
  });

export const buildDestinationsParams = (stop: string, line: string): URLSearchParams =>
  new URLSearchParams({
    select: 'trip_headsign,direction_id',
    where: [odsqlTextEquality('stop_name', stop), `route_short_name = ${odsqlLineLiteral(line)}`].join(' AND '),
    group_by: 'trip_headsign,direction_id',
    order_by: 'trip_headsign ASC',
    limit: String(CATALOG_LIMIT),
  });

export const buildDeparturesParams = (query: DepartureQuery): URLSearchParams => {
  const filters = [odsqlTextEquality('stop_name', query.stop), `route_short_name = ${odsqlLineLiteral(query.line)}`];

  if (query.direction_id === 0 || query.direction_id === 1) {
    filters.push(`direction_id = ${query.direction_id}`);
  }
  if (query.destination?.trim()) {
    filters.push(odsqlTextEquality('trip_headsign', query.destination));
  }
  filters.push('delay_sec >= 0');

  return new URLSearchParams({
    select: DEPARTURE_SELECT_FIELDS.join(','),
    where: filters.join(' AND '),
    order_by: 'delay_sec ASC',
    // Fetch the small upstream window consistently, then limit after validation
    // and de-duplication. This is important when malformed rows are present.
    limit: String(DEPARTURES_API_LIMIT),
  });
};

export const buildExploreUrl = (params: URLSearchParams, baseUrl = HERAULT_DATA_RECORDS_URL): string => {
  const url = new URL(baseUrl);
  url.search = params.toString();
  return url.toString();
};

export const buildStopsUrl = (baseUrl?: string): string => buildExploreUrl(buildStopsParams(), baseUrl);

export const buildLinesForStopUrl = (stop: string, baseUrl?: string): string =>
  buildExploreUrl(buildLinesForStopParams(stop), baseUrl);

export const buildJourneysForStopUrl = (stop: string, baseUrl?: string): string =>
  buildExploreUrl(buildJourneysForStopParams(stop), baseUrl);

export const buildDestinationsUrl = (stop: string, line: string, baseUrl?: string): string =>
  buildExploreUrl(buildDestinationsParams(stop, line), baseUrl);

export const buildDeparturesUrl = (query: DepartureQuery, baseUrl?: string): string =>
  buildExploreUrl(buildDeparturesParams(query), baseUrl);
