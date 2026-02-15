import React from 'react';
import { Box, Text } from 'ink';

const formatMeta = (station) => {
  const country = station.iso_3166_1 || '??';
  const language = station.iso_639 || '--';
  return `${country} | ${language}`;
};

export const StationList = ({
  title,
  stations,
  selectedIndex,
  favoriteIds,
  page,
  pageCount,
  total,
  loading,
  filterSummary
}) => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" paddingX={1}>
      <Text>
        {title} | Page {page + 1}/{pageCount} | Total {total}
      </Text>
      <Text color="gray">Filters: {filterSummary || 'none'}</Text>
      {loading ? <Text color="yellow">Loading stations...</Text> : null}
      {stations.length === 0 && !loading ? <Text color="red">No stations found.</Text> : null}
      {stations.map((station, index) => {
        const selected = index === selectedIndex;
        const marker = selected ? '>' : ' ';
        const favoriteMark = favoriteIds.has(station.stationuuid) ? '★' : ' ';
        const color = selected ? 'green' : undefined;

        return (
          <Text key={station.stationuuid} color={color}>
            {marker} {favoriteMark} {station.name} [{formatMeta(station)}]
          </Text>
        );
      })}
    </Box>
  );
};
