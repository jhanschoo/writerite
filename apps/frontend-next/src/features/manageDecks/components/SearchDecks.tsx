import {
  ChangeEvent,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useState,
} from 'react';
import { FragmentType, graphql } from '@generated/gql';
import { DecksQueryScope } from '@generated/gql/graphql';
import {
  Button,
  Card,
  SegmentedControl,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useQuery } from 'urql';
import { useDebounce } from 'use-debounce';
import { STANDARD_DEBOUNCE_MS } from '@/utils';

import {
  DeckSummaryContent,
  DeckSummaryContentFragment,
  DecksList,
} from '@/components/deck';
import { PageParams } from '@/utils/PageParams';

export const MANAGE_DECKS_DECKS_NUM = 20;

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
  const [pageParams, setPageParams] = useState<PageParams>({
    first: MANAGE_DECKS_DECKS_NUM,
  });
  const [{ data }] = useQuery({
    query: SearchDecksQuery,
    variables: {
      ...pageParams,
      input: {
        scope,
        titleContains,
      },
    },
  });
  if (!data) {
    return null;
  }
  const { hasPreviousPage, hasNextPage, startCursor, endCursor } =
    data.decks.pageInfo;
  const decks = data.decks.edges.flatMap((edge) => {
    if (edge?.node?.name.toLocaleLowerCase().includes(titleContainsInput.toLocaleLowerCase())) {
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
      {hasPreviousPage && startCursor && (
        <Button
          onClick={() => {
            setPageParams({
              last: MANAGE_DECKS_DECKS_NUM,
              before: startCursor,
            });
          }}
          variant="outline"
        >
          View previous...
        </Button>
      )}
      <DecksList
        decks={decks}
        component={DeckItemFactory(onClickFactory)}
        justifyLeading
      />
      {hasNextPage && endCursor && (
        <Button
          onClick={() => {
            setPageParams({
              first: MANAGE_DECKS_DECKS_NUM,
              after: endCursor,
            });
          }}
        >
          View more...
        </Button>
      )}
    </>
  );
};
