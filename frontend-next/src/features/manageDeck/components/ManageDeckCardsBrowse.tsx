import { FC } from 'react';
import { Stack, TextInput } from '@mantine/core';

import { ManageDeckProps } from '../types/ManageDeckProps';

export const ManageDeckCardsBrowse: FC<ManageDeckProps> = ({ deck }) => {
  return (
    <Stack>
      <TextInput label="Search cards" sx={{ flexGrow: 1 }} />
    </Stack>
  );
};
