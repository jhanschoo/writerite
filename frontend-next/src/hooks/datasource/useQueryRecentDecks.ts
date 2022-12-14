import { DecksDocument, DecksQueryScope } from '@generated/graphql';
import { useQuery } from 'urql';

export const RECENT_DECKS_TAKE = 20;

export function useQueryRecentDecks(stoplist?: string[]) {
  return useQuery({
    query: DecksDocument,
    variables: {
      scope: DecksQueryScope.Owned,
      take: RECENT_DECKS_TAKE,
      stoplist,
    },
  });
}
