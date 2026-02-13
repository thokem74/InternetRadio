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

const MAX_STATION_NAME_LENGTH = 50;
const NAME_SEPARATOR_REGEX = /[+\-_,.;:|/\\()]/;

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

function normalizeStationName(value) {
  const name = normalizeString(value);
  if (!name || name.length <= MAX_STATION_NAME_LENGTH) return name;

  const shortenedName = name.slice(0, MAX_STATION_NAME_LENGTH);
  const separatorIndex = shortenedName.search(NAME_SEPARATOR_REGEX);
  if (separatorIndex > 0) {
    return shortenedName.slice(0, separatorIndex).trim();
  }

  return shortenedName.trim();
}

function normalizeTags(value) {
  const rawTags = normalizeString(value);
  if (!rawTags) return '';

  const seen = new Set();
  const parsed = rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      const lower = tag.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });

  return parsed.slice(0, 5).join(', ');
}

export function normalizeStation(raw = {}) {
  const station = {
    stationuuid: normalizeString(raw.stationuuid),
    name: normalizeStationName(raw.name),
    url_stream: normalizeString(raw.url_stream),
    url_homepage: normalizeString(raw.url_homepage),
    url_favicon: normalizeString(raw.url_favicon),
    tags: normalizeTags(raw.tags),
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
