import React from 'react';
import { Box, Text } from 'ink';

const lines = [
  'Arrow Up/Down: Move selection',
  'Arrow Left/Right: Previous/next page (stations view)',
  'Enter: Play selected station',
  'Space: Pause/resume current station',
  'S: Stop playback',
  'N: Play next station',
  '/: Search by station name',
  'T: Filter by tags',
  'C: Filter by country code',
  'L: Filter by language code',
  'F: Toggle selected station as favorite',
  'Tab: Switch stations/favorites view',
  '?: Toggle this help',
  'Esc: Close search/filter input',
  'Ctrl+C: Exit'
];

export const HelpOverlay = () => (
  <Box borderStyle="double" borderColor="magenta" flexDirection="column" paddingX={1}>
    <Text color="magentaBright">Help</Text>
    {lines.map((line) => (
      <Text key={line}>{line}</Text>
    ))}
  </Box>
);
