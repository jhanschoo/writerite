import { ChangeEvent, FC, useMemo, useState } from 'react';
import { useMutation } from 'urql';
import { Box, Button, Pagination, Stack, TextInput } from '@mantine/core';

import { ManageDeckProps } from '@/features/manageDeck';
import { ManageCard } from '@/features/manageCard';
import type { EditorOptions, JSONContent } from '@tiptap/core';
import { CardCreateDocument } from '@generated/graphql';
import { accumulateContentText } from '@/components/RichTextEditor';
import { IconPlus, IconUpload } from '@tabler/icons';

type Card = ManageDeckProps['deck']['cardsDirect'][number];

const WHITESPACE_REGEX = /\s+/;

const sortCards = (cards: Card[]) =>
  cards.sort((a, b) =>
    a.editedAt > b.editedAt ? -1 : a.editedAt < b.editedAt ? 1 : a.id > b.id ? 1 : -1
  );

const dummyCard: Card = {
  __typename: 'Card',
  answers: [],
  deckId: '',
  editedAt: '',
  fullAnswer: {},
  id: '',
  mainTemplate: false,
  prompt: {},
  template: false,
};

interface Props extends ManageDeckProps {
  startUpload(): void;
}

export const ManageDeckCards: FC<Props> = ({ deck, startUpload }) => {
  const [filter, setFilter] = useState('');
  const [activePage, setActivePage] = useState<number>(1);
  const [{ fetching }, deckAddCards] = useMutation(CardCreateDocument);
  const handleAddNewCard = () =>
    deckAddCards({
      deckId: deck.id,
      card: {
        prompt: {},
        fullAnswer: {},
        answers: [],
      },
    });
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setActivePage(1);
  };
  const filterWords = filter
    .trim()
    .split(WHITESPACE_REGEX)
    .filter((word) => Boolean(word));
  // .filter(...) is necessary since "".split(/\s+/) === ['']
  const currentCards = useMemo(() => {
    const filteredCards = deck.cardsDirect.filter(({ prompt, fullAnswer, answers }) => {
      const promptString = accumulateContentText(prompt);
      const fullAnswerString = accumulateContentText(fullAnswer);
      return filterWords.every(
        (word) =>
          promptString.includes(word) ||
          fullAnswerString.includes(word) ||
          answers.some((answer) => answer.includes(word))
      );
    });
    sortCards(filteredCards);
    return filteredCards.slice((activePage - 1) * 10, activePage * 10);
  }, [deck.cardsDirect, activePage, filter]);
  const total = Math.ceil(deck.cardsDirect.length / 10);
  const canAddANewCard =
    deck.cardsDirect.length < parseInt(process.env.NEXT_PUBLIC_MAX_CARDS_PER_DECK as string) &&
    activePage === 1;
  return (
    <Stack align="stretch">
      <Box sx={({ spacing }) => ({ display: 'flex', gap: spacing.md })}>
        <Button
          onClick={handleAddNewCard}
          disabled={!canAddANewCard}
          sx={{ flexGrow: 2 }}
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
      </Box>
      <TextInput
        value={filter}
        onChange={handleFilterChange}
        label="Search for cards containing..."
        sx={{ flexGrow: 1 }}
      />
      {fetching && <ManageCard card={dummyCard} onDelete={() => undefined} forceLoading={true} />}
      {currentCards.map((card) => (
        <ManageCard card={card} key={card.id} onDelete={() => undefined} forceLoading={false} />
      ))}
      {total ? (
        <Pagination
          page={activePage}
          onChange={setActivePage}
          total={total}
          radius="lg"
          sx={{ alignSelf: 'center' }}
        />
      ) : undefined}
    </Stack>
  );
};
