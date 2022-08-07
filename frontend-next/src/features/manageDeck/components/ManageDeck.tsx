import { FC } from 'react';
import { Stack, Text, Title } from '@mantine/core';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckTitle } from './ManageDeckTitle';
import { ManageDeckDescription } from './ManageDeckDescription';
import { ManageDeckContent } from './ManageDeckContent';
import { ManageDeckAdditionalInfo } from './ManageDeckAdditionalInfo';

// TODO: pagination
export const ManageDeck: FC<ManageDeckProps & { grow: boolean }> = ({ deck, grow }) => (
  <Stack spacing={2} align="center" sx={grow ? { height: '100%' } : undefined}>
    <Stack sx={({ breakpoints }) => ({ maxWidth: `${breakpoints.lg}px`, width: '100%' })} p="md" align="flex-start">
      <ManageDeckTitle deck={deck} />
      <ManageDeckDescription deck={deck} />
      <ManageDeckAdditionalInfo deck={deck} />
    </Stack>
    <ManageDeckContent deck={deck} />
  </Stack>
);
