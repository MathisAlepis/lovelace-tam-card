import type { NormalizedTamCardConfig } from '../types';
import { TAM_CARD_TYPE } from './defaults';
import { normalizeConfig, type NormalizeConfigOptions } from './normalize-config';

export type ConfigIssueCode = 'invalid-config' | 'invalid-type' | 'missing-stop' | 'missing-destination';

export interface ConfigIssue {
  code: ConfigIssueCode;
  field: 'config' | 'type' | 'stop' | 'destination';
  message: string;
}

export interface ConfigValidationResult {
  valid: boolean;
  config: NormalizedTamCardConfig;
  errors: ConfigIssue[];
}

export class TamConfigError extends Error {
  public readonly issues: readonly ConfigIssue[];

  public constructor(message: string, issues: readonly ConfigIssue[] = []) {
    super(message);
    this.name = 'TamConfigError';
    this.issues = issues;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const validateConfig = (input: unknown, options: NormalizeConfigOptions = {}): ConfigValidationResult => {
  const config = normalizeConfig(input, options);
  const errors: ConfigIssue[] = [];

  if (!isRecord(input)) {
    errors.push({
      code: 'invalid-config',
      field: 'config',
      message: 'La configuration de TAM Card doit être un objet.',
    });
  } else if (input.type !== TAM_CARD_TYPE) {
    errors.push({
      code: 'invalid-type',
      field: 'type',
      message: `Le type de carte doit être « ${TAM_CARD_TYPE} ».`,
    });
  }

  if (!config.stop) {
    errors.push({
      code: 'missing-stop',
      field: 'stop',
      message: 'Sélectionnez un arrêt.',
    });
  }
  if (!config.destination) {
    errors.push({
      code: 'missing-destination',
      field: 'destination',
      message: 'Sélectionnez une destination.',
    });
  }

  return { valid: errors.length === 0, config, errors };
};

export const assertValidConfig = (input: unknown, options: NormalizeConfigOptions = {}): NormalizedTamCardConfig => {
  const result = validateConfig(input, options);
  if (!result.valid) {
    throw new TamConfigError(result.errors.map((issue) => issue.message).join(' '), result.errors);
  }
  return result.config;
};

export const isConfigComplete = (config: NormalizedTamCardConfig): boolean =>
  Boolean(config.stop && config.line && config.destination);

export const needsLineInference = (config: NormalizedTamCardConfig): boolean =>
  Boolean(config.stop && config.destination && !config.line);

export type LineInferenceErrorCode = 'line-not-found' | 'ambiguous-line';

export class LineInferenceError extends TamConfigError {
  public readonly code: LineInferenceErrorCode;

  public readonly candidates: readonly string[];

  public constructor(code: LineInferenceErrorCode, message: string, candidates: readonly string[]) {
    super(message);
    this.name = 'LineInferenceError';
    this.code = code;
    this.candidates = candidates;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const normalizeLineCandidates = (candidates: readonly unknown[]): string[] => {
  const normalized = candidates
    .map((candidate) => {
      if (typeof candidate === 'number' && Number.isFinite(candidate)) {
        return String(candidate);
      }
      return typeof candidate === 'string' ? candidate.trim() : '';
    })
    .filter(Boolean);
  const unique = new Map<string, string>();
  for (const line of normalized) {
    const key = line.normalize('NFKC').toLocaleUpperCase('fr-FR');
    if (!unique.has(key)) unique.set(key, line);
  }
  return [...unique.values()].sort((left, right) =>
    left.localeCompare(right, 'fr', { numeric: true, sensitivity: 'base' }),
  );
};

/**
 * Resolve an already-filtered catalog list. The async catalog traversal remains
 * in the editor/controller; this decision function is deterministic and tested.
 */
export const inferLineFromCandidates = (
  candidates: readonly unknown[],
  context: Pick<NormalizedTamCardConfig, 'stop' | 'destination'>,
): string => {
  const lines = normalizeLineCandidates(candidates);
  if (lines.length === 1) {
    return lines[0];
  }

  const journey = `${context.stop} → ${context.destination ?? 'destination inconnue'}`;
  if (lines.length === 0) {
    throw new LineInferenceError(
      'line-not-found',
      `Aucune ligne ne correspond à ${journey}. Renseignez « line » dans l'éditeur.`,
      lines,
    );
  }
  throw new LineInferenceError(
    'ambiguous-line',
    `Plusieurs lignes (${lines.join(', ')}) correspondent à ${journey}. Sélectionnez une ligne dans l'éditeur.`,
    lines,
  );
};

export const resolveConfigLine = (
  config: NormalizedTamCardConfig,
  candidates: readonly unknown[],
): NormalizedTamCardConfig => {
  if (config.line) {
    return config;
  }
  return {
    ...config,
    line: inferLineFromCandidates(candidates, config),
  };
};

export const resolveLineFromCatalog = resolveConfigLine;
