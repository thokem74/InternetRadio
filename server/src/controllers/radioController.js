import { ZodError, z } from 'zod';
import { deleteFavorite, listFavorites, upsertFavorite } from '../config/favoriteStore.js';
import { listStations } from '../config/stationStore.js';

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 50;

const favoritePayloadSchema = z.object({
  stationuuid: z.string().trim().min(1),
  name: z.string().trim().min(1),
  url_stream: z.string().trim().min(1)
});

function parsePositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeString(value) {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

export const getStations = async (req, res, next) => {
  const page = parsePositiveInt(req.query.page, 1);
  const requestedLimit = parsePositiveInt(req.query.limit, DEFAULT_PAGE_SIZE);
  const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);

  const q = normalizeString(req.query.q).toLowerCase();
  const tag = normalizeString(req.query.tag).toLowerCase();
  const iso31661 = normalizeString(req.query.iso_3166_1).toLowerCase();
  const iso639 = normalizeString(req.query.iso_639).toLowerCase();

  try {
    const result = await listStations({
      page,
      limit,
      q,
      tag,
      iso_3166_1: iso31661,
      iso_639: iso639
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
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
    const payload = favoritePayloadSchema.parse(req.body);

    const favoritePayload = {
      stationuuid: payload.stationuuid,
      name: payload.name,
      url_stream: payload.url_stream,
      url_homepage: normalizeString(req.body.url_homepage),
      url_favicon: normalizeString(req.body.url_favicon),
      tags: normalizeString(req.body.tags),
      iso_3166_1: normalizeString(req.body.iso_3166_1),
      iso_3166_2: req.body.iso_3166_2 ?? null,
      iso_639: req.body.iso_639 ?? null,
      geo_lat: req.body.geo_lat ?? null,
      geo_long: req.body.geo_long ?? null
    };

    const favorite = await upsertFavorite(favoritePayload);
    return res.status(201).json(favorite);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Invalid favorite payload.',
        issues: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message
        }))
      });
    }

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
