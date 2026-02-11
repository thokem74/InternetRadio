import { FavoriteStation } from '../models/FavoriteStation.js';

let useMemoryStore = false;
const memoryFavorites = new Map();

const FAVORITE_KEYS = [
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

export function setMemoryStoreMode(enabled) {
  useMemoryStore = enabled;
}

function toFavoriteShape(station = {}) {
  return FAVORITE_KEYS.reduce((accumulator, key) => {
    accumulator[key] = station[key] ?? null;
    return accumulator;
  }, {});
}

function isNewFavoriteShape(station) {
  return Boolean(station && station.stationuuid && station.name && station.url_stream);
}

export async function listFavorites() {
  if (useMemoryStore) {
    return [...memoryFavorites.values()]
      .filter((favorite) => isNewFavoriteShape(favorite))
      .map((favorite) => toFavoriteShape(favorite));
  }

  const favorites = await FavoriteStation.find({
    stationuuid: { $exists: true, $nin: [null, ''] },
    name: { $exists: true, $nin: [null, ''] },
    url_stream: { $exists: true, $nin: [null, ''] }
  })
    .sort({ createdAt: -1 })
    .lean();

  return favorites.map((favorite) => toFavoriteShape(favorite));
}

export async function upsertFavorite(payload) {
  const favorite = toFavoriteShape(payload);

  if (useMemoryStore) {
    memoryFavorites.set(favorite.stationuuid, favorite);
    return favorite;
  }

  const saved = await FavoriteStation.findOneAndUpdate(
    { stationuuid: favorite.stationuuid },
    favorite,
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();

  return toFavoriteShape(saved);
}

export async function deleteFavorite(stationuuid) {
  if (useMemoryStore) {
    memoryFavorites.delete(stationuuid);
    return;
  }

  await FavoriteStation.deleteOne({ stationuuid });
}
