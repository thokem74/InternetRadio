import { radioCatalog } from '../config/radioCatalog.js';
import { deleteFavorite, listFavorites, upsertFavorite } from '../config/favoriteStore.js';

export const getStations = (_req, res) => {
  res.json(radioCatalog);
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
    const { stationId, name, country, language, genre, streamUrl, homepage } = req.body;

    const favorite = await upsertFavorite({
      stationId,
      name,
      country,
      language,
      genre,
      streamUrl,
      homepage
    });

    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { stationId } = req.params;
    await deleteFavorite(stationId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
