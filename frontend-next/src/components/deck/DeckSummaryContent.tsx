import { DeckSummaryFragment } from '@generated/graphql';
import { Text } from '@mantine/core';
import { formatISO, parseISO } from 'date-fns';
import { FC } from 'react';

interface Props {
  deck: DeckSummaryFragment;
}

export const DeckSummaryContent: FC<Props> = ({
  deck: { name, editedAt, subdecksCount, cardsDirectCount },
}) => {
  const editedAtDisplay = formatISO(parseISO(editedAt), { representation: 'date' });
  return (
    <>
      {name ? (
        <Text size="lg" weight="bold">
          {name}
        </Text>
      ) : (
        <Text color="dimmed" sx={{ fontStyle: 'italic' }}>
          Untitled Deck
        </Text>
      )}
      <Text>
        {subdecksCount} subdecks
        <br />
        {cardsDirectCount} cards
        <br />
        last edited at {editedAtDisplay}
      </Text>
    </>
  );
};
