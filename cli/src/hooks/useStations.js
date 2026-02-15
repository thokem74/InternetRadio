import { useCallback, useEffect, useMemo, useState } from 'react';
import { Station } from '../../../server/src/models/Station.js';
import { connectDb } from '../lib/db.js';

const buildRegex = (value, exact = false) => {
  if (!value) {
    return undefined;
  }

  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return exact ? new RegExp(`^${escaped}$`, 'i') : new RegExp(escaped, 'i');
};

export const useStations = (filters, pageSize = 15) => {
  const [stations, setStations] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = useMemo(() => {
    const nextQuery = {};
    const searchRegex = buildRegex(filters.search);
    const tagRegex = buildRegex(filters.tag);
    const countryRegex = buildRegex(filters.country, true);
    const languageRegex = buildRegex(filters.language, true);

    if (searchRegex) {
      nextQuery.name = searchRegex;
    }

    if (tagRegex) {
      nextQuery.tags = tagRegex;
    }

    if (countryRegex) {
      nextQuery.iso_3166_1 = countryRegex;
    }

    if (languageRegex) {
      nextQuery.iso_639 = languageRegex;
    }

    return nextQuery;
  }, [filters.country, filters.language, filters.search, filters.tag]);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      await connectDb();
      const [foundStations, totalCount] = await Promise.all([
        Station.find(query)
          .sort({ name: 1 })
          .skip(page * pageSize)
          .limit(pageSize)
          .lean(),
        Station.countDocuments(query)
      ]);

      setStations(foundStations);
      setTotal(totalCount);
    } catch (dbError) {
      setError(dbError instanceof Error ? dbError.message : 'Failed to load stations');
      setStations([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, query]);

  useEffect(() => {
    setPage(0);
  }, [query]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const canGoPrev = page > 0;
  const canGoNext = page + 1 < pageCount;

  return {
    stations,
    total,
    page,
    pageSize,
    pageCount,
    loading,
    error,
    canGoNext,
    canGoPrev,
    setPage,
    nextPage: () => {
      if (canGoNext) {
        setPage((current) => current + 1);
      }
    },
    prevPage: () => {
      if (canGoPrev) {
        setPage((current) => current - 1);
      }
    },
    reload: fetchStations
  };
};
