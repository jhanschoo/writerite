import { DecksDocument, DecksQueryScope } from "@generated/graphql";
import { FC, useState } from "react";
import { useQuery } from "urql";
import type { ManageDeckProps } from "@/features/manageDeck";
import { useDebounce } from "use-debounce";
import { STANDARD_DEBOUNCE_MS } from "@/utils";
import { Text } from "@mantine/core"

export const MANAGE_DECKS_DECKS_NUM = 12;

export const ManageDeckSubdecksAddSubdeck: FC<ManageDeckProps> = ({ deck: { id: deckId, subdecks } }) => {
  const [titleFilter, setTitleFilter] = useState('');
  const [debouncedTitleFilter] = useDebounce(titleFilter, STANDARD_DEBOUNCE_MS);
  const [cursor, setCursor] = useState<string | undefined>();
  const [{ data, fetching, error }, refetchDecks] = useQuery({
    query: DecksDocument,
    variables: {
      scope: DecksQueryScope.Owned,
      take: MANAGE_DECKS_DECKS_NUM,
      titleFilter: debouncedTitleFilter,
      cursor,
    },
  });
  const candidateDecks = data?.decks.filter(({ name, id }) =>
    (!titleFilter || name.includes(titleFilter)) &&
    id !== deckId &&
    !subdecks.some((subdeck) => subdeck.id !== id)
  );
  return <Text>{JSON.stringify(candidateDecks)}</Text>;
}
