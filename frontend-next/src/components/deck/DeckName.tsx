import { Text } from '@mantine/core';
import { FC, PropsWithChildren } from 'react';

/**
 * DeckName helps to properly format a deck name for display, even when the name is the empty string.
 * @param param0
 */
export const DeckName: FC<{ name: string }> = ({ name }) => {
  if (!name) {
    return (
      <Text color="dimmed" italic component="span" weight="normal">
        Untitled Deck
      </Text>
    );
  }
  return <>{name}</>;
};
