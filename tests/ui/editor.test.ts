import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { TamCardConfig } from '../../src/types';

interface CatalogSnapshot {
  value: unknown[];
}

type CatalogGetter = (
  kind: string,
  arguments_: readonly string[],
  loader: (signal: AbortSignal) => Promise<unknown>,
  options?: unknown,
) => Promise<CatalogSnapshot>;

interface SelectorElement extends HTMLElement {
  label?: string;
  selector?: Record<string, unknown>;
  value?: unknown;
}

interface ConfigChangedDetail {
  config: Record<string, unknown>;
}

const catalogHarness = vi.hoisted(() => ({ getCatalog: vi.fn<CatalogGetter>() }));

vi.mock('../../src/data/shared-cache', () => ({
  sharedTamCache: { getCatalog: catalogHarness.getCatalog },
}));

import { TamCardEditor } from '../../src/editor';

const MODERN_CONFIG: TamCardConfig = {
  type: 'custom:tam-card',
  stop: 'PABLO PICASSO',
  line: '3',
  destination: 'LATTES CENTRE',
  direction_id: 1,
  departures: 2,
  refresh_interval: 60,
  background_color: 'auto',
  text_color: 'auto',
  show_line: true,
  show_realtime_badge: true,
  show_absolute_time: false,
  compact: false,
};

async function catalogResponse(kind: string, arguments_: readonly string[]): Promise<CatalogSnapshot> {
  if (kind === 'stops') return { value: ['COMEDIE', 'MOSSON', 'PABLO PICASSO'] };
  if (kind === 'lines') {
    if (arguments_[0] === 'COMEDIE') return { value: ['1', '2'] };
    return { value: ['3', '4'] };
  }
  if (kind === 'journeys') {
    return {
      value: [
        { line: '3', destination: 'LATTES CENTRE', direction_id: 1 },
        { line: '3', destination: 'JUVIGNAC', direction_id: 0 },
        { line: '4', destination: 'GARCIA LORCA', direction_id: 0 },
      ],
    };
  }
  if (kind === 'destinations') {
    if (arguments_[1] === '3') {
      return {
        value: [
          { destination: 'LATTES CENTRE', direction_id: 1 },
          { destination: 'JUVIGNAC', direction_id: 0 },
        ],
      };
    }
    if (arguments_[1] === '4') return { value: [{ destination: 'GARCIA LORCA', direction_id: 0 }] };
    return { value: [{ destination: 'ODYSSEUM', direction_id: 1 }] };
  }
  throw new Error(`Unexpected catalog ${kind}`);
}

function mountEditor(): TamCardEditor {
  // Construct the imported class directly. Vitest can reuse the ESM module
  // across isolated happy-dom windows, whose CustomElementRegistry is new.
  const editor = new TamCardEditor();
  document.body.append(editor);
  return editor;
}

function allSelectors(editor: TamCardEditor): SelectorElement[] {
  return [...(editor.shadowRoot?.querySelectorAll('ha-selector') ?? [])] as SelectorElement[];
}

function findSelector(editor: TamCardEditor, label: string): SelectorElement | undefined {
  return allSelectors(editor).find((selector) => selector.label === label);
}

async function waitForSelector(editor: TamCardEditor, label: string): Promise<SelectorElement> {
  await vi.waitFor(() => {
    expect(findSelector(editor, label)).toBeDefined();
  });
  const selector = findSelector(editor, label);
  if (!selector) throw new Error(`Selector “${label}” was not rendered.`);
  return selector;
}

function valueChanged(value: unknown): CustomEvent<{ value: unknown }> {
  return new CustomEvent('value-changed', {
    detail: { value },
    bubbles: true,
    composed: true,
  });
}

function collectConfigEvents(editor: TamCardEditor): CustomEvent<ConfigChangedDetail>[] {
  const events: CustomEvent<ConfigChangedDetail>[] = [];
  editor.addEventListener('config-changed', (event) => events.push(event as CustomEvent<ConfigChangedDetail>));
  return events;
}

function lastConfig(events: readonly CustomEvent<ConfigChangedDetail>[]): Record<string, unknown> {
  const event = events.at(-1);
  if (!event) throw new Error('The editor did not emit config-changed.');
  return event.detail.config;
}

describe('TAM card editor UI', () => {
  beforeEach(() => {
    catalogHarness.getCatalog.mockReset();
    catalogHarness.getCatalog.mockImplementation(catalogResponse);
  });

  it('migrates a legacy editor value and only emits the canonical v4 format', async () => {
    const editor = mountEditor();
    const events = collectConfigEvents(editor);

    editor.setConfig({
      type: 'custom:tam-card',
      stop: 'Pablo Picasso',
      direction: 'lattes centre',
      backgroundColor: '#010203',
      textColor: '#fefefe',
    });

    await vi.waitFor(() => expect(events).toHaveLength(1));
    const config = lastConfig(events);

    expect(config).toMatchObject({
      type: 'custom:tam-card',
      stop: 'PABLO PICASSO',
      line: '3',
      destination: 'LATTES CENTRE',
      departures: 2,
      refresh_interval: 60,
      background_color: '#010203',
      text_color: '#fefefe',
      show_line: true,
      show_realtime_badge: true,
      show_absolute_time: false,
      compact: false,
    });
    expect(config).not.toHaveProperty('direction');
    expect(config).not.toHaveProperty('direction_id');
    expect(config).not.toHaveProperty('backgroundColor');
    expect(config).not.toHaveProperty('textColor');
    const journeyCalls = catalogHarness.getCatalog.mock.calls.filter(([kind]) => kind === 'journeys');
    expect(journeyCalls).toHaveLength(1);
    expect(journeyCalls[0]?.[1]).toEqual(['PABLO PICASSO']);
    expect(catalogHarness.getCatalog.mock.calls.filter(([kind]) => kind === 'destinations')).toHaveLength(0);
  });

  it('resets destination and direction when the selected line changes', async () => {
    const editor = mountEditor();
    const events = collectConfigEvents(editor);
    editor.setConfig(MODERN_CONFIG);
    const line = await waitForSelector(editor, 'Ligne');

    let propagated: CustomEvent<ConfigChangedDetail> | undefined;
    const observe = (event: Event): void => {
      propagated = event as CustomEvent<ConfigChangedDetail>;
    };
    document.addEventListener('config-changed', observe, { once: true });
    line.dispatchEvent(valueChanged('4'));

    const config = lastConfig(events);
    expect(config).toMatchObject({ stop: 'PABLO PICASSO', line: '4' });
    expect(config).not.toHaveProperty('destination');
    expect(config).not.toHaveProperty('direction_id');
    expect(propagated?.bubbles).toBe(true);
    expect(propagated?.composed).toBe(true);
    expect(
      catalogHarness.getCatalog.mock.calls.some(
        ([kind, arguments_]) => kind === 'destinations' && arguments_[0] === 'PABLO PICASSO' && arguments_[1] === '4',
      ),
    ).toBe(true);
  });

  it('resets line, destination and direction when the selected stop changes', async () => {
    const editor = mountEditor();
    const events = collectConfigEvents(editor);
    editor.setConfig(MODERN_CONFIG);
    const stop = await waitForSelector(editor, 'Arrêt');

    stop.dispatchEvent(valueChanged('COMEDIE'));

    const config = lastConfig(events);
    expect(config).toMatchObject({ stop: 'COMEDIE' });
    expect(config).not.toHaveProperty('line');
    expect(config).not.toHaveProperty('destination');
    expect(config).not.toHaveProperty('direction_id');
    expect(
      catalogHarness.getCatalog.mock.calls.some(
        ([kind, arguments_]) => kind === 'lines' && arguments_[0] === 'COMEDIE',
      ),
    ).toBe(true);
  });

  it('removes direction_id when manual direction is reset to automatic', async () => {
    const editor = mountEditor();
    const events = collectConfigEvents(editor);
    editor.setConfig(MODERN_CONFIG);

    await vi.waitFor(() => {
      const manualButton = [...(editor.shadowRoot?.querySelectorAll('button') ?? [])].find(
        (button) => button.textContent?.trim() === 'Saisie manuelle',
      );
      expect(manualButton).toBeDefined();
    });
    const manualButton = [...(editor.shadowRoot?.querySelectorAll('button') ?? [])].find(
      (button) => button.textContent?.trim() === 'Saisie manuelle',
    ) as HTMLButtonElement;
    manualButton.click();

    const direction = await waitForSelector(editor, 'Sens');
    expect(direction.value).toBe('1');
    const select = direction.selector?.select as { options?: unknown[] } | undefined;
    expect(select?.options).toEqual(expect.arrayContaining([expect.objectContaining({ value: 'auto' })]));
    direction.dispatchEvent(valueChanged('auto'));

    expect(lastConfig(events)).not.toHaveProperty('direction_id');
  });

  it('exposes loading feedback while a catalog request is pending', async () => {
    let resolveStops: ((snapshot: CatalogSnapshot) => void) | undefined;
    catalogHarness.getCatalog.mockImplementationOnce(
      async () =>
        new Promise<CatalogSnapshot>((resolve) => {
          resolveStops = resolve;
        }),
    );
    const editor = mountEditor();

    editor.setConfig({ type: 'custom:tam-card', stop: '' });
    await editor.updateComplete;

    expect(editor.shadowRoot?.querySelector('[role="status"]')?.textContent).toBe('Chargement des arrêts…');
    resolveStops?.({ value: ['PABLO PICASSO'] });
    await vi.waitFor(() => expect(editor.shadowRoot?.querySelector('[role="status"]')).toBeNull());
  });

  it('falls back to manual selectors on catalog failure and offers a working retry', async () => {
    catalogHarness.getCatalog.mockRejectedValueOnce(new Error('network unavailable'));
    const editor = mountEditor();
    editor.setConfig({ type: 'custom:tam-card', stop: '' });

    await vi.waitFor(() => {
      expect(editor.shadowRoot?.querySelector('[role="alert"]')?.textContent).toContain(
        'Le catalogue n’a pas pu être chargé',
      );
    });
    expect(findSelector(editor, 'Arrêt')?.selector).toEqual({ text: { type: 'text' } });

    const retry = [...(editor.shadowRoot?.querySelectorAll('button') ?? [])].find(
      (button) => button.textContent?.trim() === 'Réessayer',
    ) as HTMLButtonElement | undefined;
    expect(retry).toBeDefined();
    retry?.click();

    await vi.waitFor(() => expect(editor.shadowRoot?.querySelector('[role="alert"]')).toBeNull());
    expect(catalogHarness.getCatalog).toHaveBeenCalledTimes(2);
    await vi.waitFor(() => {
      expect(findSelector(editor, 'Arrêt')?.selector).toMatchObject({ select: { custom_value: true } });
    });
  });
});
