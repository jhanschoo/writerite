import { MouseEvent, MouseEventHandler } from 'react';
import { useRouter } from 'next/router';
import { DECK_DETAIL_PATH } from '@/paths';
import { graphql } from '@generated/gql';
import {
  Button,
  Center,
  Divider,
  Group,
  Stack,
  Title,
  createStyles,
  getStylesRef,
} from '@mantine/core';
import { useMutation } from 'urql';

import { RecentDecks } from './RecentDecks';
import { SearchDecks } from './SearchDecks';

const emptyNewDeckInput = {
  input: {
    answerLang: 'en',
    cards: [],
    description: {},
    name: '',
    promptLang: 'en',
    published: false,
  },
};

const NewDeckItemMutation = graphql(/* GraphQL */ `
  mutation ManageDecksNewDeckItemMutation($input: DeckCreateMutationInput!) {
    deckCreate(input: $input) {
      id
    }
  }
`);

const NewDeckItem = ({
  onClick,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => (
  <Button onClick={onClick} size="lg">
    Create a new Deck
  </Button>
);

const useStyles = createStyles(({ breakpoints }) => ({
  root: {
    width: '100%',
    maxWidth: breakpoints.lg,
  },
  group: {
    [`& > .${getStylesRef('growable')}`]: { flexGrow: 1 },
  },
  growable: {
    ref: getStylesRef('growable'),
  },
}));

// TODO: pagination
export const ManageDecks = () => {
  const router = useRouter();
  const { classes } = useStyles();
  const [, deckCreateMutation] = useMutation(NewDeckItemMutation);
  const handleCreateDeck: MouseEventHandler = async (e) => {
    const createdDeck = await deckCreateMutation(emptyNewDeckInput);
    if (createdDeck.data?.deckCreate.id) {
      router.push(DECK_DETAIL_PATH(createdDeck.data.deckCreate.id));
    }
  };
  return (
    <Center>
      <Stack p="md" className={classes.root} spacing="sm">
        <Group align="end" className={classes.group}>
          <Title order={1} className={classes.growable}>
            Manage Decks
          </Title>
          <NewDeckItem onClick={handleCreateDeck} />
        </Group>
        <Divider />
        <Title order={2} size="h4">
          Recent
        </Title>
        <RecentDecks />
        <Divider />
        <Title order={2} size="h4">
          Search
        </Title>
        <SearchDecks
          onClickFactory={(deckId) => (e: MouseEvent<HTMLDivElement>) => {
            router.push(DECK_DETAIL_PATH(deckId));
          }}
        />
      </Stack>
    </Center>
  );
};
