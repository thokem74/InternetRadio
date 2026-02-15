import React from 'react';
import { Box, Text } from 'ink';

const getStateLabel = ({ isPaused, nowPlaying }) => {
  if (!nowPlaying) {
    return 'Stopped';
  }

  return isPaused ? 'Paused' : 'Playing';
};

export const NowPlaying = ({ nowPlaying, isPaused, playerError, viewName }) => {
  const state = getStateLabel({ isPaused, nowPlaying });

  return (
    <Box borderStyle="round" borderColor="green" flexDirection="column" paddingX={1}>
      <Text>
        View: {viewName} | Player: {state}
      </Text>
      <Text>
        Station: {nowPlaying?.name || '-'}
      </Text>
      <Text>
        Tags: {nowPlaying?.tags || '-'} | Country: {nowPlaying?.iso_3166_1 || '-'}
      </Text>
      {playerError ? <Text color="red">Player error: {playerError}</Text> : null}
    </Box>
  );
};
