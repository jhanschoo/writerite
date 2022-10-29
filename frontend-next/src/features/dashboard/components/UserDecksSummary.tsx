import { useRouter } from 'next/router';
import { FC, MouseEvent, MouseEventHandler } from 'react';
import { useMutation, useQuery } from 'urql';
import { useMotionContext } from '@hooks/useMotionContext';
import { motionThemes } from '@lib/framer-motion/motionThemes';
import { DeckCreateDocument, DecksDocument, DecksQuery, DecksQueryScope } from '@generated/graphql';
import {
  Button,
  Card,
  createStyles,
  Divider,
  Group,
  Paper,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { DeckSummaryContent } from '@/components/deck/DeckSummaryContent';
import Link from 'next/link';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

const NewDeckItem = () => {
  const router = useRouter();
  const { setMotionProps } = useMotionContext();
  const [, deckCreateMutation] = useMutation(DeckCreateDocument);
  const handleCreateDeck = async (e: MouseEvent) => {
    e.stopPropagation();
    setMotionProps(motionThemes.forward);
    const createdDeck = await deckCreateMutation({
      answerLang: 'en',
      cards: [],
      description: {},
      name: '',
      promptLang: 'en',
      published: false,
    });
    if (createdDeck.data?.deckCreate.id) {
      router.push(`/app/deck/${createdDeck.data.deckCreate.id}`);
    }
  };

  return (
    <Button onClick={handleCreateDeck} size="md" radius="xl" mb="md">
      Create a new Deck
    </Button>
  );
};

const DeckItem = ({ deck }: { deck: DecksQuery['decks'][number] }) => {
  return (
    <Link href={`/app/deck/${deck.id}`}>
      <UnstyledButton sx={{ height: 'unset' }} onClick={(e) => e.stopPropagation()} component="div">
        <Card
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
        </Card>
      </UnstyledButton>
    </Link>
  );
};

const useStyles = createStyles((_theme, _params, getRef) => ({
  group: {
    alignItems: 'flex-end',
    marginRight: '-5rem',
    [`& > .${getRef('heading')}`]: {
      flexGrow: 1,
    },
  },
  heading: {
    ref: getRef('heading'),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
}));

export const UserDecksSummary: FC<Record<string, unknown>> = () => {
  const { classes } = useStyles();
  const [{ data, fetching, error }, refetchDecks] = useQuery({
    query: DecksDocument,
    variables: {
      scope: DecksQueryScope.Owned,
      take: USER_DECK_SUMMARY_DECKS_NUM,
    },
  });
  const decks = (data?.decks || []).map((deck, index) => <DeckItem key={index} deck={deck} />);
  return (
    <Link href="/app/deck">
      <UnstyledButton component="div" mr="5rem">
        <Paper shadow="md" radius="md" p="md" withBorder>
          <Group className={classes.group}>
            <Title order={2} className={classes.heading} mb="md">
              Decks
            </Title>
            <NewDeckItem />
          </Group>
          <Divider mb="md" />
          <Group>
            {decks}
            <Text>{decks.length ? 'View more...' : 'You have no decks to show.'}</Text>
          </Group>
        </Paper>
      </UnstyledButton>
    </Link>
  );
};
