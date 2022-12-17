import { DeckAddSubdeckDocument, DecksQueryOrder } from '@generated/graphql';
import { FC, useState } from 'react';
import { useMutation } from 'urql';
import { Button, Card, Flex, Stack, Text, UnstyledButton } from '@mantine/core';
import { useQueryRecentDecks } from '@/hooks/datasource/useQueryRecentDecks';
import { useRouter } from 'next/router';
import { DeckCompactSummaryContent, DeckName } from '@/components/deck';
import { DECK_DETAIL_PATH } from '@/paths';

export const INITIAL_RECENT_DECKS = 6;

export const RecentDecks: FC = () => {
  const router = useRouter();
  const [recentShowMore, setRecentShowMore] = useState(false);
  const [{ data, fetching, error }] = useQueryRecentDecks({
    order: DecksQueryOrder.EditedRecency,
  });
  const recentDeckItems = (data?.decks ?? []).map((deck, index) => (
    <UnstyledButton
      component="div"
      sx={{ flexGrow: 1, maxWidth: '100%' }}
      onClick={() => router.push(DECK_DETAIL_PATH(deck.id))}
    >
      <Card
        sx={(theme) => {
          const { border, background, color, hover } = theme.fn.variant({ variant: 'default' });
          return {
            backgroundColor: background,
            color,
            borderColor: border,
            ...theme.fn.hover({ backgroundColor: hover }),
          };
        }}
        shadow="md"
        p="sm"
        withBorder
      >
        <DeckCompactSummaryContent deck={deck} />
      </Card>
    </UnstyledButton>
  ));
  const canShowMoreRecentDecks = recentDeckItems.length > INITIAL_RECENT_DECKS;
  if (canShowMoreRecentDecks && !recentShowMore) {
    recentDeckItems.length = INITIAL_RECENT_DECKS;
  }
  recentDeckItems.reverse();
  return (
    <Stack>
      <Flex direction="row-reverse" wrap="wrap-reverse" gap="xs" justify="stretch">
        {recentDeckItems}
      </Flex>
      {canShowMoreRecentDecks && (
        <Button fullWidth variant="subtle" onClick={() => setRecentShowMore(!recentShowMore)}>
          {!recentShowMore && 'Show more'}
          {recentShowMore && 'Show less'}
        </Button>
      )}
    </Stack>
  );
};
