import { ChangeEvent, FC, useState } from 'react';
import { Pagination, Stack, TextInput } from '@mantine/core';

import { ManageDeckProps } from '../types/ManageDeckProps';
import { Delta } from 'quill';
import { ManageDeckCardsBrowseCard } from './ManageDeckCardsBrowseCard';

type Card = ManageDeckProps['deck']['cardsDirect'][number];

const sortCards = (cards: Card[]) => {
  cards.sort((a, b) => a.editedAt > b.editedAt ? 1 : a.editedAt < b.editedAt ? -1 : a.id > b.id ? 1 : -1);
}

export const ManageDeckCardsBrowse: FC<ManageDeckProps> = ({ deck }) => {
  const [filter, setFilter] = useState('');
  const [persistedCards, setPersistedCards] = useState<Card[]>(() => {
    const initialCards = [...deck.cardsDirect];
    sortCards(initialCards);
    return initialCards;
  });
  const [activePage, setActivePage] = useState<number>(1);
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFilter = e.target.value;
    const filteredCards = newFilter ? deck.cardsDirect.filter(({ prompt, fullAnswer, answers }: { prompt: Delta, fullAnswer: Delta, answers: string[] }) =>
        prompt.ops?.some(({ insert }) => typeof insert === "string" && insert.includes(newFilter)) ||
        fullAnswer.ops?.some(({ insert }) => typeof insert === "string" && insert.includes(newFilter)) ||
        answers.some((answer) => answer.includes(newFilter))
    ) : [...deck.cardsDirect];
    sortCards(filteredCards);
    setPersistedCards(filteredCards);
    setFilter(newFilter);
    setActivePage(1);
  }
  const currentCards = persistedCards.slice((activePage - 1) * 10, activePage * 10);
  const total = Math.ceil(persistedCards.length / 10);
  return (
    <Stack align="stretch">
      <TextInput value={filter} onChange={handleFilterChange} label="Search cards" sx={{ flexGrow: 1 }} />
      {total ? <Pagination page={activePage} onChange={setActivePage} total={total} sx={{ alignSelf: "center" }} /> : undefined}
      {currentCards.map((card) => <ManageDeckCardsBrowseCard card={card} key={card.id} />)}
      {total ? <Pagination page={activePage} onChange={setActivePage} total={total} sx={{ alignSelf: "center" }} /> : undefined}
    </Stack>
  );
};
