import { graphql } from '@generated/gql';
import { useQuery } from 'urql';

export const RECENT_DECKS_TAKE = 20;

interface Props {
  stoplist?: string[];
  take?: number;
}

const UseQueryDecksQuery = graphql(/* GraphQL */ `
  query UseQueryDecks($after: ID, $before: ID, $first: Int, $last: Int, $input: DecksQueryInput!) {
    decks(after: $after, before: $before, first: $first, last: $last, input: $input) {
      edges {
        cursor
        node {
          id
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

export function useQueryDecks({ stoplist, take }: Props) {
  return useQuery({
    query: UseQueryDecksQuery,
    variables: {
      first: take,
      input: {
        stoplist,
      },
    },
  });
}
