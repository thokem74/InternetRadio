import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catalogPath = path.resolve(__dirname, '../../../radiobrowser_stations_latest.json');

const STATION_KEYS = [
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

  return String(value);
}

function normalizeCoordinate(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeStation(raw) {
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

function loadStationsFromDisk() {
  if (!fs.existsSync(catalogPath)) {
    throw new Error(`Station catalog not found at ${catalogPath}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to parse station catalog JSON: ${error.message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Station catalog format is invalid. Expected a JSON array.');
  }

  const stations = parsed
    .map((item) => normalizeStation(item))
    .filter((station) => station.stationuuid && station.name && station.url_stream);

  if (stations.length === 0) {
    throw new Error('Station catalog is empty after normalization.');
  }

  return stations;
}

export const radioCatalog = loadStationsFromDisk();
