import { DeckSummaryFragment } from '@generated/graphql';
import { FC } from 'react';
import { Flex } from '@mantine/core';

export interface DeckItemComponentProps {
  deck: DeckSummaryFragment;
}

interface Props {
  decks?: DeckSummaryFragment[];
  component: FC<DeckItemComponentProps>;
  justifyLeading?: boolean;
}

export const DecksList: FC<Props> = ({
  decks,
  component: DeckItemComponent,
  justifyLeading,
}: Props) => {
  const decksList =
    decks?.map((deck, index) => <DeckItemComponent key={index} deck={deck} />) || [];
  if (!justifyLeading) {
    return <Flex gap="sm">{decksList}</Flex>;
  }
  decksList.reverse();
  return (
    <Flex wrap="wrap-reverse" direction="row-reverse" gap="sm">
      {decksList}
    </Flex>
  );
};
