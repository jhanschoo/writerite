import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { AddNewCard, ManageCard } from '@/features/manageCard';
import { STANDARD_DEBOUNCE_MS } from '@/utils';
import { PageParams } from '@/utils/PageParams';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import { Button, Divider, Flex, Stack, TextInput } from '@mantine/core';
import { IconPlus, IconSearch, IconUpload } from '@tabler/icons-react';
import { JSONContent } from '@tiptap/core';
import { useDebouncedCallback } from 'use-debounce';

import { accumulateContentText } from '@/components/editor';

import { MANAGE_DECK_CARDS_CARDS_NUM } from '../constants';

const WHITESPACE_REGEX = /\s+/;

// const sortCards = (cards: Card[]) =>
//   cards.sort((a, b) =>
//     a.editedAt > b.editedAt ? -1 : a.editedAt < b.editedAt ? 1 : a.id > b.id ? 1 : -1
//   );

const ManageDeckCardsFragment = graphql(/* GraphQL */ `
  fragment ManageDeckCards on Deck {
    id
    cardsDirect(
      after: $after
      before: $before
      first: $first
      last: $last
      contains: $contains
    ) {
      edges {
        cursor
        node {
          id
          prompt
          fullAnswer
          answers
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
  onCardDeleted(): void;
  setCardsPageParams: Dispatch<SetStateAction<PageParams>>;
  setCardsContain: Dispatch<SetStateAction<string>>;
  startUpload(): void;
}

export const ManageDeckCards = ({
  deck,
  setCardsPageParams,
  setCardsContain,
  startUpload,
  onCardDeleted,
}: Props) => {
  const deckFragment = useFragment(ManageDeckCardsFragment, deck);
  const { hasNextPage, hasPreviousPage, startCursor, endCursor } =
    deckFragment.cardsDirect.pageInfo;
  const [filter, setFilter] = useState('');
  const setCardsContainDebounced = useDebouncedCallback(
    (newCardsContain: string) => {
      setCardsContain(newCardsContain);
      setCardsPageParams({ first: MANAGE_DECK_CARDS_CARDS_NUM });
    },
    STANDARD_DEBOUNCE_MS
  );
  const [showAddCard, setShowAddCard] = useState<boolean>(false);
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setCardsContainDebounced(e.target.value);
  };
  const filterWords = filter
    .trim()
    .toLocaleLowerCase()
    .split(WHITESPACE_REGEX)
    .filter((word) => Boolean(word));
  // .filter(...) is necessary since "".split(/\s+/) === ['']
  const currentCards = deckFragment.cardsDirect.edges.flatMap((edge) => {
    if (edge?.node) {
      const { prompt, fullAnswer, answers } = edge.node;
      const promptString =
        (
          prompt && accumulateContentText(prompt as JSONContent)
        )?.toLocaleLowerCase() ?? '';
      const fullAnswerString =
        (
          fullAnswer && accumulateContentText(fullAnswer as JSONContent)
        )?.toLocaleLowerCase() ?? '';
      if (
        filterWords.every(
          (word) =>
            promptString.includes(word) ||
            fullAnswerString.includes(word) ||
            answers.some((answer) => answer.toLocaleLowerCase().includes(word))
        )
      ) {
        return [edge.node];
      }
    }
    return [];
  });
  return (
    <Stack spacing="xs" align="stretch">
      <Flex gap="md" wrap="wrap" justify="stretch">
        <Button
          onClick={() => setShowAddCard(true)}
          disabled={showAddCard}
          sx={{ flexGrow: 1 }}
          leftIcon={<IconPlus size={18} />}
        >
          Add new cards
        </Button>
        <Button
          onClick={startUpload}
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
      {hasPreviousPage && startCursor && (
        <Button
          onClick={() => {
            setCardsPageParams({
              last: MANAGE_DECK_CARDS_CARDS_NUM,
              before: startCursor,
            });
          }}
          variant="outline"
        >
          View previous...
        </Button>
      )}
      {currentCards.map((card) => (
        <ManageCard
          card={card}
          key={card.id}
          onCardDeleted={onCardDeleted}
          forceLoading={false}
        />
      ))}
      {hasNextPage && endCursor && (
        <Button
          onClick={() => {
            setCardsPageParams({
              first: MANAGE_DECK_CARDS_CARDS_NUM,
              after: endCursor,
            });
          }}
        >
          View more...
        </Button>
      )}
    </Stack>
  );
};
