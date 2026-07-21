import type { DirectionId, StopCoordinates, TamDeparture, TamDestination, TamJourney } from '../types';
import { HeraultApiError } from './errors';
import { DEPARTURES_API_LIMIT } from './query-builder';

export type UnknownRecord = Record<string, unknown>;

export const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const asString = (value: unknown, allowNumber = false): string | undefined => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized || undefined;
  }
  if (allowNumber && typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
};

export const asFiniteNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value !== 'string' || !value.trim()) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const asDirectionId = (value: unknown): DirectionId | undefined => {
  const parsed = asFiniteNumber(value);
  return parsed === 0 || parsed === 1 ? parsed : undefined;
};

export const asTheoretical = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value === 0 ? false : value === 1 ? true : true;
  }
  if (typeof value === 'string') {
    switch (value.trim().toLowerCase()) {
      case '0':
      case 'false':
        return false;
      case '1':
      case 'true':
        return true;
      default:
        return true;
    }
  }

  // Missing/unknown provenance must not be presented as real time.
  return true;
};

const isLatitude = (value: number): boolean => value >= -90 && value <= 90;
const isLongitude = (value: number): boolean => value >= -180 && value <= 180;

export const asStopCoordinates = (value: unknown): StopCoordinates | undefined => {
  let lat: number | undefined;
  let lon: number | undefined;

  if (isRecord(value)) {
    lat = asFiniteNumber(value.lat ?? value.latitude);
    lon = asFiniteNumber(value.lon ?? value.lng ?? value.longitude);
  } else if (Array.isArray(value) && value.length >= 2) {
    // ODS GeoPoint arrays use [longitude, latitude].
    lon = asFiniteNumber(value[0]);
    lat = asFiniteNumber(value[1]);
  }

  if (lat === undefined || lon === undefined || !isLatitude(lat) || !isLongitude(lon)) {
    return undefined;
  }
  return { lat, lon };
};

export const parseDepartureRecord = (raw: unknown, receivedAt: number): TamDeparture | undefined => {
  if (!isRecord(raw)) {
    return undefined;
  }

  const stopName = asString(raw.stop_name);
  const routeShortName = asString(raw.route_short_name, true);
  const tripHeadsign = asString(raw.trip_headsign);
  const delaySec = asFiniteNumber(raw.delay_sec);

  if (!stopName || !routeShortName || !tripHeadsign || delaySec === undefined || delaySec < 0) {
    return undefined;
  }

  const departure: TamDeparture = {
    stop_name: stopName,
    route_short_name: routeShortName,
    trip_headsign: tripHeadsign,
    is_theorical: asTheoretical(raw.is_theorical),
    delay_sec: delaySec,
    predicted_at: receivedAt + delaySec * 1_000,
  };

  const directionId = asDirectionId(raw.direction_id);
  if (directionId !== undefined) {
    departure.direction_id = directionId;
  }

  const departureTime = asString(raw.departure_time, true);
  if (departureTime) {
    departure.departure_time = departureTime;
  }

  const courseSae = asString(raw.course_sae, true);
  if (courseSae) {
    departure.course_sae = courseSae;
  }

  const coordinates = asStopCoordinates(raw.stop_coordinates);
  if (coordinates) {
    departure.stop_coordinates = coordinates;
  }

  return departure;
};

export const extractExploreResults = (payload: unknown): unknown[] => {
  if (!isRecord(payload) || !Array.isArray(payload.results)) {
    throw new HeraultApiError(
      'invalid-response',
      'La réponse Hérault Data ne contient pas de liste de résultats valide.',
    );
  }
  return payload.results;
};

const compareCatalogValues = (left: string, right: string): number =>
  left.localeCompare(right, 'fr', { numeric: true, sensitivity: 'base' });

const uniqueCatalogValues = (values: readonly string[]): string[] => {
  const unique = new Map<string, string>();
  for (const value of values) {
    const key = value.normalize('NFKC').toLocaleUpperCase('fr-FR');
    if (!unique.has(key)) {
      unique.set(key, value);
    }
  }
  return [...unique.values()].sort(compareCatalogValues);
};

export const parseStopsResponse = (payload: unknown): string[] => {
  const stops = extractExploreResults(payload)
    .map((row) => (isRecord(row) ? asString(row.stop_name) : undefined))
    .filter((stop): stop is string => stop !== undefined);

  return uniqueCatalogValues(stops);
};

export const parseLinesResponse = (payload: unknown): string[] => {
  const lines = extractExploreResults(payload)
    .map((row) => (isRecord(row) ? asString(row.route_short_name, true) : undefined))
    .filter((line): line is string => line !== undefined);

  return uniqueCatalogValues(lines);
};

export const parseDestinationsResponse = (payload: unknown): TamDestination[] => {
  const destinations: TamDestination[] = [];
  const seen = new Set<string>();

  for (const row of extractExploreResults(payload)) {
    if (!isRecord(row)) {
      continue;
    }
    const destination = asString(row.trip_headsign);
    if (!destination) {
      continue;
    }
    const directionId = asDirectionId(row.direction_id);
    const key = `${destination.normalize('NFKC').toLocaleUpperCase('fr-FR')}\u0000${directionId ?? ''}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    destinations.push({
      destination,
      ...(directionId === undefined ? {} : { direction_id: directionId }),
    });
  }

  return destinations.sort(
    (left, right) =>
      compareCatalogValues(left.destination, right.destination) ||
      (left.direction_id ?? -1) - (right.direction_id ?? -1),
  );
};

export const parseJourneysResponse = (payload: unknown): TamJourney[] => {
  const journeys: TamJourney[] = [];
  const seen = new Set<string>();

  for (const row of extractExploreResults(payload)) {
    if (!isRecord(row)) continue;
    const line = asString(row.route_short_name, true);
    const destination = asString(row.trip_headsign);
    if (!line || !destination) continue;
    const directionId = asDirectionId(row.direction_id);
    const key = [line, destination, directionId ?? '']
      .map((value) => String(value).normalize('NFKC').toLocaleUpperCase('fr-FR'))
      .join('\u0000');
    if (seen.has(key)) continue;
    seen.add(key);
    journeys.push({
      line,
      destination,
      ...(directionId === undefined ? {} : { direction_id: directionId }),
    });
  }

  return journeys.sort(
    (left, right) =>
      compareCatalogValues(left.line, right.line) ||
      compareCatalogValues(left.destination, right.destination) ||
      (left.direction_id ?? -1) - (right.direction_id ?? -1),
  );
};

const departureFallbackKey = (departure: TamDeparture): string =>
  [
    departure.stop_name,
    departure.route_short_name,
    departure.trip_headsign,
    departure.direction_id ?? '',
    departure.departure_time ?? departure.delay_sec,
  ].join('\u0000');

export const normalizeDepartureLimit = (value: unknown): number => {
  const parsed = asFiniteNumber(value);
  if (parsed === undefined) {
    return 2;
  }
  return Math.min(DEPARTURES_API_LIMIT, Math.max(1, Math.trunc(parsed)));
};

/** Sort, de-duplicate and cap validated records without mutating the input. */
export const normalizeDepartures = (departures: readonly TamDeparture[], limit: unknown): TamDeparture[] => {
  const sorted = departures
    .filter((departure) => Number.isFinite(departure.delay_sec) && departure.delay_sec >= 0)
    .slice()
    .sort((left, right) => left.delay_sec - right.delay_sec);
  const seen = new Set<string>();
  const unique: TamDeparture[] = [];

  for (const departure of sorted) {
    const key = departure.course_sae ? `course:${departure.course_sae}` : `fallback:${departureFallbackKey(departure)}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(departure);
    if (unique.length >= normalizeDepartureLimit(limit)) {
      break;
    }
  }
  return unique;
};

export const parseDeparturesResponse = (payload: unknown, receivedAt: number, limit: unknown): TamDeparture[] => {
  const departures = extractExploreResults(payload)
    .map((row) => parseDepartureRecord(row, receivedAt))
    .filter((departure): departure is TamDeparture => departure !== undefined);

  return normalizeDepartures(departures, limit);
};
