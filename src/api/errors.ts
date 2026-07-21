export type HeraultApiErrorCode =
  'http' | 'rate-limit' | 'invalid-json' | 'invalid-response' | 'network' | 'timeout' | 'aborted' | 'offline';

export interface HeraultApiErrorOptions {
  status?: number;
  retryAfter?: string;
  cause?: unknown;
}

/** Stable error surface used by the UI to select a helpful state/message. */
export class HeraultApiError extends Error {
  public readonly code: HeraultApiErrorCode;

  public readonly status?: number;

  public readonly retryAfter?: string;

  public readonly cause?: unknown;

  public constructor(code: HeraultApiErrorCode, message: string, options: HeraultApiErrorOptions = {}) {
    super(message);
    this.name = 'HeraultApiError';
    this.code = code;
    this.status = options.status;
    this.retryAfter = options.retryAfter;
    this.cause = options.cause;

    // Required when transpiling built-ins to an older JavaScript target.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const isHeraultApiError = (error: unknown): error is HeraultApiError => error instanceof HeraultApiError;
