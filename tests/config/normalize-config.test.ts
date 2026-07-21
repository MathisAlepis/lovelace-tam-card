import { describe, expect, it } from 'vitest';

import { fallbackSupportsCssColor, isValidCssColor, normalizeConfig } from '../../src/config/normalize-config';

const pureCssSupports = (_property: string, value: string): boolean => fallbackSupportsCssColor(value);

describe('normalizeConfig', () => {
  it('normalizes a modern configuration and keeps direction_id distinct', () => {
    expect(
      normalizeConfig(
        {
          type: 'custom:tam-card',
          stop: ' Pablo Picasso ',
          display_mode: 'destination',
          line: 3,
          destination: ' Lattes Centre ',
          direction_id: '1',
          departures: 4,
          departures_per_destination: 3,
          refresh_interval: 90,
          background_color: '#102030',
          text_color: 'white',
          show_line: false,
          show_realtime_badge: false,
          show_absolute_time: true,
          compact: true,
        },
        { cssSupports: pureCssSupports },
      ),
    ).toEqual({
      type: 'custom:tam-card',
      stop: 'Pablo Picasso',
      display_mode: 'destination',
      line: '3',
      destination: 'Lattes Centre',
      direction_id: 1,
      departures: 4,
      departures_per_destination: 3,
      refresh_interval: 90,
      background_color: '#102030',
      text_color: 'white',
      show_line: false,
      show_realtime_badge: false,
      show_absolute_time: true,
      compact: true,
    });
  });

  it('migrates the historical direction and camelCase color aliases', () => {
    const normalized = normalizeConfig(
      {
        type: 'custom:tam-card',
        stop: 'Pablo Picasso',
        direction: 'Lattes Centre',
        direction_id: 0,
        backgroundColor: 'rgb(10, 20, 30)',
        textColor: '#fff',
      },
      { cssSupports: pureCssSupports },
    );

    expect(normalized).toMatchObject({
      stop: 'Pablo Picasso',
      display_mode: 'destination',
      destination: 'Lattes Centre',
      direction_id: 0,
      background_color: 'rgb(10, 20, 30)',
      text_color: '#fff',
    });
    expect(normalized).not.toHaveProperty('direction');
  });

  it('never treats legacy direction as the numeric direction_id', () => {
    expect(normalizeConfig({ stop: 'A', direction: 1 })).not.toHaveProperty('direction_id');
    expect(normalizeConfig({ stop: 'A', direction: 'B' })).toMatchObject({ destination: 'B' });
  });

  it('preserves mixed-case canonical catalog labels', () => {
    expect(normalizeConfig({ stop: 'Oxford', destination: 'Uppsala' })).toMatchObject({
      stop: 'Oxford',
      destination: 'Uppsala',
    });
  });

  it('applies defaults and bounds numeric settings', () => {
    expect(normalizeConfig({ stop: 'A', destination: 'B' })).toMatchObject({
      display_mode: 'destination',
      departures: 2,
      departures_per_destination: 1,
      refresh_interval: 60,
      background_color: 'auto',
      text_color: 'auto',
      show_line: true,
      show_realtime_badge: true,
      show_absolute_time: false,
      compact: false,
    });
    expect(normalizeConfig({ departures: -50, refresh_interval: 2 })).toMatchObject({
      departures: 1,
      refresh_interval: 30,
    });
    expect(normalizeConfig({ departures: 99, refresh_interval: 999 })).toMatchObject({
      departures: 5,
      refresh_interval: 300,
    });
    expect(normalizeConfig({ departures: null, refresh_interval: 'oops' })).toMatchObject({
      departures: 2,
      refresh_interval: 60,
    });
    expect(normalizeConfig({ departures_per_destination: -5 })).toMatchObject({
      departures_per_destination: 1,
    });
    expect(normalizeConfig({ departures_per_destination: 99 })).toMatchObject({
      departures_per_destination: 3,
    });
  });

  it('normalizes the opt-in all-destinations mode without changing legacy defaults', () => {
    expect(
      normalizeConfig({
        stop: 'Pablo Picasso',
        line: '3',
        display_mode: 'all_destinations',
        destination: 'Lattes Centre',
        direction: 'Juvignac',
        direction_id: 1,
      }),
    ).toMatchObject({
      stop: 'Pablo Picasso',
      line: '3',
      display_mode: 'all_destinations',
      direction_id: 1,
      departures_per_destination: 1,
    });
    expect(
      normalizeConfig({ stop: 'A', line: '3', display_mode: 'all_destinations', destination: 'B' }),
    ).not.toHaveProperty('destination');
    expect(normalizeConfig({ display_mode: 'unknown' })).toMatchObject({ display_mode: 'destination' });
  });

  it('ignores invalid colors using an injectable pure validator', () => {
    expect(
      normalizeConfig(
        { background_color: 'red; display: none', text_color: 'definitely-not-a-color' },
        { cssSupports: pureCssSupports },
      ),
    ).toMatchObject({ background_color: 'auto', text_color: 'auto' });
    expect(normalizeConfig({ background_color: 'currentColor' }, { cssSupports: pureCssSupports })).toMatchObject({
      background_color: 'auto',
    });
  });

  it('offers a DOM-free CSS color fallback', () => {
    expect(fallbackSupportsCssColor('#abc8')).toBe(true);
    expect(fallbackSupportsCssColor('rebeccapurple')).toBe(true);
    expect(fallbackSupportsCssColor('rgb(10 20 30 / 50%)')).toBe(true);
    expect(fallbackSupportsCssColor('hsl(120, 50%, 25%)')).toBe(true);
    expect(fallbackSupportsCssColor('var(--primary-color)')).toBe(true);
    expect(fallbackSupportsCssColor('#1234567')).toBe(false);
    expect(fallbackSupportsCssColor('rgb(999, 0, 0)')).toBe(false);
    expect(fallbackSupportsCssColor('red; background: black')).toBe(false);
    expect(isValidCssColor('made-up', pureCssSupports)).toBe(false);
  });
});
