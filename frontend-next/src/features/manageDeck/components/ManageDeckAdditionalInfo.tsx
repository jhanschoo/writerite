import { Text } from '@mantine/core';
import { formatISO, parseISO } from 'date-fns';
import { ManageDeckProps } from '../types/ManageDeckProps';

export const ManageDeckAdditionalInfo = ({ deck: { editedAt } }: ManageDeckProps) => {
  const editedAtDisplay = formatISO(parseISO(editedAt), { representation: 'date' });
  return (
    <Text color="dimmed" size="xs">
      Last edited on {editedAtDisplay}
    </Text>
  );
};
