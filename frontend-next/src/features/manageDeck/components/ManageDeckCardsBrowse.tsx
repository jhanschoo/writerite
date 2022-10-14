import { ChangeEvent, FC, useMemo, useState } from 'react';
import { useMutation } from 'urql';
import { Button, Pagination, Stack, TextInput } from '@mantine/core';

import { ManageDeckProps } from '../types/ManageDeckProps';
import { Delta } from 'quill';
import { ManageCard } from '@/features/manageCard';
import { CardCreateDocument } from '@generated/graphql';

type Card = ManageDeckProps['deck']['cardsDirect'][number];

const sortCards = (cards: Card[]) => cards.sort((a, b) => a.editedAt > b.editedAt ? -1 : a.editedAt < b.editedAt ? 1 : a.id > b.id ? 1 : -1);

const dummyCard: Card = {
  __typename: "Card",
  answers: [],
  deckId: "",
  editedAt: undefined,
  fullAnswer: {},
  id: "",
  mainTemplate: false,
  prompt: {},
  template: false,
}

export const ManageDeckCardsBrowse: FC<ManageDeckProps> = ({ deck }) => {
  const [filter, setFilter] = useState('');
  const [activePage, setActivePage] = useState<number>(1);
  const [{ fetching }, deckAddCards] = useMutation(CardCreateDocument);
  const handleAddNewCard = () => deckAddCards({
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
  }
  const currentCards = useMemo(() => {
    const filteredCards = filter ? deck.cardsDirect.filter(({ prompt, fullAnswer, answers }: { prompt: Delta, fullAnswer: Delta, answers: string[] }) =>
        prompt.ops?.some(({ insert }) => typeof insert === "string" && insert.includes(filter)) ||
        fullAnswer.ops?.some(({ insert }) => typeof insert === "string" && insert.includes(filter)) ||
        answers.some((answer) => answer.includes(filter))
    ) : Array.from(deck.cardsDirect);
    sortCards(filteredCards);
    return filteredCards.slice((activePage - 1) * 10, activePage * 10);
  }, [deck.cardsDirect, activePage, filter]);
  const total = Math.ceil(deck.cardsDirect.length / 10);
  const canAddANewCard = deck.cardsDirect.length < parseInt(process.env.NEXT_PUBLIC_MAX_CARDS_PER_DECK as string) && activePage === 1;
  return (
    <Stack align="stretch">
      <TextInput value={filter} onChange={handleFilterChange} label="Search cards" sx={{ flexGrow: 1 }} />
      {total ? <Pagination page={activePage} onChange={setActivePage} total={total} radius="lg" sx={{ alignSelf: "center" }} /> : undefined}
      {canAddANewCard && <Button onClick={handleAddNewCard}>New Card</Button>}
      {
        fetching && <ManageCard card={dummyCard} onDelete={() => undefined} forceLoading={true} />
      }
      {currentCards.map((card) => <ManageCard card={card} key={card.id} onDelete={() => undefined} forceLoading={false} />)}
      {total ? <Pagination page={activePage} onChange={setActivePage} total={total} radius="lg" sx={{ alignSelf: "center" }} /> : undefined}
    </Stack>
  );
};
