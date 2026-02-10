import { FavoriteStation } from '../models/FavoriteStation.js';

let useMemoryStore = false;
const memoryFavorites = new Map();

export function setMemoryStoreMode(enabled) {
  useMemoryStore = enabled;
}

export async function listFavorites() {
  if (useMemoryStore) {
    return [...memoryFavorites.values()];
  }

  return FavoriteStation.find().sort({ createdAt: -1 });
}

export async function upsertFavorite(payload) {
  if (useMemoryStore) {
    memoryFavorites.set(payload.stationId, payload);
    return payload;
  }

  return FavoriteStation.findOneAndUpdate(
    { stationId: payload.stationId },
    payload,
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
}

export async function deleteFavorite(stationId) {
  if (useMemoryStore) {
    memoryFavorites.delete(stationId);
    return;
  }

  await FavoriteStation.deleteOne({ stationId });
}
