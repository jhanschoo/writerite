import { DeckSummaryFragment } from '@generated/graphql';
import { Text } from '@mantine/core';
import { formatISO, parseISO } from 'date-fns';
import { FC } from 'react';
import { DeckName } from './DeckName';

interface Props {
  deck: DeckSummaryFragment;
}

export const DeckSummaryContent: FC<Props> = ({
  deck: { name, editedAt, subdecksCount, cardsDirectCount },
}) => {
  const editedAtDisplay = formatISO(parseISO(editedAt), { representation: 'date' });
  return (
    <>
      <Text size="lg" weight="bold">
        <DeckName name={name} />
      </Text>
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
