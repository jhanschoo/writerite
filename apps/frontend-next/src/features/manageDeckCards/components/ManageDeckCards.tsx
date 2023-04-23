import { ChangeEvent, useMemo, useState } from 'react';
import { AddNewCard, ManageCard } from '@/features/manageCard';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import {
  Button,
  Divider,
  Flex,
  Pagination,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconPlus, IconSearch, IconUpload } from '@tabler/icons-react';
import { JSONContent } from '@tiptap/react';

import { accumulateContentText } from '@/components/editor';

const WHITESPACE_REGEX = /\s+/;

// const sortCards = (cards: Card[]) =>
//   cards.sort((a, b) =>
//     a.editedAt > b.editedAt ? -1 : a.editedAt < b.editedAt ? 1 : a.id > b.id ? 1 : -1
//   );

const ManageDeckCardsFragment = graphql(/* GraphQL */ `
  fragment ManageDeckCards on Deck {
    id
    cardsDirect(after: $after, before: $before, first: $first, last: $last) {
      edges {
        cursor
        node {
          id
          ...ManageCard
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    cardsDirectCount
  }
`);

interface Props {
  deck: FragmentType<typeof ManageDeckCardsFragment>;
  startUpload(): void;
}

export const ManageDeckCards = ({ deck, startUpload }: Props) => {
  const deckFragment = useFragment(ManageDeckCardsFragment, deck);
  const [filter, setFilter] = useState('');
  const [activePage, setActivePage] = useState<number>(1);
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setActivePage(1);
  };
  const filterWords = filter
    .trim()
    .split(WHITESPACE_REGEX)
    .filter((word) => Boolean(word));
  // .filter(...) is necessary since "".split(/\s+/) === ['']
  // const currentCards = useMemo(() => {
  //   const filteredCards = deck.cardsDirect.filter(({ prompt, fullAnswer, answers }) => {
  //     const promptString = (prompt && accumulateContentText(prompt as JSONContent)) ?? '';
  //     const fullAnswerString =
  //       (fullAnswer && accumulateContentText(fullAnswer as JSONContent)) ?? '';
  //     return filterWords.every(
  //       (word) =>
  //         promptString.includes(word) ||
  //         fullAnswerString.includes(word) ||
  //         answers.some((answer) => answer.includes(word))
  //     );
  //   });
  //   sortCards(filteredCards);
  //   return filteredCards.slice((activePage - 1) * 10, activePage * 10);
  // }, [deck.cardsDirect, activePage, filter]);
  // TODO: fix
  const currentCards = deckFragment.cardsDirect.edges.flatMap((edge) =>
    edge?.node ? [edge.node] : []
  );
  const total = Math.ceil(deckFragment.cardsDirectCount / 10);
  const canAddANewCard =
    deckFragment.cardsDirectCount <
      parseInt(process.env.NEXT_PUBLIC_MAX_CARDS_PER_DECK as string) &&
    activePage === 1;
  return (
    <Stack spacing="xs" align="stretch">
      <Flex gap="md" wrap="wrap" justify="stretch">
        <Button
          onClick={() => setShowAddCard(true)}
          disabled={!canAddANewCard || showAddCard}
          sx={{ flexGrow: 1 }}
          leftIcon={<IconPlus size={18} />}
        >
          Add new cards
        </Button>
        <Button
          onClick={startUpload}
          disabled={!canAddANewCard}
          variant="outline"
          leftIcon={<IconUpload size={18} />}
        >
          Import from file
        </Button>
      </Flex>
      {showAddCard && (
        <AddNewCard
          deckId={deckFragment.id}
          onDone={() => setShowAddCard(false)}
        />
      )}
      <Divider />
      <TextInput
        value={filter}
        onChange={handleFilterChange}
        icon={<IconSearch size={16} />}
        label="Search"
        sx={{ flexGrow: 1 }}
      />
      {currentCards.map((card) => (
        <ManageCard
          card={card}
          key={card.id}
          onDelete={() => undefined}
          forceLoading={false}
        />
      ))}
      {total ? (
        <Pagination
          value={activePage}
          onChange={setActivePage}
          total={total}
          radius="lg"
          sx={{ alignSelf: 'center' }}
        />
      ) : undefined}
    </Stack>
  );
};
