import { Stack } from '@mantine/core';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { ManageDeckContent } from './ManageDeckContent';
import { ManageDeckAdditionalInfo } from './ManageDeckAdditionalInfo';
import { ManageDeckFrontMatter } from './ManageDeckFrontMatter';

// TODO: pagination
export const ManageDeck = ({ deck, path }: ManageDeckProps) => (
  <Stack spacing={2} align="center" sx={{ height: '100%' }}>
    <Stack
      sx={({ breakpoints }) => ({ maxWidth: breakpoints.lg, width: '100%' })}
      p="md"
      align="stretch"
    >
      <ManageDeckFrontMatter deck={deck} />
      <ManageDeckAdditionalInfo deck={deck} />
    </Stack>
    <ManageDeckContent deck={deck} path={path} />
  </Stack>
);
