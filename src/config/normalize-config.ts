import type { DirectionId, NormalizedTamCardConfig } from '../types';
import {
  DEFAULT_TAM_CARD_CONFIG,
  MAX_DEPARTURES,
  MAX_REFRESH_INTERVAL,
  MIN_DEPARTURES,
  MIN_REFRESH_INTERVAL,
  TAM_CARD_TYPE,
} from './defaults';

export type CssSupports = (property: string, value: string) => boolean;

export interface NormalizeConfigOptions {
  cssSupports?: CssSupports;
}

const CSS_NAMED_COLORS = new Set(
  (
    'aliceblue antiquewhite aqua aquamarine azure beige bisque black ' +
    'blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse ' +
    'chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan ' +
    'darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta ' +
    'darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen ' +
    'darkslateblue darkslategray darkslategrey darkturquoise darkviolet ' +
    'deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite ' +
    'forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green ' +
    'greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender ' +
    'lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan ' +
    'lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon ' +
    'lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue ' +
    'lightyellow lime limegreen linen magenta maroon mediumaquamarine ' +
    'mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue ' +
    'mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream ' +
    'mistyrose moccasin navajowhite navy oldlace olive olivedrab orange ' +
    'orangered orchid palegoldenrod palegreen paleturquoise palevioletred ' +
    'papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red ' +
    'rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna ' +
    'silver skyblue slateblue slategray slategrey snow springgreen steelblue ' +
    'tan teal thistle tomato turquoise violet wheat white whitesmoke yellow ' +
    'yellowgreen transparent currentcolor inherit initial revert revert-layer unset'
  ).split(' '),
);

const NUMBER = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
const HEX_COLOR = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const CSS_VAR = /^var\(\s*--[\w-]+(?:\s*,[\s\S]+)?\)$/;

const parseNumericToken = (token: string, maximum: number, percentageMaximum = 100): boolean => {
  const value = token.trim();
  if (value.endsWith('%')) {
    const number = value.slice(0, -1);
    return NUMBER.test(number) && Number(number) >= 0 && Number(number) <= percentageMaximum;
  }
  return NUMBER.test(value) && Number(value) >= 0 && Number(value) <= maximum;
};

const parseAlpha = (token: string): boolean => parseNumericToken(token, 1, 100);

const splitColorFunction = (body: string): string[] => {
  const usesLegacyCommas = body.includes(',');
  const normalized = body.replace(/\//g, usesLegacyCommas ? ',' : ' ');
  return (usesLegacyCommas ? normalized.split(',') : normalized.split(/\s+/))
    .map((part) => part.trim())
    .filter(Boolean);
};

const isRgbFunction = (name: string, body: string): boolean => {
  const parts = splitColorFunction(body);
  if (parts.length !== 3 && parts.length !== 4) {
    return false;
  }
  return (
    parts.slice(0, 3).every((part) => parseNumericToken(part, 255)) &&
    (parts[3] === undefined || parseAlpha(parts[3])) &&
    (name === 'rgb' || parts.length === 4)
  );
};

const isHue = (token: string): boolean => {
  const value = token.replace(/(?:deg|grad|rad|turn)$/i, '');
  return NUMBER.test(value);
};

const isHslFunction = (name: string, body: string): boolean => {
  const parts = splitColorFunction(body);
  if (parts.length !== 3 && parts.length !== 4) {
    return false;
  }
  return (
    isHue(parts[0]) &&
    parts[1].endsWith('%') &&
    parseNumericToken(parts[1], 100) &&
    parts[2].endsWith('%') &&
    parseNumericToken(parts[2], 100) &&
    (parts[3] === undefined || parseAlpha(parts[3])) &&
    (name === 'hsl' || parts.length === 4)
  );
};

/** Conservative, DOM-free fallback used by tests and non-browser execution. */
export const fallbackSupportsCssColor = (value: string): boolean => {
  const normalized = value.trim().toLowerCase();
  if (!normalized || /[;{}]/.test(normalized)) {
    return false;
  }
  if (HEX_COLOR.test(normalized) || CSS_NAMED_COLORS.has(normalized) || CSS_VAR.test(normalized)) {
    return true;
  }

  const functionMatch = /^(rgb|rgba|hsl|hsla)\((.*)\)$/.exec(normalized);
  if (!functionMatch) {
    return false;
  }
  const [, name, body] = functionMatch;
  return name.startsWith('rgb') ? isRgbFunction(name, body) : isHslFunction(name, body);
};

const nativeCssSupports = (): CssSupports | undefined => {
  if (typeof globalThis.CSS?.supports !== 'function') {
    return undefined;
  }
  return globalThis.CSS.supports.bind(globalThis.CSS);
};

export const isValidCssColor = (value: unknown, cssSupports?: CssSupports): value is string => {
  if (typeof value !== 'string' || !value.trim()) {
    return false;
  }
  if (/[;{}]/.test(value)) {
    return false;
  }
  const supports = cssSupports ?? nativeCssSupports();
  if (supports) {
    try {
      return supports('color', value.trim());
    } catch {
      return false;
    }
  }
  return fallbackSupportsCssColor(value);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizedText = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
};

const normalizedLine = (value: unknown): string | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  const line = normalizedText(value);
  return line || undefined;
};

const normalizedDirectionId = (value: unknown): DirectionId | undefined => {
  if (value === 0 || value === '0') {
    return 0;
  }
  if (value === 1 || value === '1') {
    return 1;
  }
  return undefined;
};

const normalizedInteger = (value: unknown, fallback: number, minimum: number, maximum: number): number => {
  const parsed =
    typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : Number.NaN;
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(maximum, Math.max(minimum, Math.trunc(parsed)));
};

const normalizedBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback;

const normalizedColor = (value: unknown, fallback: string, cssSupports?: CssSupports): string => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const color = value.trim();
  if (color.toLowerCase() === 'auto') {
    return 'auto';
  }
  return isValidCssColor(color, cssSupports) ? color : fallback;
};

const normalizedBackgroundColor = (value: unknown, fallback: string, cssSupports?: CssSupports): string => {
  const color = normalizedColor(value, fallback, cssSupports);
  // CSS-wide/currentColor values make the card background depend on its own
  // foreground and can collapse automatic contrast to 1:1. Explicit literal
  // colours, transparent surfaces and custom properties remain supported.
  return /^(?:currentcolor|inherit|initial|revert|revert-layer|unset)$/i.test(color) ? fallback : color;
};

/**
 * Normalize both modern and historical YAML into one immutable-by-convention
 * shape. Invalid optional values are ignored in favor of safe defaults.
 */
export const normalizeConfig = (input: unknown, options: NormalizeConfigOptions = {}): NormalizedTamCardConfig => {
  const config = isRecord(input) ? input : {};
  const destinationSource = normalizedText(config.destination) || normalizedText(config.direction);
  const modernBackground = config.background_color ?? config.backgroundColor;
  const modernText = config.text_color ?? config.textColor;

  const normalized: NormalizedTamCardConfig = {
    type: TAM_CARD_TYPE,
    stop: normalizedText(config.stop),
    departures: normalizedInteger(
      config.departures,
      DEFAULT_TAM_CARD_CONFIG.departures,
      MIN_DEPARTURES,
      MAX_DEPARTURES,
    ),
    refresh_interval: normalizedInteger(
      config.refresh_interval,
      DEFAULT_TAM_CARD_CONFIG.refresh_interval,
      MIN_REFRESH_INTERVAL,
      MAX_REFRESH_INTERVAL,
    ),
    background_color: normalizedBackgroundColor(
      modernBackground,
      DEFAULT_TAM_CARD_CONFIG.background_color,
      options.cssSupports,
    ),
    text_color: normalizedColor(modernText, DEFAULT_TAM_CARD_CONFIG.text_color, options.cssSupports),
    show_line: normalizedBoolean(config.show_line, DEFAULT_TAM_CARD_CONFIG.show_line),
    show_realtime_badge: normalizedBoolean(config.show_realtime_badge, DEFAULT_TAM_CARD_CONFIG.show_realtime_badge),
    show_absolute_time: normalizedBoolean(config.show_absolute_time, DEFAULT_TAM_CARD_CONFIG.show_absolute_time),
    compact: normalizedBoolean(config.compact, DEFAULT_TAM_CARD_CONFIG.compact),
  };

  const line = normalizedLine(config.line);
  if (line) {
    normalized.line = line;
  }
  if (destinationSource) {
    normalized.destination = destinationSource;
  }
  const directionId = normalizedDirectionId(config.direction_id);
  if (directionId !== undefined) {
    normalized.direction_id = directionId;
  }

  return normalized;
};

export const normalizeTamCardConfig = normalizeConfig;
