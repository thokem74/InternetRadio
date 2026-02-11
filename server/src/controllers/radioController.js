import { radioCatalog } from '../config/radioCatalog.js';
import { deleteFavorite, listFavorites, upsertFavorite } from '../config/favoriteStore.js';

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 50;

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function splitTags(tagString) {
  if (!tagString) {
    return [];
  }

  return tagString
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeString(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

export const getStations = (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const requestedLimit = parsePositiveInt(req.query.limit, DEFAULT_PAGE_SIZE);
  const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);

  const q = normalizeString(req.query.q).toLowerCase();
  const tag = normalizeString(req.query.tag).toLowerCase();
  const iso31661 = normalizeString(req.query.iso_3166_1).toLowerCase();
  const iso639 = normalizeString(req.query.iso_639).toLowerCase();

  const filtered = radioCatalog.filter((station) => {
    const stationIso31661 = (station.iso_3166_1 ?? '').toLowerCase();
    const stationIso639 = (station.iso_639 ?? '').toLowerCase();

    if (iso31661 && stationIso31661 !== iso31661) {
      return false;
    }

    if (iso639 && stationIso639 !== iso639) {
      return false;
    }

    if (tag) {
      const tags = splitTags(station.tags);
      if (!tags.includes(tag)) {
        return false;
      }
    }

    if (q) {
      const searchText = [station.name, station.tags, station.iso_3166_1, station.iso_639]
        .filter((value) => value !== null && value !== undefined)
        .join(' ')
        .toLowerCase();

      if (!searchText.includes(q)) {
        return false;
      }
    }

    return true;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * limit;

  const items = filtered.slice(offset, offset + limit);

  res.json({
    items,
    pagination: {
      page: safePage,
      limit,
      totalItems,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1
    }
  });
};

export const getFavorites = async (_req, res, next) => {
  try {
    const favorites = await listFavorites();
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const favoritePayload = {
      stationuuid: normalizeString(req.body.stationuuid),
      name: normalizeString(req.body.name),
      url_stream: normalizeString(req.body.url_stream),
      url_homepage: normalizeString(req.body.url_homepage),
      url_favicon: normalizeString(req.body.url_favicon),
      tags: normalizeString(req.body.tags),
      iso_3166_1: normalizeString(req.body.iso_3166_1),
      iso_3166_2: req.body.iso_3166_2 ?? null,
      iso_639: req.body.iso_639 ?? null,
      geo_lat: req.body.geo_lat ?? null,
      geo_long: req.body.geo_long ?? null
    };

    if (!favoritePayload.stationuuid || !favoritePayload.name || !favoritePayload.url_stream) {
      return res.status(400).json({
        message: 'Invalid favorite payload: stationuuid, name, and url_stream are required.'
      });
    }

    const favorite = await upsertFavorite(favoritePayload);
    return res.status(201).json(favorite);
  } catch (error) {
    return next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { stationuuid } = req.params;
    await deleteFavorite(stationuuid);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
