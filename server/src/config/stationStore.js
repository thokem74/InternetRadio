import { Station } from '../models/Station.js';
import { STATION_KEYS } from './stationNormalizer.js';

const STATION_PROJECTION = STATION_KEYS.reduce(
  (accumulator, key) => ({ ...accumulator, [key]: 1 }),
  { _id: 0 }
);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toStationShape(station = {}) {
  return STATION_KEYS.reduce((accumulator, key) => {
    accumulator[key] = station[key] ?? null;
    return accumulator;
  }, {});
}

function buildFilters({ q, tag, iso_3166_1, iso_639 }) {
  const andConditions = [];

  if (iso_3166_1) {
    andConditions.push({ iso_3166_1: { $regex: `^${escapeRegex(iso_3166_1)}$`, $options: 'i' } });
  }

  if (iso_639) {
    andConditions.push({ iso_639: { $regex: `^${escapeRegex(iso_639)}$`, $options: 'i' } });
  }

  if (tag) {
    andConditions.push({
      tags: { $regex: `(^|,\\s*)${escapeRegex(tag)}(\\s*,|$)`, $options: 'i' }
    });
  }

  if (q) {
    const queryRegex = { $regex: escapeRegex(q), $options: 'i' };
    andConditions.push({ name: queryRegex });
  }

  if (andConditions.length === 0) {
    return {};
  }

  if (andConditions.length === 1) {
    return andConditions[0];
  }

  return { $and: andConditions };
}

export async function listStations({ page, limit, q, tag, iso_3166_1, iso_639 }) {
  const filters = buildFilters({ q, tag, iso_3166_1, iso_639 });
  const totalItems = await Station.countDocuments(filters);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * limit;

  const items = await Station.find(filters, STATION_PROJECTION)
    .sort({ name: 1, stationuuid: 1 })
    .skip(offset)
    .limit(limit)
    .lean();

  return {
    items: items.map((station) => toStationShape(station)),
    pagination: {
      page: safePage,
      limit,
      totalItems,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1
    }
  };
}
