import type { NormalizedTamCardConfig } from '../types';

export const TAM_CARD_TYPE = 'custom:tam-card' as const;

export const MIN_DEPARTURES = 1;
export const MAX_DEPARTURES = 5;
export const MIN_REFRESH_INTERVAL = 30;
export const MAX_REFRESH_INTERVAL = 300;

export type TamCardDefaults = Pick<
  NormalizedTamCardConfig,
  | 'departures'
  | 'refresh_interval'
  | 'background_color'
  | 'text_color'
  | 'show_line'
  | 'show_realtime_badge'
  | 'show_absolute_time'
  | 'compact'
>;

export const DEFAULT_TAM_CARD_CONFIG: Readonly<TamCardDefaults> = Object.freeze({
  departures: 2,
  refresh_interval: 60,
  background_color: 'auto',
  text_color: 'auto',
  show_line: true,
  show_realtime_badge: true,
  show_absolute_time: false,
  compact: false,
});

export const DEFAULT_CONFIG = DEFAULT_TAM_CARD_CONFIG;
