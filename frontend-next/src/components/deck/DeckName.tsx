import { Text } from '@mantine/core';

/**
 * DeckName helps to properly format a deck name for display, even when the name is the empty string.
 * @param param0
 */
export const DeckName = ({ name }: { name: string }) => {
  if (!name) {
    return (
      <Text color="dimmed" italic component="span" weight="normal">
        Untitled Deck
      </Text>
    );
  }
  return <>{name}</>;
};
