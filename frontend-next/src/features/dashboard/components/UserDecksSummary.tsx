import { useRouter } from 'next/router';
import { FC, MouseEvent } from 'react';
import { useMutation, useQuery } from 'urql';
import { useMotionContext } from '@hooks/useMotionContext';
import { motionThemes } from '@lib/framer-motion/motionThemes';
import {
  DeckCreateDocument,
  DecksDocument,
  DecksQueryScope,
  DeckSummaryFragment,
} from '@generated/graphql';
import {
  Box,
  Button,
  Card,
  createStyles,
  Divider,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import Link from 'next/link';
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';
import { formatISO, parseISO } from 'date-fns';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

const useStyles = createStyles((theme) => {
  const { background: backgroundColor, hover } = theme.fn.variant({ variant: 'default' });
  return {
    card: {
      overflow: 'visible',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    buttonSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'visible',
    },
    deckItem: {
      backgroundColor,
      ...theme.fn.hover({
        backgroundColor: hover,
      }),
    },
    createDeckButton: {
      position: 'relative',
      bottom: '-1rem',
    },
  };
});

const NewDeckItem = () => {
  const router = useRouter();
  const { classes } = useStyles();
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
    <Button
      onClick={handleCreateDeck}
      size="md"
      radius="xl"
      className={classes.createDeckButton}
      leftIcon={<PlusIcon width={20} height={20} />}
    >
      New Deck
    </Button>
  );
};

const DeckItem = ({ deck }: { deck: DeckSummaryFragment }) => {
  const editedAtDisplay = formatISO(parseISO(deck.editedAt), { representation: 'date' });
  const { classes } = useStyles();
  return (
    <Link href={`/app/deck/${deck.id}`}>
      <UnstyledButton
        onClick={(e) => e.stopPropagation()}
        component="div"
        p="md"
        className={classes.deckItem}
      >
        {deck.name ? (
          <Title order={3} size="lg" weight="bold">
            {deck.name}
          </Title>
        ) : (
          <Title order={3} color="dimmed" sx={{ fontStyle: 'italic' }}>
            Untitled Deck
          </Title>
        )}
        <Text>
          {deck.subdecksCount} subdecks / {deck.cardsDirectCount} cards / last edited at{' '}
          {editedAtDisplay}
        </Text>
      </UnstyledButton>
    </Link>
  );
};

export const UserDecksSummary: FC<Record<string, unknown>> = () => {
  const { classes } = useStyles();
  const [{ data, fetching, error }, refetchDecks] = useQuery({
    query: DecksDocument,
    variables: {
      scope: DecksQueryScope.Owned,
      take: USER_DECK_SUMMARY_DECKS_NUM,
    },
  });
  const decks = (data?.decks || []).flatMap((deck, index) => [
    <Divider key={`${index}-divider`} />,
    <Card.Section key={index}>
      <DeckItem deck={deck} />
    </Card.Section>,
  ]);
  return (
    <Card shadow="xl" radius="lg" px="md" pt="md" className={classes.card}>
      <Box className={classes.header}>
        <Title order={2} mb="md">
          Decks
        </Title>
        <Button variant="outline" leftIcon={<MagnifyingGlassIcon />}>
          Find Decks
        </Button>
      </Box>
      {decks}
      {decks.length ? '' : <Text>You have no decks to show.</Text>}
      <Card.Section className={classes.buttonSection}>
        <NewDeckItem />
      </Card.Section>
    </Card>
  );
};
