import { Text } from '@mantine/core';
import { formatISO, parseISO } from 'date-fns';
import { FC } from 'react';
import { ManageDeckProps } from '../types/ManageDeckProps';

export const ManageDeckAdditionalInfo: FC<ManageDeckProps> = ({ deck: { editedAt } }) => {
  const editedAtDisplay = formatISO(parseISO(editedAt), { representation: 'date' });
  return (
    <Text color="dimmed" size="xs" mx="md">Last edited on {editedAtDisplay}</Text>
  );
};
