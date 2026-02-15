import React from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';

export const SearchBar = ({ title, value, onChange, onSubmit, onCancel }) => {
  useInput((_, key) => {
    if (key.escape && onCancel) {
      onCancel();
    }
  });

  return (
    <Box borderStyle="round" borderColor="yellow" flexDirection="column" paddingX={1}>
      <Text>
        {title} (Enter: apply, Esc: cancel)
      </Text>
      <TextInput value={value} onChange={onChange} onSubmit={onSubmit} />
      <Text color="gray">Current: {value || 'empty'}</Text>
      <Text color="gray">Press Ctrl+C to quit at any time.</Text>
    </Box>
  );
};
