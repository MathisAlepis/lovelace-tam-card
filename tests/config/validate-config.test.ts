import { describe, expect, it } from 'vitest';

import {
  assertValidConfig,
  inferLineFromCandidates,
  isConfigComplete,
  needsLineInference,
  resolveConfigLine,
  TamConfigError,
  validateConfig,
} from '../../src/config/validate-config';
import type { LineInferenceError } from '../../src/config/validate-config';
import { normalizeConfig } from '../../src/config/normalize-config';

describe('configuration validation and line inference', () => {
  it('reports incomplete and mistyped configurations clearly', () => {
    expect(validateConfig(null)).toMatchObject({
      valid: false,
      errors: expect.arrayContaining([expect.objectContaining({ code: 'invalid-config' })]),
    });
    expect(validateConfig({ type: 'custom:wrong', stop: 'A' })).toMatchObject({
      valid: false,
      errors: expect.arrayContaining([
        expect.objectContaining({ code: 'invalid-type' }),
        expect.objectContaining({ code: 'missing-destination' }),
      ]),
    });
    expect(() => assertValidConfig({})).toThrow(TamConfigError);
    expect(validateConfig({ stop: 'A', destination: 'B' }).errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'invalid-type' })]),
    );
  });

  it('allows a valid legacy configuration to continue to line inference', () => {
    const result = validateConfig({
      type: 'custom:tam-card',
      stop: 'Pablo Picasso',
      direction: 'Lattes Centre',
    });

    expect(result.valid).toBe(true);
    expect(needsLineInference(result.config)).toBe(true);
    expect(isConfigComplete(result.config)).toBe(false);
  });

  it('resolves a single catalog line without mutating the config', () => {
    const config = normalizeConfig({ stop: 'Pablo Picasso', destination: 'Lattes Centre' });
    const resolved = resolveConfigLine(config, [3, '3', null]);

    expect(resolved).not.toBe(config);
    expect(resolved.line).toBe('3');
    expect(isConfigComplete(resolved)).toBe(true);
  });

  it('returns an explicitly configured line without consulting candidates', () => {
    const config = normalizeConfig({ stop: 'A', destination: 'B', line: '4' });
    expect(resolveConfigLine(config, ['1', '2'])).toBe(config);
  });

  it('throws a clear ambiguity error listing candidate lines', () => {
    expect(() => inferLineFromCandidates(['15', '3', '3'], { stop: 'A', destination: 'B' })).toThrowError(
      expect.objectContaining<Partial<LineInferenceError>>({
        code: 'ambiguous-line',
        candidates: ['3', '15'],
        message: expect.stringContaining('Plusieurs lignes'),
      }),
    );
  });

  it('de-duplicates catalog candidates case-insensitively', () => {
    expect(inferLineFromCandidates(['Navette', 'navette'], { stop: 'A', destination: 'B' })).toBe('Navette');
  });

  it('distinguishes a missing catalog match from ambiguity', () => {
    expect(() => inferLineFromCandidates([], { stop: 'A', destination: 'B' })).toThrowError(
      expect.objectContaining<Partial<LineInferenceError>>({ code: 'line-not-found', candidates: [] }),
    );
  });
});
