import { DeckRemoveSubdeckDocument } from '@generated/graphql';
import { FC, MouseEvent, useState } from 'react';
import { useMutation } from 'urql';
import type { ManageDeckProps } from '@/features/manageDeck';
import {
  Button,
  Text,
  Card,
  createStyles,
  LoadingOverlay,
  Stack,
  UnstyledButton,
  Flex,
} from '@mantine/core';
import { DeckSummaryContent } from '@/components/deck/DeckSummaryContent';
import { DecksList, DeckItemComponentProps } from '@/components/deck';
import { IconCheck, IconLinkOff, IconPlus, IconX } from '@tabler/icons';
import Link, { LinkProps } from 'next/link';
import { BasicList } from '@/components/BasicList';
import { ActionIcon } from '@/components/ActionIcon';

const useButtonStyles = createStyles(({ fn, spacing }) => {
  const { background, hover, border, color } = fn.variant({ variant: 'default' });
  return {
    item: {
      borderTop: `1px solid ${border}`,
      padding: `${spacing.xs}px`,
      backgroundColor: background,
      gap: `${spacing.md}px`,
      alignItems: 'center',
      '&:hover': {
        backgroundColor: hover,
      },
      '&:first-of-type': {
        borderTop: 'none',
      },
    },
  };
});

interface Props extends ManageDeckProps {
  onAddSubdeck(): void;
}

const data = [
  {
    id: '1',
    title: 'Title1',
    cardCount: 10,
    subdeckCount: 0,
  },
  {
    id: '2',
    title: 'Title2',
    cardCount: 10,
    subdeckCount: 4,
  },
];

export const ManageDeckSubdecksBrowse: FC<Props> = ({
  deck: { id: deckId, subdecks },
  onAddSubdeck,
}) => {
  const { classes } = useButtonStyles();
  const [removed, setRemoved] = useState<string[]>([]);
  const onRemoved = (subdeckId: string) => {
    setRemoved(removed.concat([subdeckId]));
  };
  const decks = data.map(({ id, title, cardCount, subdeckCount }, index) => (
    <>
      <Text sx={{ flexGrow: 1 }}>
        <Text component="span" fw="bold">
          {title}
        </Text>
        <br />
        {cardCount ? `${cardCount} cards` : ''}
        {cardCount && subdeckCount ? ' / ' : ''}
        {subdeckCount ? `${subdeckCount} subdecks` : ''}
      </Text>
      <Link href={`/app/deck/${id}`}>
        <Button variant="subtle" compact>
          Visit
        </Button>
      </Link>
      <Button
        leftIcon={removed.includes(id) ? <IconCheck /> : <IconLinkOff />}
        variant="subtle"
        compact
        disabled={removed.includes(id)}
        onClick={() => onRemoved(id)}
      >
        {removed.includes(id) ? 'Unlinked' : 'Unlink'}
      </Button>
    </>
  ));
  decks.push();
  return (
    <Stack spacing="md">
      <BasicList borderTop borderBottom data={decks} />
      <Button
        radius="xl"
        leftIcon={<IconPlus />}
        onClick={onAddSubdeck}
        sx={{ alignSelf: 'center' }}
      >
        Link subdecks
      </Button>
    </Stack>
  );
};
