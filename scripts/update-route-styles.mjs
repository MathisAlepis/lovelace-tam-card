import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const DOWNLOAD_TIMEOUT_MS = 30_000;
const DEFAULT_TYPESCRIPT_OUTPUT = fileURLToPath(
  new globalThis.URL('../src/data/route-styles.generated.ts', import.meta.url),
);
const DEFAULT_JSON_OUTPUT = fileURLToPath(new globalThis.URL('../route-styles.json', import.meta.url));
const SOURCES = [
  {
    name: 'GTFS urbain',
    url: 'https://data.montpellier3m.fr/GTFS/Urbain/GTFS.zip',
  },
  {
    name: 'GTFS suburbain',
    url: 'https://data.montpellier3m.fr/GTFS/Suburbain/GTFS.zip',
  },
];

function printHelp() {
  console.info(`Usage: node scripts/update-route-styles.mjs [options]

Downloads the official Montpellier GTFS archives and regenerates the committed
route style table. The urban feed has priority when both feeds define a line.

Options:
  --format typescript|json   Output format (default: typescript)
  --output FILE              Output file (default depends on the format)
  --help                     Show this help`);
}

function parseArguments(argv) {
  const options = {
    format: 'typescript',
    output: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help') {
      printHelp();
      process.exit(0);
    }

    if (argument !== '--output' && argument !== '--format') {
      throw new Error(`Unknown option: ${argument}`);
    }

    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${argument}`);
    }
    index += 1;

    if (argument === '--output') {
      options.output = resolve(value);
    } else if (value === 'typescript' || value === 'json') {
      options.format = value;
    } else {
      throw new Error(`Unsupported format: ${value}`);
    }
  }

  options.output ??= options.format === 'json' ? DEFAULT_JSON_OUTPUT : DEFAULT_TYPESCRIPT_OUTPUT;
  return options;
}

async function downloadSource(source) {
  let response;
  try {
    response = await globalThis.fetch(source.url, {
      headers: { 'user-agent': 'lovelace-tam-card route style generator' },
      signal: globalThis.AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    });
  } catch (error) {
    throw new Error(`Unable to download ${source.name} from ${source.url}`, { cause: error });
  }

  if (!response.ok) {
    throw new Error(`Unable to download ${source.name}: HTTP ${response.status}`);
  }

  const archive = Buffer.from(await response.arrayBuffer());
  const routes = extractZipEntry(archive, 'routes.txt');
  return {
    ...source,
    routes,
    routesSha256: createHash('sha256').update(routes).digest('hex'),
  };
}

function findEndOfCentralDirectory(archive) {
  const signature = 0x06054b50;
  const minimumOffset = Math.max(0, archive.length - 65_557);

  for (let offset = archive.length - 22; offset >= minimumOffset; offset -= 1) {
    if (archive.readUInt32LE(offset) === signature) {
      return offset;
    }
  }

  throw new Error('Invalid ZIP archive: end of central directory not found');
}

function extractZipEntry(archive, expectedName) {
  const endOffset = findEndOfCentralDirectory(archive);
  const entryCount = archive.readUInt16LE(endOffset + 10);
  let centralOffset = archive.readUInt32LE(endOffset + 16);
  if (entryCount === 0xffff || centralOffset === 0xffffffff) {
    throw new Error('ZIP64 archives are not supported');
  }

  for (let index = 0; index < entryCount; index += 1) {
    if (archive.readUInt32LE(centralOffset) !== 0x02014b50) {
      throw new Error('Invalid ZIP archive: malformed central directory');
    }

    const flags = archive.readUInt16LE(centralOffset + 8);
    const compressionMethod = archive.readUInt16LE(centralOffset + 10);
    const compressedSize = archive.readUInt32LE(centralOffset + 20);
    const uncompressedSize = archive.readUInt32LE(centralOffset + 24);
    const fileNameLength = archive.readUInt16LE(centralOffset + 28);
    const extraLength = archive.readUInt16LE(centralOffset + 30);
    const commentLength = archive.readUInt16LE(centralOffset + 32);
    const localOffset = archive.readUInt32LE(centralOffset + 42);
    const fileNameStart = centralOffset + 46;
    const fileName = archive.subarray(fileNameStart, fileNameStart + fileNameLength).toString('utf8');

    if (fileName.split('/').at(-1)?.toLowerCase() === expectedName.toLowerCase()) {
      if ((flags & 0x1) !== 0) {
        throw new Error(`${expectedName} is encrypted`);
      }
      if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localOffset === 0xffffffff) {
        throw new Error('ZIP64 archives are not supported');
      }
      if (archive.readUInt32LE(localOffset) !== 0x04034b50) {
        throw new Error(`Invalid ZIP archive: local header missing for ${expectedName}`);
      }

      const localNameLength = archive.readUInt16LE(localOffset + 26);
      const localExtraLength = archive.readUInt16LE(localOffset + 28);
      const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = archive.subarray(dataOffset, dataOffset + compressedSize);
      let content;

      if (compressionMethod === 0) {
        content = compressed;
      } else if (compressionMethod === 8) {
        content = inflateRawSync(compressed);
      } else {
        throw new Error(`Unsupported ZIP compression method ${compressionMethod} for ${expectedName}`);
      }

      if (content.length !== uncompressedSize) {
        throw new Error(`Invalid ZIP archive: unexpected size for ${expectedName}`);
      }

      return content;
    }

    centralOffset = fileNameStart + fileNameLength + extraLength + commentLength;
  }

  throw new Error(`${expectedName} was not found in the GTFS archive`);
}

function parseCsv(content) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (quoted) {
      if (character === '"') {
        if (content[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n') {
      row.push(field.replace(/\r$/, ''));
      if (row.some((value) => value.length > 0)) {
        rows.push(row);
      }
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) {
    throw new Error('Invalid CSV: unterminated quoted field');
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }

  return rows;
}

function parseRoutes(source) {
  const rows = parseCsv(source.routes.toString('utf8'));
  const headers = rows.shift()?.map((header) => header.replace(/^\uFEFF/, '').trim());
  if (!headers) {
    throw new Error(`${source.name} routes.txt is empty`);
  }

  const indexes = Object.fromEntries(headers.map((header, index) => [header, index]));
  for (const required of ['route_short_name', 'route_color', 'route_text_color', 'route_type']) {
    if (indexes[required] === undefined) {
      throw new Error(`${source.name} routes.txt does not contain ${required}`);
    }
  }

  return rows.map((row, rowIndex) => {
    const routeShortName = row[indexes.route_short_name]?.trim();
    const routeColor = row[indexes.route_color]?.trim().toUpperCase();
    const routeTextColor = row[indexes.route_text_color]?.trim().toUpperCase();
    const routeType = Number(row[indexes.route_type]?.trim());

    if (!routeShortName) {
      throw new Error(`${source.name} routes.txt row ${rowIndex + 2} has no route_short_name`);
    }
    if (!/^[0-9A-F]{6}$/.test(routeColor) || !/^[0-9A-F]{6}$/.test(routeTextColor)) {
      throw new Error(`${source.name} route ${routeShortName} has an invalid color`);
    }
    if (!Number.isSafeInteger(routeType) || routeType < 0) {
      throw new Error(`${source.name} route ${routeShortName} has an invalid route_type`);
    }

    return {
      routeShortName,
      routeColor: `#${routeColor}`,
      routeTextColor: `#${routeTextColor}`,
      routeType,
    };
  });
}

function compareRouteNames(left, right) {
  const leftNumeric = /^\d+$/.test(left);
  const rightNumeric = /^\d+$/.test(right);

  if (leftNumeric && rightNumeric) {
    const leftValue = BigInt(left);
    const rightValue = BigInt(right);
    if (leftValue !== rightValue) return leftValue < rightValue ? -1 : 1;
    return left.length - right.length || (left < right ? -1 : left > right ? 1 : 0);
  }
  if (leftNumeric !== rightNumeric) {
    return leftNumeric ? -1 : 1;
  }
  return left < right ? -1 : left > right ? 1 : 0;
}

function mergeRoutes(sources) {
  const routes = new Map();
  let ignoredDuplicates = 0;

  for (const source of sources) {
    for (const route of parseRoutes(source)) {
      if (routes.has(route.routeShortName)) {
        ignoredDuplicates += 1;
        continue;
      }
      routes.set(route.routeShortName, route);
    }
  }

  return {
    ignoredDuplicates,
    routes: [...routes.values()].sort((left, right) => compareRouteNames(left.routeShortName, right.routeShortName)),
  };
}

function renderGeneratedFile(sources, routes) {
  const metadataSources = sources.map((source) => ({
    name: source.name,
    url: source.url,
    routes_sha256: source.routesSha256,
  }));
  const metadata = {
    duplicate_policy: 'urbain-first',
    sources: metadataSources,
  };
  const entries = routes
    .map(
      (route) =>
        `  ${JSON.stringify(route.routeShortName)}: { route_color: ${JSON.stringify(route.routeColor)}, route_text_color: ${JSON.stringify(route.routeTextColor)}, route_type: ${route.routeType} },`,
    )
    .join('\n');

  return `/**
 * Generated by scripts/update-route-styles.mjs from official Montpellier GTFS data.
 * Do not edit manually. This compact derivative is distributed under ODbL; see DATA_LICENSE.md.
 */

export const ROUTE_STYLES_METADATA = ${JSON.stringify(metadata, null, 2)} as const;

export const ROUTE_STYLES = {
${entries}
} as const;
`;
}

function renderJsonCatalog(routes) {
  return `${JSON.stringify(
    {
      version: 1,
      routes: Object.fromEntries(
        routes.map((route) => [
          route.routeShortName.trim().toUpperCase(),
          {
            route_color: route.routeColor,
            route_text_color: route.routeTextColor,
            route_type: route.routeType,
          },
        ]),
      ),
    },
    null,
    2,
  )}\n`;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const downloadedSources = [];

  // Download sequentially to avoid putting unnecessary pressure on the public server.
  for (const source of SOURCES) {
    console.info(`Downloading ${source.name}…`);
    downloadedSources.push(await downloadSource(source));
  }

  const { ignoredDuplicates, routes } = mergeRoutes(downloadedSources);
  if (routes.length === 0) {
    throw new Error('No route styles were found');
  }

  const generated =
    options.format === 'json' ? renderJsonCatalog(routes) : renderGeneratedFile(downloadedSources, routes);
  await mkdir(dirname(options.output), { recursive: true });
  await writeFile(options.output, generated, 'utf8');
  console.info(
    `Wrote ${routes.length} route styles as ${options.format} to ${options.output} (${ignoredDuplicates} duplicate definitions ignored).`,
  );
}

await main();
