import { useRouter } from 'next/router';
import { FC, MouseEvent, MouseEventHandler } from 'react';
import { useMutation, useQuery } from 'urql';
import { useMotionContext } from '@hooks/useMotionContext';
import { motionThemes } from '@lib/framer-motion/motionThemes';
import { DeckCreateDocument, DecksDocument, DecksQuery, DecksQueryScope } from '@generated/graphql';
import { Button, Card, createStyles, Divider, Group, Paper, Text, Title, UnstyledButton } from '@mantine/core';
import { DeckSummaryContent } from '@/components/deck/DeckSummaryContent';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

const NewDeckItem = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) => (
  <Button onClick={onClick} size="lg">
    Create a new Deck
  </Button>
);

const DeckItem = ({ deck, onClick }: { deck: DecksQuery['decks'][number], onClick?: MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <UnstyledButton sx={{ height: 'unset' }} onClick={onClick}>
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
  );
};

const useStyles = createStyles((_theme, _params, getRef) => ({
  group: {
    alignItems: 'center',
    minHeight: '5rem',
    marginRight: '-5rem',
    [`& > .${getRef('viewMoreText')}`]: {
      flexGrow: 1
    }
  },
  viewMoreText: {
    ref: getRef('viewMoreText'),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

export const UserDecksSummary: FC<Record<string, unknown>> = () => {
  const router = useRouter();
  const { setMotionProps } = useMotionContext();
  const { classes } = useStyles();
  const [{ data, fetching, error }, refetchDecks] = useQuery({
    query: DecksDocument,
    variables: {
      scope: DecksQueryScope.Owned,
      take: USER_DECK_SUMMARY_DECKS_NUM,
    },
  });
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
    refetchDecks();
    if (createdDeck.data?.deckCreate.id) {
      router.push(`/app/deck/${createdDeck.data.deckCreate.id}`);
    }
  };
  const decks = (data?.decks || []).map(
    (deck, index) => <DeckItem key={index} deck={deck} onClick={(e) => {
      e.stopPropagation();
      router.push(`/app/deck/${deck.id}`);
    }} />
  );
  return (
    <UnstyledButton component="div" mr="5rem" onClick={() => router.push('/app/deck')}>
      <Paper shadow="md" radius="md" p="md" withBorder>
        <Title order={2} mb="md">Decks</Title>
        <Divider mb="md" />
        <Group className={classes.group}>
          {decks}
          <Text className={classes.viewMoreText}>View more...</Text>
          <NewDeckItem onClick={handleCreateDeck} />
        </Group>
      </Paper>
    </UnstyledButton>
  );
};
