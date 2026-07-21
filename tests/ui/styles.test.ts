import { describe, expect, it } from 'vitest';

import { readableTextColor } from '../../src/data/route-styles';
import { cardStyles } from '../../src/styles';

describe('TAM card responsive CSS contracts', () => {
  const css = cardStyles.cssText;

  it('uses Home Assistant surface and text variables for light and dark themes', () => {
    expect(css).toContain('var(--ha-card-background, var(--card-background-color, #fff))');
    expect(css).toContain('var(--tam-text, var(--primary-text-color, #111))');
    expect(css).toContain('var(--ha-card-border-color, transparent)');
    expect(css).toContain('var(--primary-color, #03a9f4)');
  });

  it('moves departures below the journey at mobile container widths', () => {
    expect(css).toContain('@container (max-width: 480px)');
    expect(css).toMatch(/@container \(max-width: 480px\)[\s\S]*?\.departures\s*{[\s\S]*?grid-column:\s*1 \/ -1/);
    expect(css).toMatch(/@container \(max-width: 480px\)[\s\S]*?\.departure\s*{[\s\S]*?flex:\s*1 1 0/);
    expect(css).toContain('@container (max-width: 330px)');
  });

  it('uses a separate responsive two-column destination overview', () => {
    expect(css).toMatch(/\.destination-row\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) auto/);
    expect(css).toMatch(/\.destination-name > span:last-child\s*\{[\s\S]*?text-overflow:\s*ellipsis/);
    expect(css).toMatch(
      /@container \(max-width: 480px\)[\s\S]*?\.destination-row\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/,
    );
    expect(css).toMatch(/\.destination-time \+ \.destination-time\s*\{[\s\S]*?border-left/);
  });

  it('disables every decorative loading and approaching animation when motion is reduced', () => {
    expect(css).toContain('animation: tam-approaching-blink 1.2s steps(1, end) infinite');
    expect(css).toContain('animation: tam-approaching-label-blink 1.2s steps(1, end) infinite');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.approaching-dot,[\s\S]*?\.skeleton\s*{[\s\S]*?animation:\s*none/,
    );
  });

  it('derives readable automatic text from HSL and named background colors', () => {
    expect(readableTextColor('hsl(0 0% 100%)')).toBe('#000000');
    expect(readableTextColor('navy')).toBe('#FFFFFF');
  });
});
