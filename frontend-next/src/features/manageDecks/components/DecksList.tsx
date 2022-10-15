import { formatISO, parseISO } from 'date-fns';
import { DecksQuery } from "@generated/graphql";
import { FC, MouseEventHandler } from "react";
import { useRouter } from 'next/router';
import { Box, Paper, Text, UnstyledButton } from '@mantine/core';
import { DeckSummaryContent } from '@/components/deck/DeckSummaryContent';

interface DeckItemProps {
  deck: DecksQuery['decks'][number];
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const DeckItem: FC<DeckItemProps> = ({ deck, onClick }) => {
  return (
    <UnstyledButton sx={{ height: 'unset', flex: '1 0 auto'}} onClick={onClick}>
      <Paper
        shadow="md"
        radius="md"
        p="md"
        withBorder
        sx={(theme) => {
          const { border, background, color, hover } = theme.fn.variant({ variant: 'default' });
          return {
            backgroundColor: background,
            color,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderColor: border,
            ...theme.fn.hover({ backgroundColor: hover }),
          };
        }}
      >
        <DeckSummaryContent deck={deck} />
      </Paper>
    </UnstyledButton>
  );
};

interface Props {
  decks?: DecksQuery["decks"];
}

export const DecksList: FC<Props> = ({ decks }: Props) => {
  const router = useRouter();
  const decksList = decks?.map(
    (deck, index) => <DeckItem key={index} deck={deck} onClick={(e) => {
      e.stopPropagation();
      router.push(`/app/deck/${deck.id}`);
    }} />
  ) || [];
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
