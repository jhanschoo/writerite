import { ChangeEvent, useMemo, useState } from 'react';
import { Button, Divider, Flex, Pagination, Stack, TextInput } from '@mantine/core';

import { ManageDeckProps } from '@/features/manageDeck';
import { AddNewCard, ManageCard } from '@/features/manageCard';
import { accumulateContentText } from '@/components/RichTextEditor';
import { IconPlus, IconSearch, IconUpload } from '@tabler/icons-react';
import { JSONContent } from '@tiptap/react';

type Card = ManageDeckProps['deck']['cardsDirect'][number];

const WHITESPACE_REGEX = /\s+/;

const sortCards = (cards: Card[]) =>
  cards.sort((a, b) =>
    a.editedAt > b.editedAt ? -1 : a.editedAt < b.editedAt ? 1 : a.id > b.id ? 1 : -1
  );

interface Props extends ManageDeckProps {
  startUpload(): void;
}

export const ManageDeckCards = ({ deck, startUpload }: Props) => {
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
  const currentCards = useMemo(() => {
    const filteredCards = deck.cardsDirect.filter(({ prompt, fullAnswer, answers }) => {
      const promptString = (prompt && accumulateContentText(prompt as JSONContent)) ?? '';
      const fullAnswerString =
        (fullAnswer && accumulateContentText(fullAnswer as JSONContent)) ?? '';
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
      {showAddCard && <AddNewCard deck={deck} onDone={() => setShowAddCard(false)} />}
      <Divider />
      <TextInput
        value={filter}
        onChange={handleFilterChange}
        icon={<IconSearch size={16} />}
        label="Search"
        sx={{ flexGrow: 1 }}
      />
      {currentCards.map((card) => (
        <ManageCard card={card} key={card.id} onDelete={() => undefined} forceLoading={false} />
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
