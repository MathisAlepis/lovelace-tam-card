import type { LovelaceCardConfig } from 'custom-card-helpers';

export type DirectionId = 0 | 1;
export type TamDisplayMode = 'destination' | 'all_destinations';

/** User-facing Lovelace configuration, including the deprecated v2 aliases. */
export interface TamCardConfig extends LovelaceCardConfig {
  type: 'custom:tam-card';
  stop: string;
  display_mode?: TamDisplayMode;
  line?: string;
  destination?: string;
  direction_id?: DirectionId;
  departures?: number;
  departures_per_destination?: number;
  refresh_interval?: number;
  background_color?: string;
  text_color?: string;
  show_icon?: boolean;
  show_line?: boolean;
  show_realtime_badge?: boolean;
  show_absolute_time?: boolean;
  compact?: boolean;

  /** @deprecated Use destination. This field never represents direction_id. */
  direction?: string;
  /** @deprecated Use background_color. */
  backgroundColor?: string;
  /** @deprecated Use text_color. */
  textColor?: string;
}

/** Canonical configuration consumed by the card after normalization. */
export interface NormalizedTamCardConfig extends LovelaceCardConfig {
  type: 'custom:tam-card';
  stop: string;
  display_mode: TamDisplayMode;
  line?: string;
  destination?: string;
  direction_id?: DirectionId;
  departures: number;
  departures_per_destination: number;
  refresh_interval: number;
  background_color: string;
  text_color: string;
  show_icon: boolean;
  show_line: boolean;
  show_realtime_badge: boolean;
  show_absolute_time: boolean;
  compact: boolean;
}

export interface StopCoordinates {
  lat: number;
  lon: number;
}

/** A validated departure returned to the data/controller layer. */
export interface TamDeparture {
  stop_name: string;
  route_short_name: string;
  trip_headsign: string;
  direction_id?: DirectionId;
  departure_time?: string;
  is_theorical: boolean;
  delay_sec: number;
  course_sae?: string;
  stop_coordinates?: StopCoordinates;
  /** Unix timestamp in milliseconds, calculated when the response is received. */
  predicted_at: number;
}

/** Short alias useful to consumers that already live in the TaM domain. */
export type Departure = TamDeparture;

export interface DepartureQuery {
  stop: string;
  line: string;
  destination?: string;
  direction_id?: DirectionId;
  /** Fetch a wider window so the controller can retain one row per destination. */
  all_destinations?: boolean;
  /** Number returned in destination mode; aggregate mode uses its own bounded window. */
  departures?: number;
}

export interface TamDestination {
  destination: string;
  direction_id?: DirectionId;
}

/** One canonical stop/line/destination combination from the catalogue. */
export interface TamJourney extends TamDestination {
  line: string;
}

export interface RequestOptions {
  signal?: AbortSignal;
}

export type TamDataState = 'idle' | 'loading' | 'ready' | 'empty' | 'stale' | 'error';

export interface TamDataSnapshot {
  state: TamDataState;
  departures: readonly TamDeparture[];
  updated_at?: number;
  stale: boolean;
  error?: Error;
}
