import { FC } from 'react';
import { Stack } from '@mantine/core';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckTitle } from './ManageDeckTitle';
import { ManageDeckDescription } from './ManageDeckDescription';
import { ManageDeckContent } from './ManageDeckContent';
import { ManageDeckAdditionalInfo } from './ManageDeckAdditionalInfo';

// TODO: pagination
export const ManageDeck: FC<ManageDeckProps> = ({ deck, path }) => (
  <Stack spacing={2} align="center" sx={{ height: '100%' }}>
    <Stack
      sx={({ breakpoints }) => ({ maxWidth: breakpoints.lg, width: '100%' })}
      p="md"
      align="flex-start"
    >
      <ManageDeckTitle deck={deck} />
      <ManageDeckDescription deck={deck} />
      <ManageDeckAdditionalInfo deck={deck} />
    </Stack>
    <ManageDeckContent deck={deck} path={path} />
  </Stack>
);
