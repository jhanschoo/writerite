import { NEXT_PUBLIC_MAX_CARDS_PER_DECK } from '@/utils';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import { Box, Button, Stack, Table, Text } from '@mantine/core';
import { IconArrowLeft, IconUpload } from '@tabler/icons-react';
import { useMutation } from 'urql';

import { accumulateContentText } from '@/components/editor';

import { ImportCardsData } from '../types';

export const ManageDeckCardsUploadReviewFragment = graphql(/* GraphQL */ `
  fragment ManageDeckCardsUploadReview on Deck {
    id
    cardsDirectCount
    name
  }
`);

export const ManageDeckCardsAddCardsMutation = graphql(/* GraphQL */ `
  mutation ManageDeckCardsAddCards(
    $deckId: ID!
    $cards: [CardCreateMutationInput!]!
  ) {
    deckAddCards(deckId: $deckId, cards: $cards) {
      id
    }
  }
`);

interface Props extends ImportCardsData {
  deck: FragmentType<typeof ManageDeckCardsUploadReviewFragment>;
  onCancel(): unknown;
  onPreviousStep(): unknown;
  onUploadCompleted(): unknown;
}

export const Review = ({
  onCancel,
  onPreviousStep,
  cards,
  deck,
  onUploadCompleted,
}: Props) => {
  const { id, cardsDirectCount, name } = useFragment(
    ManageDeckCardsUploadReviewFragment,
    deck
  );
  const [, deckAddCardsMutation] = useMutation(ManageDeckCardsAddCardsMutation);
  const numDeckCards = cardsDirectCount;
  const numCards = cards.length;
  const postImportNumCards = Math.min(
    numDeckCards + numCards,
    NEXT_PUBLIC_MAX_CARDS_PER_DECK
  );
  const cardsToImport = cards.slice(0, postImportNumCards - numDeckCards);
  const exceeded = numDeckCards + numCards > postImportNumCards;
  return (
    <Stack>
      <Text>
        Your deck <strong>{name}</strong> currently has{' '}
        <strong>{numDeckCards}</strong> cards. After importing, your deck will
        have <strong>{postImportNumCards}</strong> cards.
      </Text>
      {exceeded && (
        <Text>
          <strong>Not all the cards will be imported!</strong> Only the first{' '}
          <strong>{cardsToImport.length}</strong> cards will be imported, since
          any more will put the deck over the maximum number of cards.
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
              <td>{accumulateContentText(prompt)}</td>
              <td>{accumulateContentText(fullAnswer)}</td>
              <td>
                {answers.length ? `+${answers.length} answers` : undefined}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Box
        sx={({ spacing }) => ({
          display: 'flex',
          gap: spacing.xs,
          flexWrap: 'wrap-reverse',
        })}
      >
        <Button onClick={onCancel} variant="subtle">
          Cancel
        </Button>
        <Button
          variant="subtle"
          onClick={onPreviousStep}
          leftIcon={<IconArrowLeft />}
        >
          Choose another file for import
        </Button>
        <Button
          leftIcon={<IconUpload />}
          sx={{ flexGrow: 1 }}
          onClick={async () => {
            await deckAddCardsMutation({ deckId: id, cards: cardsToImport });
            onUploadCompleted();
          }}
        >
          Add {cardsToImport.length} cards
        </Button>
      </Box>
    </Stack>
  );
};
