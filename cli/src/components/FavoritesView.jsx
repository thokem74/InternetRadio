import React from 'react';
import { StationList } from './StationList.jsx';

export const FavoritesView = ({ favorites, selectedIndex, favoriteIds }) => (
  <StationList
    title="Favorites"
    stations={favorites}
    selectedIndex={selectedIndex}
    favoriteIds={favoriteIds}
    page={0}
    pageCount={1}
    total={favorites.length}
    loading={false}
    filterSummary="favorites only"
  />
);
