import { useCallback, useEffect, useMemo, useState } from 'react';
import { FavoriteStation } from '../../../server/src/models/FavoriteStation.js';
import { connectDb } from '../lib/db.js';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const favoriteIds = useMemo(
    () => new Set(favorites.map((favorite) => favorite.stationuuid)),
    [favorites]
  );

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      await connectDb();
      const foundFavorites = await FavoriteStation.find({}).sort({ name: 1 }).lean();
      setFavorites(foundFavorites);
    } catch (dbError) {
      setError(dbError instanceof Error ? dbError.message : 'Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = useCallback(async (station) => {
    if (!station?.stationuuid) {
      return false;
    }

    await connectDb();

    const existing = await FavoriteStation.findOne({ stationuuid: station.stationuuid }).lean();
    if (existing) {
      await FavoriteStation.deleteOne({ stationuuid: station.stationuuid });
      await loadFavorites();
      return false;
    }

    await FavoriteStation.create({
      stationuuid: station.stationuuid,
      name: station.name,
      url_stream: station.url_stream,
      url_homepage: station.url_homepage,
      url_favicon: station.url_favicon,
      tags: station.tags,
      iso_3166_1: station.iso_3166_1,
      iso_3166_2: station.iso_3166_2,
      iso_639: station.iso_639,
      geo_lat: station.geo_lat,
      geo_long: station.geo_long
    });

    await loadFavorites();
    return true;
  }, [loadFavorites]);

  return {
    favorites,
    favoriteIds,
    loading,
    error,
    loadFavorites,
    toggleFavorite
  };
};
