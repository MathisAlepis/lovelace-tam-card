import type { RouteStyleCatalog, RouteStyleDefinition } from './route-styles';

export const REMOTE_ROUTE_STYLES_URL =
  'https://raw.githubusercontent.com/MathisAlepis/lovelace-tam-card/main/route-styles.json';
export const REMOTE_ROUTE_STYLES_VERSION = 1;
export const REMOTE_ROUTE_STYLES_TIMEOUT_MS = 15_000;

const MAX_REMOTE_ROUTES = 500;
const MAX_ROUTE_NAME_LENGTH = 64;
const HEX_COLOR = /^#[\dA-F]{6}$/;

export interface RemoteRouteStyleDocument {
  readonly version: typeof REMOTE_ROUTE_STYLES_VERSION;
  readonly routes: RouteStyleCatalog;
}

export type RouteStyleFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface FetchRemoteRouteStylesOptions {
  readonly fetch?: RouteStyleFetch;
  readonly url?: string;
  readonly timeoutMs?: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function isRouteStyle(value: unknown): value is RouteStyleDefinition {
  if (!isRecord(value)) return false;
  return (
    typeof value.route_color === 'string' &&
    HEX_COLOR.test(value.route_color) &&
    typeof value.route_text_color === 'string' &&
    HEX_COLOR.test(value.route_text_color) &&
    Number.isSafeInteger(value.route_type) &&
    Number(value.route_type) >= 0 &&
    Number(value.route_type) <= 10_000
  );
}

export function isRemoteRouteStyleDocument(value: unknown): value is RemoteRouteStyleDocument {
  if (!isRecord(value) || value.version !== REMOTE_ROUTE_STYLES_VERSION || !isRecord(value.routes)) return false;
  const routes = Object.entries(value.routes);
  if (routes.length === 0 || routes.length > MAX_REMOTE_ROUTES) return false;
  return routes.every(
    ([line, style]) =>
      line.length > 0 &&
      line.length <= MAX_ROUTE_NAME_LENGTH &&
      line === line.trim().toUpperCase() &&
      line !== '__PROTO__' &&
      line !== 'CONSTRUCTOR' &&
      line !== 'PROTOTYPE' &&
      isRouteStyle(style),
  );
}

export function parseRemoteRouteStyleDocument(value: unknown): RemoteRouteStyleDocument {
  if (!isRemoteRouteStyleDocument(value)) {
    throw new TypeError('Le catalogue distant des lignes TaM est invalide.');
  }

  const routes: Record<string, RouteStyleDefinition> = Object.create(null) as Record<string, RouteStyleDefinition>;
  for (const [line, style] of Object.entries(value.routes)) {
    routes[line] = {
      route_color: style.route_color,
      route_text_color: style.route_text_color,
      route_type: style.route_type,
    };
  }
  return { version: REMOTE_ROUTE_STYLES_VERSION, routes };
}

export async function fetchRemoteRouteStyles(
  signal: AbortSignal,
  options: FetchRemoteRouteStylesOptions = {},
): Promise<RemoteRouteStyleDocument> {
  const fetchImpl = options.fetch ?? globalThis.fetch;
  if (typeof fetchImpl !== 'function') throw new TypeError('fetch est indisponible dans ce navigateur.');

  const controller = new AbortController();
  const abortFromCaller = (): void => controller.abort();
  if (signal.aborted) controller.abort();
  else signal.addEventListener('abort', abortFromCaller, { once: true });
  const timeout = globalThis.setTimeout(() => controller.abort(), options.timeoutMs ?? REMOTE_ROUTE_STYLES_TIMEOUT_MS);

  try {
    const response = await fetchImpl(options.url ?? REMOTE_ROUTE_STYLES_URL, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Catalogue des lignes indisponible (HTTP ${response.status}).`);
    return parseRemoteRouteStyleDocument(await response.json());
  } finally {
    globalThis.clearTimeout(timeout);
    signal.removeEventListener('abort', abortFromCaller);
  }
}
