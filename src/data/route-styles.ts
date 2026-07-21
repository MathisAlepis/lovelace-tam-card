import { ROUTE_STYLES, ROUTE_STYLES_METADATA } from './route-styles.generated';

export interface RoutePresentation {
  background: string;
  text: string;
  icon: string;
  routeType?: number;
  known: boolean;
}

export interface RouteStyleDefinition {
  route_color: string;
  route_text_color: string;
  route_type: number;
}

export type RouteStyleCatalog = Readonly<Record<string, RouteStyleDefinition>>;

interface ParsedColor {
  readonly rgb: [number, number, number];
  readonly alpha: number;
}

const BASIC_NAMED_COLORS: Record<string, [number, number, number]> = {
  aqua: [0, 255, 255],
  black: [0, 0, 0],
  blue: [0, 0, 255],
  fuchsia: [255, 0, 255],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  lime: [0, 255, 0],
  maroon: [128, 0, 0],
  navy: [0, 0, 128],
  olive: [128, 128, 0],
  orange: [255, 165, 0],
  purple: [128, 0, 128],
  red: [255, 0, 0],
  silver: [192, 192, 192],
  teal: [0, 128, 128],
  white: [255, 255, 255],
  yellow: [255, 255, 0],
};

const BROWSER_COLOR_CACHE = new Map<string, ParsedColor | undefined>();
const BROWSER_COLOR_CACHE_LIMIT = 64;

const clamp = (value: number, minimum: number, maximum: number): number => Math.min(maximum, Math.max(minimum, value));

function parseAlpha(value: string | undefined): number | undefined {
  if (value === undefined) return 1;
  const token = value.trim();
  const parsed = Number(token.endsWith('%') ? token.slice(0, -1) : token);
  if (!Number.isFinite(parsed)) return undefined;
  return clamp(token.endsWith('%') ? parsed / 100 : parsed, 0, 1);
}

function functionalParts(body: string): { components: string[]; alpha?: string } {
  if (body.includes(',')) {
    const parts = body
      .replace(/\s*\/\s*/, ',')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    return parts.length === 4 ? { components: parts.slice(0, 3), alpha: parts[3] } : { components: parts };
  }
  const [channels, alpha] = body.split('/').map((part) => part.trim());
  return { components: channels.split(/\s+/).filter(Boolean), ...(alpha ? { alpha } : {}) };
}

function rgbChannel(value: string): number | undefined {
  const token = value.trim();
  const parsed = Number(token.endsWith('%') ? token.slice(0, -1) : token);
  if (!Number.isFinite(parsed)) return undefined;
  return clamp(token.endsWith('%') ? (parsed / 100) * 255 : parsed, 0, 255);
}

function hueDegrees(value: string): number | undefined {
  const token = value.trim().toLowerCase();
  const parsed = Number(token.replace(/(?:deg|grad|rad|turn)$/, ''));
  if (!Number.isFinite(parsed)) return undefined;
  if (token.endsWith('turn')) return parsed * 360;
  if (token.endsWith('grad')) return parsed * 0.9;
  if (token.endsWith('rad')) return (parsed * 180) / Math.PI;
  return parsed;
}

function hslPercentage(value: string): number | undefined {
  if (!value.trim().endsWith('%')) return undefined;
  const parsed = Number(value.trim().slice(0, -1));
  return Number.isFinite(parsed) ? clamp(parsed / 100, 0, 1) : undefined;
}

function hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const section = normalizedHue / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  const [red, green, blue] =
    section < 1
      ? [chroma, secondary, 0]
      : section < 2
        ? [secondary, chroma, 0]
        : section < 3
          ? [0, chroma, secondary]
          : section < 4
            ? [0, secondary, chroma]
            : section < 5
              ? [secondary, 0, chroma]
              : [chroma, 0, secondary];
  const offset = lightness - chroma / 2;
  return [red, green, blue].map((channel) => Math.round((channel + offset) * 255)) as [number, number, number];
}

function resolveBrowserColor(color: string): ParsedColor | undefined {
  const cacheKey = color.trim().toLowerCase();
  if (/^var\(/i.test(cacheKey)) return undefined;
  if (BROWSER_COLOR_CACHE.has(cacheKey)) return BROWSER_COLOR_CACHE.get(cacheKey);
  if (typeof document === 'undefined' || typeof getComputedStyle !== 'function' || !document.documentElement) {
    return undefined;
  }
  const probe = document.createElement('span');
  probe.style.color = color;
  if (!probe.style.color) return undefined;
  probe.hidden = true;
  document.documentElement.append(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const resolved = computed && computed.toLowerCase() !== cacheKey ? parseColor(computed, false) : undefined;
  if (BROWSER_COLOR_CACHE.size >= BROWSER_COLOR_CACHE_LIMIT) {
    const oldest = BROWSER_COLOR_CACHE.keys().next().value as string | undefined;
    if (oldest !== undefined) BROWSER_COLOR_CACHE.delete(oldest);
  }
  BROWSER_COLOR_CACHE.set(cacheKey, resolved);
  return resolved;
}

function parseColor(color: string, allowBrowserResolution = true): ParsedColor | undefined {
  const value = color.trim();
  const normalized = value.toLowerCase();
  if (normalized === 'transparent') return { rgb: [0, 0, 0], alpha: 0 };
  const named = BASIC_NAMED_COLORS[normalized];
  if (named) return { rgb: named, alpha: 1 };

  const shortHex = /^#([\da-f])([\da-f])([\da-f])$/i.exec(value);
  if (shortHex)
    return {
      rgb: shortHex.slice(1).map((channel) => Number.parseInt(`${channel}${channel}`, 16)) as [number, number, number],
      alpha: 1,
    };

  const shortHexAlpha = /^#([\da-f])([\da-f])([\da-f])([\da-f])$/i.exec(value);
  if (shortHexAlpha)
    return {
      rgb: shortHexAlpha.slice(1, 4).map((channel) => Number.parseInt(`${channel}${channel}`, 16)) as [
        number,
        number,
        number,
      ],
      alpha: Number.parseInt(`${shortHexAlpha[4]}${shortHexAlpha[4]}`, 16) / 255,
    };

  const hex = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i.exec(value);
  if (hex)
    return {
      rgb: hex.slice(1, 4).map((channel) => Number.parseInt(channel, 16)) as [number, number, number],
      alpha: hex[4] ? Number.parseInt(hex[4], 16) / 255 : 1,
    };

  const functional = /^(rgb|rgba|hsl|hsla)\((.*)\)$/i.exec(value);
  if (functional) {
    const { components, alpha: rawAlpha } = functionalParts(functional[2]);
    const alpha = parseAlpha(rawAlpha);
    if (components.length !== 3 || alpha === undefined) return undefined;
    if (functional[1].toLowerCase().startsWith('rgb')) {
      const channels = components.map(rgbChannel);
      if (channels.some((channel) => channel === undefined)) return undefined;
      return { rgb: channels as [number, number, number], alpha };
    }
    const hue = hueDegrees(components[0]);
    const saturation = hslPercentage(components[1]);
    const lightness = hslPercentage(components[2]);
    if (hue === undefined || saturation === undefined || lightness === undefined) return undefined;
    return { rgb: hslToRgb(hue, saturation, lightness), alpha };
  }

  if (/^(?:currentcolor|inherit|initial|revert|revert-layer|unset)$/i.test(value)) return undefined;
  return allowBrowserResolution ? resolveBrowserColor(value) : undefined;
}

function linearChannel(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function readableTextColor(background: string, fallback = 'var(--primary-text-color, #111111)'): string {
  const parsed = parseColor(background);
  if (!parsed || parsed.alpha < 0.999) return fallback;
  const { rgb } = parsed;
  const luminance = 0.2126 * linearChannel(rgb[0]) + 0.7152 * linearChannel(rgb[1]) + 0.0722 * linearChannel(rgb[2]);
  const whiteContrast = 1.05 / (luminance + 0.05);
  const blackContrast = (luminance + 0.05) / 0.05;
  return whiteContrast >= blackContrast ? '#FFFFFF' : '#000000';
}

export function iconForRouteType(routeType?: number): string {
  if (routeType === 0) return 'mdi:tram';
  if (routeType === 3) return 'mdi:bus';
  return 'mdi:transit-connection-variant';
}

export function getRoutePresentation(
  line: string,
  themeColor = '#03A9F4',
  remoteStyles?: RouteStyleCatalog,
): RoutePresentation {
  const key = line.trim().toUpperCase();
  const style = remoteStyles?.[key] ?? (ROUTE_STYLES as Record<string, RouteStyleDefinition>)[key];
  if (style) {
    return {
      background: style.route_color,
      text: style.route_text_color || readableTextColor(style.route_color),
      icon: iconForRouteType(style.route_type),
      routeType: style.route_type,
      known: true,
    };
  }

  return {
    background: `var(--primary-color, ${themeColor})`,
    text: readableTextColor(themeColor),
    icon: iconForRouteType(),
    known: false,
  };
}

export { ROUTE_STYLES_METADATA };
