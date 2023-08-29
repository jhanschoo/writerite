import { useRouter } from 'next/router';
import { DECK_DETAIL_PATH, DECK_PATH } from '@/paths';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import {
  Button,
  Card,
  Divider,
  Flex,
  Text,
  Title,
  UnstyledButton,
  createStyles,
} from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { formatISO, parseISO } from 'date-fns';
import { useMutation, useQuery } from 'urql';

import { DeckCompactSummaryContent } from '@/components/deck';

export const USER_DECK_SUMMARY_DECKS_NUM = 5;

const useStyles = createStyles((theme) => {
  const { background: backgroundColor, hover } = theme.fn.variant({
    variant: 'default',
  });
  return {
    card: {
      overflow: 'visible',
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

const NewDeckItemMutation = graphql(/* GraphQL */ `
  mutation UserDecksSummaryNewDeckItemMutation(
    $input: DeckCreateMutationInput!
  ) {
    deckCreate(input: $input) {
      id
    }
  }
`);

const NewDeckItem = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const [, newDeckItemMutation] = useMutation(NewDeckItemMutation);
  const handleCreateDeck = async () => {
    const createdDeck = await newDeckItemMutation({
      input: {
        answerLang: 'en',
        cards: [],
        description: null,
        name: '',
        promptLang: 'en',
        published: false,
      },
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

export const UserDecksSummaryDeckItemFragment = graphql(/* GraphQL */ `
  fragment UserDecksSummaryDeckItem on Deck {
    id
    editedAt
    ...DeckCompactSummaryContent
  }
`);

const DeckItem = ({
  deck,
}: {
  deck: FragmentType<typeof UserDecksSummaryDeckItemFragment>;
}) => {
  const deckFragment = useFragment(UserDecksSummaryDeckItemFragment, deck);
  const { id, editedAt } = deckFragment;
  const editedAtDisplay = formatISO(parseISO(editedAt), {
    representation: 'date',
  });
  const { classes } = useStyles();
  const router = useRouter();
  return (
    <UnstyledButton
      onClick={(e) => router.push(DECK_DETAIL_PATH(id))}
      component="div"
      p="md"
      className={classes.deckItem}
    >
      <DeckCompactSummaryContent deck={deckFragment} />
    </UnstyledButton>
  );
};

const UserDecksSummaryQuery = graphql(/* GraphQL */ `
  query UserDecksSummaryQuery($first: Int, $input: DecksQueryInput!) {
    decks(first: $first, input: $input) {
      edges {
        cursor
        node {
          ...UserDecksSummaryDeckItem
        }
      }
    }
  }
`);

export const UserDecksSummary = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const [{ data, fetching, error }, refetchDecks] = useQuery({
    query: UserDecksSummaryQuery,
    variables: {
      first: USER_DECK_SUMMARY_DECKS_NUM,
      input: {},
    },
  });
  const decks = (data?.decks.edges || []).flatMap((deck, index) =>
    deck
      ? [
          <Divider key={`${index}-divider`} />,
          <Card.Section key={index}>
            <DeckItem deck={deck.node} />
          </Card.Section>,
        ]
      : []
  );
  return (
    <Card shadow="xl" radius="lg" px="md" pt="md" className={classes.card}>
      <Flex justify="space-between">
        <Title order={2} mb="md">
          Decks
        </Title>
        <Button
          variant="outline"
          radius="xl"
          leftIcon={<IconSearch size={21} />}
          onClick={() => router.push(DECK_PATH)}
        >
          Find Decks
        </Button>
      </Flex>
      {decks}
      {decks.length ? undefined : <Text>You have no decks to show.</Text>}
      <Card.Section className={classes.buttonSection}>
        <NewDeckItem />
      </Card.Section>
    </Card>
  );
};
