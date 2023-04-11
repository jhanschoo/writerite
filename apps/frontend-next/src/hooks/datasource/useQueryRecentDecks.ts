import { DecksDocument, DecksQueryOrder, DecksQueryScope } from '@generated/graphql';
import { useQuery } from 'urql';

export const RECENT_DECKS_TAKE = 20;

interface Props {
  order: DecksQueryOrder;
  stoplist?: string[];
  take?: number;
}

export function useQueryRecentDecks({
  order = DecksQueryOrder.UsedRecency,
  stoplist,
  take,
}: Props) {
  return useQuery({
    query: DecksDocument,
    variables: {
      scope: DecksQueryScope.Owned,
      take: take ?? RECENT_DECKS_TAKE,
      stoplist,
      order,
    },
  });
}
