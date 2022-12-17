import { useRouter } from 'next/router';
import { FC } from 'react';
import { useMutation } from 'urql';
import { useMotionContext } from '@hooks/useMotionContext';
import { motionThemes } from '@lib/framer-motion/motionThemes';
import { DeckCreateDocument, DecksQueryOrder, DeckSummaryFragment } from '@generated/graphql';
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
import { IconSearch, IconPlus } from '@tabler/icons';
import { formatISO, parseISO } from 'date-fns';
import { useQueryRecentDecks } from '@/hooks/datasource/useQueryRecentDecks';
import { DECK_DETAIL_PATH, DECK_PATH } from '@/paths';
import { DeckCompactSummaryContent, DeckName } from '@/components/deck';

export const USER_DECK_SUMMARY_DECKS_NUM = 5;

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
  const handleCreateDeck = async () => {
    setMotionProps(motionThemes.forward);
    const createdDeck = await deckCreateMutation({
      answerLang: 'en',
      cards: [],
      description: null,
      name: '',
      promptLang: 'en',
      published: false,
    });
    if (createdDeck.data?.deckCreate.id) {
      router.push(DECK_DETAIL_PATH(createdDeck.data.deckCreate.id));
    }
  };

  return (
    <Button
      onClick={handleCreateDeck}
      size="md"
      radius="xl"
      className={classes.createDeckButton}
      leftIcon={<IconPlus />}
    >
      New Deck
    </Button>
  );
};

const DeckItem = ({ deck }: { deck: DeckSummaryFragment }) => {
  const editedAtDisplay = formatISO(parseISO(deck.editedAt), { representation: 'date' });
  const { classes } = useStyles();
  const router = useRouter();
  return (
    <UnstyledButton
      onClick={(e) => router.push(DECK_DETAIL_PATH(deck.id))}
      component="div"
      p="md"
      className={classes.deckItem}
    >
      <DeckCompactSummaryContent deck={deck} />
    </UnstyledButton>
  );
};

export const UserDecksSummary: FC<Record<string, unknown>> = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const [{ data, fetching, error }, refetchDecks] = useQueryRecentDecks({
    order: DecksQueryOrder.EditedRecency,
    take: USER_DECK_SUMMARY_DECKS_NUM,
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
        <Button
          variant="outline"
          leftIcon={<IconSearch size={21} />}
          onClick={() => router.push(DECK_PATH)}
        >
          Find Decks
        </Button>
      </Box>
      {decks}
      {decks.length ? undefined : <Text>You have no decks to show.</Text>}
      <Card.Section className={classes.buttonSection}>
        <NewDeckItem />
      </Card.Section>
    </Card>
  );
};
