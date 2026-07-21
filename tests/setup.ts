import { afterEach, vi } from 'vitest';

if (typeof CSS !== 'undefined' && typeof CSS.supports !== 'function') {
  CSS.supports = (_property: string, value?: string): boolean => Boolean(value ?? _property);
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  localStorage.clear();
  document.body.replaceChildren();
});
