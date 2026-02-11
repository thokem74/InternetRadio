export const STATION_KEYS = [
  'stationuuid',
  'name',
  'url_stream',
  'url_homepage',
  'url_favicon',
  'tags',
  'iso_3166_1',
  'iso_3166_2',
  'iso_639',
  'geo_lat',
  'geo_long'
];

function normalizeString(value, { preserveNull = false } = {}) {
  if (value === null && preserveNull) {
    return null;
  }

  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

function normalizeCoordinate(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeStation(raw = {}) {
  const station = {
    stationuuid: normalizeString(raw.stationuuid),
    name: normalizeString(raw.name),
    url_stream: normalizeString(raw.url_stream),
    url_homepage: normalizeString(raw.url_homepage),
    url_favicon: normalizeString(raw.url_favicon),
    tags: normalizeString(raw.tags),
    iso_3166_1: normalizeString(raw.iso_3166_1),
    iso_3166_2: normalizeString(raw.iso_3166_2, { preserveNull: true }),
    iso_639: normalizeString(raw.iso_639, { preserveNull: true }),
    geo_lat: normalizeCoordinate(raw.geo_lat),
    geo_long: normalizeCoordinate(raw.geo_long)
  };

  for (const key of STATION_KEYS) {
    if (!(key in station)) {
      station[key] = null;
    }
  }

  return station;
}
