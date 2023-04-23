import {
  ChangeEvent,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { STANDARD_DEBOUNCE_MS } from '@/utils';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import { DecksQueryScope } from '@generated/gql/graphql';
import {
  Card,
  SegmentedControl,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useQuery } from 'urql';
import { useDebounce } from 'use-debounce';

import {
  DeckSummaryContent,
  DeckSummaryContentFragment,
  DecksList,
} from '@/components/deck';

export const MANAGE_DECKS_DECKS_NUM = 20;

type OnClickFactoryType = (deckId: string) => MouseEventHandler<HTMLDivElement>;

const DeckItemFactory =
  (onClickFactory: OnClickFactoryType) =>
  ({
    deck,
  }: {
    deck: FragmentType<typeof DeckSummaryContentFragment> & { id: string };
  }) => {
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

const SearchDecksQuery = graphql(/* GraphQL */ `
  query SearchDecks(
    $after: ID
    $before: ID
    $first: Int
    $last: Int
    $input: DecksQueryInput!
  ) {
    decks(
      after: $after
      before: $before
      first: $first
      last: $last
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
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`);

interface Props {
  onClickFactory: OnClickFactoryType;
}

// TODO: pagination
export const SearchDecks = ({ onClickFactory }: Props) => {
  const [titleContainsInput, setTitleContainsInput] = useState('');
  const [titleContains] = useDebounce(titleContainsInput, STANDARD_DEBOUNCE_MS);
  const [scope, setScope] = useState<DecksQueryScope>(DecksQueryScope.Owned);
  const [cursor, setCursor] = useState<string | undefined>();
  const [{ data }, refetchDecks] = useQuery({
    query: SearchDecksQuery,
    variables: {
      first: MANAGE_DECKS_DECKS_NUM,
      after: cursor,
      input: {
        scope: scope,
        titleContains,
      },
    },
  });
  const decks = data?.decks.edges.flatMap((edge) => {
    if (edge?.node?.name.includes(titleContainsInput)) {
      return [edge.node];
    }
    return [];
  });
  return (
    <>
      <SegmentedControl
        value={scope}
        onChange={setScope as Dispatch<SetStateAction<string>>}
        data={[
          { label: 'Owned', value: DecksQueryScope.Owned },
          { label: 'Public', value: DecksQueryScope.Visible },
        ]}
      />
      <TextInput
        variant="filled"
        label="title contains..."
        placeholder="e.g. ocabular"
        size="md"
        mb="md"
        value={titleContainsInput}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTitleContainsInput(e.target.value)
        }
      />
      <DecksList
        decks={decks}
        component={DeckItemFactory(onClickFactory)}
        justifyLeading
      />
    </>
  );
};
