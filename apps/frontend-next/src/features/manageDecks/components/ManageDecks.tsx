import { MouseEvent, MouseEventHandler } from "react";
import { useMutation } from "urql";
import {
  Button,
  Center,
  createStyles,
  Divider,
  getStylesRef,
  Group,
  Stack,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import { SearchDecks } from "./SearchDecks";
import { DECK_DETAIL_PATH } from "@/paths";
import { RecentDecks } from "./RecentDecks";
import { graphql } from "@generated/gql";

const emptyNewDeckInput = {
  input: {
    answerLang: "en",
    cards: [],
    description: {},
    name: "",
    promptLang: "en",
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
    width: "100%",
    maxWidth: breakpoints.lg,
  },
  group: {
    [`& > .${getStylesRef("growable")}`]: { flexGrow: 1 },
  },
  growable: {
    ref: getStylesRef("growable"),
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
