import { FC } from 'react';
import { Button, Group, Stack, Table, Text } from '@mantine/core';
import { ArrowLeftIcon, ArrowRightIcon, UploadIcon } from '@radix-ui/react-icons';
import { ImportCardsData, ManageDeckProps } from '../types';
import { NEXT_PUBLIC_MAX_CARDS_PER_DECK } from '@/utils';
import { DeckAddCardsDocument } from '@generated/graphql';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';

interface Props extends ImportCardsData, ManageDeckProps {
  onPreviousStep: () => unknown;
  onUploadCompleted: () => unknown;
}

export const ManageDeckCardsUploadReview: FC<Props> = ({ onPreviousStep, cards, deck, onUploadCompleted }) => {
  const [, deckAddCardsMutation] = useMutation(DeckAddCardsDocument);
  const numDeckCards = deck.cardsDirect.length;
  const numCards = cards.length;
  const postImportNumCards = Math.min(numDeckCards + numCards, NEXT_PUBLIC_MAX_CARDS_PER_DECK);
  const cardsToImport = cards.slice(0, postImportNumCards - numDeckCards);
  const exceeded = numDeckCards + numCards > postImportNumCards;
  const router = useRouter();
  return (
    <Stack>
      <Text>
        Your deck <strong>{deck.name}</strong> currently has <strong>{numDeckCards}</strong> cards. After importing, your deck will have <strong>{postImportNumCards}</strong> cards.
      </Text>
      {exceeded && (
        <Text>
          <strong>Not all the cards will be imported!</strong> Only the first <strong>{cardsToImport.length}</strong> cards will be imported, since any more will put the deck over the maximum number of cards.
        </Text>
      )}
      <Table>
        <caption>Preview of first few cards to be imported</caption>
        <thead>
          <tr>
            <th>Prompt</th>
            <th>Full Answer</th>
            <th>No. of alternative answers</th>
          </tr>
        </thead>
        <tbody>
          {cards.slice(0, 10).map(({ prompt, fullAnswer, answers }, index) => (
            <tr key={index}>
              <td>{prompt.ops?.length ? prompt.ops[0].insert?.toString() : ""}</td>
              <td>{fullAnswer.ops?.length ? fullAnswer.ops[0].insert?.toString() : ""}</td>
              <td>{answers.length ? `+${answers.length} answers` : undefined}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group>
        <Button variant="subtle" onClick={onPreviousStep} leftIcon={<ArrowLeftIcon />}>
          Choose another file for import
        </Button>
        <Button leftIcon={<UploadIcon />} sx={{ flexGrow: 1 }} onClick={async () => {
          await deckAddCardsMutation({ deckId: deck.id, cards: cardsToImport });
          onUploadCompleted();
        }}>
          Add {cardsToImport.length} cards
        </Button>
      </Group>
    </Stack>
  );
}
