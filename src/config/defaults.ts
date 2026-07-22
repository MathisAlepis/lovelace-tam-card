import type { NormalizedTamCardConfig } from '../types';

export const TAM_CARD_TYPE = 'custom:tam-card' as const;

export const MIN_DEPARTURES = 1;
export const MAX_DEPARTURES = 5;
export const MIN_DEPARTURES_PER_DESTINATION = 1;
export const MAX_DEPARTURES_PER_DESTINATION = 3;
export const MIN_REFRESH_INTERVAL = 30;
export const MAX_REFRESH_INTERVAL = 300;

export type TamCardDefaults = Pick<
  NormalizedTamCardConfig,
  | 'display_mode'
  | 'departures'
  | 'departures_per_destination'
  | 'refresh_interval'
  | 'background_color'
  | 'text_color'
  | 'show_icon'
  | 'show_line'
  | 'show_realtime_badge'
  | 'show_absolute_time'
  | 'compact'
>;

export const DEFAULT_TAM_CARD_CONFIG: Readonly<TamCardDefaults> = Object.freeze({
  display_mode: 'destination',
  departures: 2,
  departures_per_destination: 1,
  refresh_interval: 60,
  background_color: 'auto',
  text_color: 'auto',
  show_icon: true,
  show_line: true,
  show_realtime_badge: true,
  show_absolute_time: false,
  compact: false,
});

export const DEFAULT_CONFIG = DEFAULT_TAM_CARD_CONFIG;
