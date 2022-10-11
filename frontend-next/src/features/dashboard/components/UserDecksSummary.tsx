import { formatISO, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { FC, MouseEvent, MouseEventHandler } from 'react';
import { useMutation, useQuery } from 'urql';
import { useMotionContext } from '@hooks/useMotionContext';
import { motionThemes } from '@lib/framer-motion/motionThemes';
import { DeckCreateDocument, DecksDocument, DecksQuery, DecksQueryScope } from '@generated/graphql';
import { createStyles, Divider, Group, Paper, Stack, Text, Title, UnstyledButton } from '@mantine/core';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

const NewDeckItem = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) => (
  <UnstyledButton onClick={onClick}>
    <Paper
      shadow="md"
      radius="md"
      px="md"
      py="sm"
      withBorder
      sx={(theme) => {
        const { background, color, hover } = theme.fn.variant({ variant: 'filled' });
        return {
          backgroundColor: background,
          color,
          display: 'flex',
          flexDirection: 'row',
          ...theme.fn.hover({ backgroundColor: hover }),
        };
      }}
    >
      <Text size="xl" weight="bolder">Create a new Deck</Text>
    </Paper>
  </UnstyledButton>
);

const DeckItem = ({ deck: { name, editedAt, subdecksCount, cardsDirectCount }, onClick }: { deck: DecksQuery['decks'][number], onClick?: MouseEventHandler<HTMLButtonElement> }) => {
  const editedAtDisplay = formatISO(parseISO(editedAt), { representation: 'date' });
  return (
    <UnstyledButton sx={{ height: 'unset' }} onClick={onClick}>
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
        {
          name
          ? <Text size="lg" weight="bold">{name}</Text>
          :
          <Text color="dimmed" sx={{ fontStyle: 'italic' }}>
            Untitled Deck
          </Text>
        }
        <Text>
          {subdecksCount} subdecks<br />
          {cardsDirectCount} cards<br />
          last edited at {editedAtDisplay}
        </Text>
      </Paper>
    </UnstyledButton>
  );
};

const useStyles = createStyles({
  group: {
    alignItems: 'center',
    minHeight: '5rem',
    marginRight: '-5rem',
    '& > #view-more-text': {
      flexGrow: 1
    }
  },
});

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
          <Text id="view-more-text" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>View more...</Text>
          <NewDeckItem onClick={handleCreateDeck} />
        </Group>
      </Paper>
    </UnstyledButton>
  );
};
