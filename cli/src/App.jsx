import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { FavoritesView } from './components/FavoritesView.jsx';
import { HelpOverlay } from './components/HelpOverlay.jsx';
import { NowPlaying } from './components/NowPlaying.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { StationList } from './components/StationList.jsx';
import { useFavorites } from './hooks/useFavorites.js';
import { usePlayer } from './hooks/usePlayer.js';
import { useStations } from './hooks/useStations.js';
import { disconnectDb, MONGODB_URI } from './lib/db.js';

const FILTER_MAP = {
  search: {
    title: 'Search by station name',
    stateKey: 'search'
  },
  tag: {
    title: 'Filter by tag',
    stateKey: 'tag'
  },
  country: {
    title: 'Filter by country (ISO 3166-1)',
    stateKey: 'country'
  },
  language: {
    title: 'Filter by language (ISO 639)',
    stateKey: 'language'
  }
};

const clampIndex = (index, list) => {
  if (list.length === 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), list.length - 1);
};

export const App = () => {
  const [filters, setFilters] = useState({
    search: '',
    tag: '',
    country: '',
    language: ''
  });
  const [view, setView] = useState('stations');
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
  const [selectedFavoriteIndex, setSelectedFavoriteIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [inputMode, setInputMode] = useState(null);

  const stationsState = useStations(filters);
  const favoritesState = useFavorites();
  const playerState = usePlayer();

  const activeStations = view === 'stations' ? stationsState.stations : favoritesState.favorites;
  const activeIndex = view === 'stations' ? selectedStationIndex : selectedFavoriteIndex;
  const activeStation = activeStations[activeIndex];

  const filterSummary = useMemo(() => {
    const items = [
      ['name', filters.search],
      ['tag', filters.tag],
      ['country', filters.country],
      ['language', filters.language]
    ].filter(([, value]) => Boolean(value));

    return items.map(([key, value]) => `${key}:${value}`).join(', ');
  }, [filters.country, filters.language, filters.search, filters.tag]);

  const playStation = (station) => {
    if (!station) {
      return;
    }

    playerState.play(station);
  };

  const playNextStation = () => {
    if (activeStations.length === 0) {
      return;
    }

    if (view === 'stations') {
      const nextIndex = (selectedStationIndex + 1) % activeStations.length;
      setSelectedStationIndex(nextIndex);
      playStation(activeStations[nextIndex]);
      return;
    }

    const nextIndex = (selectedFavoriteIndex + 1) % activeStations.length;
    setSelectedFavoriteIndex(nextIndex);
    playStation(activeStations[nextIndex]);
  };

  const moveSelection = (direction) => {
    if (activeStations.length === 0) {
      return;
    }

    if (view === 'stations') {
      setSelectedStationIndex((current) => clampIndex(current + direction, activeStations));
      return;
    }

    setSelectedFavoriteIndex((current) => clampIndex(current + direction, activeStations));
  };

  const toggleFavorite = async () => {
    if (!activeStation) {
      return;
    }

    await favoritesState.toggleFavorite(activeStation);
  };

  const beginInputMode = (type) => {
    const descriptor = FILTER_MAP[type];
    if (!descriptor) {
      return;
    }

    setInputMode({
      type,
      title: descriptor.title,
      value: filters[descriptor.stateKey] || ''
    });
  };

  const applyInputMode = (value) => {
    if (!inputMode) {
      return;
    }

    const descriptor = FILTER_MAP[inputMode.type];
    if (!descriptor) {
      setInputMode(null);
      return;
    }

    setFilters((current) => ({
      ...current,
      [descriptor.stateKey]: value.trim()
    }));
    setInputMode(null);
    setSelectedStationIndex(0);
  };

  useInput((input, key) => {
    if (inputMode) {
      if (key.escape) {
        setInputMode(null);
      }

      return;
    }

    if (key.tab) {
      setView((current) => (current === 'stations' ? 'favorites' : 'stations'));
      return;
    }

    if (input === '?') {
      setShowHelp((current) => !current);
      return;
    }

    if (showHelp) {
      return;
    }

    if (key.upArrow) {
      moveSelection(-1);
      return;
    }

    if (key.downArrow) {
      moveSelection(1);
      return;
    }

    if (view === 'stations' && key.leftArrow) {
      stationsState.prevPage();
      setSelectedStationIndex(0);
      return;
    }

    if (view === 'stations' && key.rightArrow) {
      stationsState.nextPage();
      setSelectedStationIndex(0);
      return;
    }

    if (key.return) {
      playStation(activeStation);
      return;
    }

    if (input === ' ') {
      playerState.togglePause();
      return;
    }

    if (input?.toLowerCase() === 's') {
      playerState.stop();
      return;
    }

    if (input?.toLowerCase() === 'n') {
      playNextStation();
      return;
    }

    if (input?.toLowerCase() === 'f') {
      toggleFavorite();
      return;
    }

    if (input === '/') {
      beginInputMode('search');
      return;
    }

    if (input?.toLowerCase() === 't') {
      beginInputMode('tag');
      return;
    }

    if (input?.toLowerCase() === 'c') {
      beginInputMode('country');
      return;
    }

    if (input?.toLowerCase() === 'l') {
      beginInputMode('language');
    }
  });

  useEffect(() => {
    setSelectedStationIndex((current) => clampIndex(current, stationsState.stations));
  }, [stationsState.stations]);

  useEffect(() => {
    setSelectedFavoriteIndex((current) => clampIndex(current, favoritesState.favorites));
  }, [favoritesState.favorites]);

  useEffect(
    () => () => {
      disconnectDb().catch(() => {});
    },
    []
  );

  const stationErrors = [stationsState.error, favoritesState.error].filter(Boolean).join(' | ');

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color="cyan">Internet Radio CLI</Text>
      <Text color="gray">MongoDB: {MONGODB_URI}</Text>
      <Text color="gray">Press ? for help</Text>

      <Box marginTop={1} flexDirection="column">
        {view === 'stations' ? (
          <StationList
            title="Stations"
            stations={stationsState.stations}
            selectedIndex={selectedStationIndex}
            favoriteIds={favoritesState.favoriteIds}
            page={stationsState.page}
            pageCount={stationsState.pageCount}
            total={stationsState.total}
            loading={stationsState.loading}
            filterSummary={filterSummary}
          />
        ) : (
          <FavoritesView
            favorites={favoritesState.favorites}
            selectedIndex={selectedFavoriteIndex}
            favoriteIds={favoritesState.favoriteIds}
          />
        )}
      </Box>

      {inputMode ? (
        <Box marginTop={1}>
          <SearchBar
            title={inputMode.title}
            value={inputMode.value}
            onChange={(value) => setInputMode((current) => (current ? { ...current, value } : current))}
            onSubmit={applyInputMode}
            onCancel={() => setInputMode(null)}
          />
        </Box>
      ) : null}

      {showHelp ? (
        <Box marginTop={1}>
          <HelpOverlay />
        </Box>
      ) : null}

      <Box marginTop={1}>
        <NowPlaying
          nowPlaying={playerState.nowPlaying}
          isPaused={playerState.isPaused}
          playerError={playerState.error}
          viewName={view}
        />
      </Box>

      {stationErrors ? (
        <Box marginTop={1}>
          <Text color="red">Database error: {stationErrors}</Text>
        </Box>
      ) : null}
    </Box>
  );
};
