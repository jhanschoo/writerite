import { MouseEventHandler } from 'react';
import { useRouter } from 'next/router';
import { FragmentType, graphql } from '@generated/gql';
import { Card, UnstyledButton } from '@mantine/core';
import { useQuery } from 'urql';

import { DecksQueryScope } from '@generated/gql/graphql';
import { DeckSummaryContent, DeckSummaryContentFragment, DecksList } from '@/components/deck';
import { DECK_DETAIL_PATH } from '@/paths';

export const INITIAL_RECENT_DECKS = 5;

type OnClickFactoryType = (deckId: string) => MouseEventHandler<HTMLDivElement>;

const DeckItemFactory = (onClickFactory: OnClickFactoryType) =>
  function DeckItem({
    deck,
  }: {
    deck: FragmentType<typeof DeckSummaryContentFragment> & { id: string };
  }) {
    return (
      <UnstyledButton
        sx={{ height: 'unset', flexGrow: 1, maxWidth: '100%' }}
        onClick={onClickFactory(deck.id)}
        component="div"
      >
        <Card
          shadow="md"
          p="md"
          withBorder
          sx={(theme) => {
            const { border, background, color, hover } = theme.fn.variant({
              variant: 'default',
            });
            return {
              backgroundColor: background,
              color,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderColor: border,
              ...theme.fn.hover({ backgroundColor: hover }),
            };
          }}
        >
          <DeckSummaryContent deck={deck} />
        </Card>
      </UnstyledButton>
    );
  };

const RecentDecksQuery = graphql(/* GraphQL */ `
  query RecentDecksQuery(
    $first: Int!
    $input: DecksQueryInput!
  ) {
    decks(
      first: $first
      input: $input
    ) {
      edges {
        cursor
        node {
          id
          name
          ...DeckSummaryContent
        }
      }
    }
  }
`);

export const RecentDecks = () => {
  const router = useRouter();
  const [{ data }] = useQuery({
    query: RecentDecksQuery,
    variables: {
      first: INITIAL_RECENT_DECKS,
      input: {
        scope: DecksQueryScope.Owned,
      }
    }
  });
  if (!data) {
    return null;
  }
  const decks = data.decks.edges.flatMap((edge) => edge?.node ? [edge.node] : []);
  return (
    <DecksList
      decks={decks}
      component={DeckItemFactory((deckId) => () => {
        router.push(DECK_DETAIL_PATH(deckId));
      })}
      justifyLeading
    />

  );
};
