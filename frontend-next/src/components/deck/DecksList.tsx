import { DecksQuery } from "@generated/graphql";
import { FC } from "react";
import { useRouter } from 'next/router';
import { Box } from '@mantine/core';

export interface DeckItemComponentProps {
  deck: DecksQuery['decks'][number];
}

interface Props {
  decks?: DecksQuery["decks"];
  component: FC<DeckItemComponentProps>;
  justifyLeading?: boolean;
}

export const DecksList: FC<Props> = ({ decks, component: DeckItemComponent, justifyLeading }: Props) => {
  const decksList = decks?.map(
    (deck, index) => <DeckItemComponent key={index} deck={deck} />
  ) || [];
  if (!justifyLeading) {
    return <Box sx={({ spacing }) => ({
      display: 'flex',
      gap: `${spacing.sm}px`
    })}>
      {decksList}
    </Box>;
  }
  decksList.reverse();
  return <Box sx={({ spacing }) => ({
    display: 'flex',
    flexWrap: 'wrap-reverse',
    flexDirection: 'row-reverse',
    gap: `${spacing.sm}px`
  })}>
    {decksList}
  </Box>;
}
