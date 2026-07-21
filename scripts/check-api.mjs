import { strict as assert } from 'node:assert';

const ENDPOINT = 'https://www.herault-data.fr/api/explore/v2.1/catalog/datasets/tam_mmm_tpsreel/records';

function literal(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function textEquality(field, value) {
  return `lower(${field}) = ${literal(String(value).trim().toLocaleLowerCase('fr-FR'))}`;
}

function sameText(left, right) {
  return String(left).localeCompare(String(right), 'fr', { sensitivity: 'base' }) === 0;
}

async function request(parameters) {
  const url = new globalThis.URL(ENDPOINT);
  url.search = new globalThis.URLSearchParams(parameters).toString();
  const response = await globalThis.fetch(url, {
    headers: { Accept: 'application/json' },
    signal: globalThis.AbortSignal.timeout(10_000),
  });
  assert.equal(response.ok, true, `${url}: HTTP ${response.status}`);
  assert.equal(response.headers.get('access-control-allow-origin'), '*', 'CORS wildcard header is missing');
  const body = await response.json();
  assert.equal(Array.isArray(body.results), true, `${url}: results is not an array`);
  return body;
}

const stop = 'PABLO PICASSO';
const line = '3';
const destination = 'LATTES CENTRE';

const [stops, lines, destinations, journeys, departures] = await Promise.all([
  request({ select: 'stop_name', group_by: 'stop_name', order_by: 'stop_name ASC', limit: '20000' }),
  request({
    select: 'route_short_name',
    where: textEquality('stop_name', stop),
    group_by: 'route_short_name',
    order_by: 'route_short_name ASC',
    limit: '20000',
  }),
  request({
    select: 'trip_headsign,direction_id',
    where: `${textEquality('stop_name', stop)} AND route_short_name = ${line}`,
    group_by: 'trip_headsign,direction_id',
    order_by: 'trip_headsign ASC',
    limit: '20000',
  }),
  request({
    select: 'route_short_name,trip_headsign,direction_id',
    where: textEquality('stop_name', stop),
    group_by: 'route_short_name,trip_headsign,direction_id',
    order_by: 'route_short_name ASC,trip_headsign ASC',
    limit: '20000',
  }),
  request({
    select:
      'stop_name,route_short_name,trip_headsign,direction_id,departure_time,is_theorical,delay_sec,course_sae,stop_coordinates',
    where: `${textEquality('stop_name', stop)} AND route_short_name = ${line} AND direction_id = 1 AND ${textEquality('trip_headsign', destination)} AND delay_sec >= 0`,
    order_by: 'delay_sec ASC',
    limit: '5',
  }),
]);

assert.equal(
  stops.results.some((row) => sameText(row.stop_name, stop)),
  true,
  `${stop} is missing from the stop catalogue`,
);
assert.equal(
  lines.results.some((row) => String(row.route_short_name) === line),
  true,
  `Line ${line} is missing at ${stop}`,
);
assert.equal(
  destinations.results.some((row) => sameText(row.trip_headsign, destination) && Number(row.direction_id) === 1),
  true,
  `${destination} / direction 1 is missing at ${stop}`,
);
assert.equal(
  journeys.results.some(
    (row) =>
      String(row.route_short_name) === line &&
      sameText(row.trip_headsign, destination) &&
      Number(row.direction_id) === 1,
  ),
  true,
  `Aggregated journey ${line} / ${destination} / direction 1 is missing at ${stop}`,
);
for (const departure of departures.results) {
  assert.equal(sameText(departure.stop_name, stop), true);
  assert.equal(String(departure.route_short_name), line);
  assert.equal(sameText(departure.trip_headsign, destination), true);
  assert.equal(Number(departure.direction_id), 1);
}

console.info(
  `Hérault Data contract OK: ${stops.results.length} stops, ${lines.results.length} line(s), ${destinations.results.length} destination(s), ${journeys.results.length} journey(s), ${departures.results.length} current Pablo Picasso departure(s).`,
);
