export const validExplorePayload = {
  total_count: 5,
  results: [
    {
      stop_name: 'PABLO PICASSO',
      route_short_name: 3,
      trip_headsign: 'LATTES CENTRE',
      direction_id: 1,
      departure_time: '12:08:00',
      is_theorical: 0,
      delay_sec: 480,
      course_sae: 12345,
      stop_coordinates: { lon: 3.9, lat: 43.58 },
      ignored_future_field: 'safe',
    },
    {
      stop_name: 'PABLO PICASSO',
      route_short_name: '3',
      trip_headsign: 'LATTES CENTRE',
      direction_id: '1',
      departure_time: '12:04:00',
      is_theorical: 'true',
      delay_sec: '240',
      course_sae: 'other-course',
    },
  ],
};

export const departureRecord = (
  delaySec: unknown,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> => ({
  stop_name: 'PABLO PICASSO',
  route_short_name: 3,
  trip_headsign: 'LATTES CENTRE',
  direction_id: 1,
  departure_time: '12:00:00',
  is_theorical: 0,
  delay_sec: delaySec,
  ...overrides,
});
