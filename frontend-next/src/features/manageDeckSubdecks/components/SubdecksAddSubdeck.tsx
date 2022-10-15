import { DecksDocument, DecksQuery, DecksQueryScope } from "@generated/graphql";
import { FC, useState, ChangeEvent, MouseEventHandler } from "react";
import { useQuery } from "urql";
import type { ManageDeckProps } from "@/features/manageDeck";
import { useDebounce } from "use-debounce";
import { STANDARD_DEBOUNCE_MS } from "@/utils";
import { Card, Paper, Stack, Text, TextInput, UnstyledButton } from "@mantine/core"
import { DeckSummaryContent } from "@/components/deck/DeckSummaryContent";
import { DecksList, DeckItemComponentProps } from "@/components/deck";

export const MANAGE_DECKS_DECKS_NUM = 12;

const DeckItem: FC<DeckItemComponentProps> = ({ deck }) => {
  return (
    <UnstyledButton sx={{ height: 'unset' }} onClick={() => undefined}>
      <Card
        shadow="md"
        radius="md"
        p="md"
        withBorder
        sx={(theme) => {
          const { border, background, color, hover } = theme.fn.variant({ variant: 'default' });
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
  return <Stack p="md" spacing={2}>
    <TextInput
      variant="filled"
      label="title must contain..."
      placeholder="e.g. ocabular"
      size="md"
      mb="md"
      value={titleFilter}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setTitleFilter(e.target.value)}
    />
    <DecksList decks={candidateDecks} component={DeckItem} />
  </Stack>;
}
