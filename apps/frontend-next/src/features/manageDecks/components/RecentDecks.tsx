import { useState } from "react";
import { useQuery } from "urql";
import { Button, Card, Flex, Stack, Text, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/router";
import { DeckCompactSummaryContent, DeckName } from "@/components/deck";
import { DECK_DETAIL_PATH } from "@/paths";
import { graphql } from "@generated/gql";

export const INITIAL_RECENT_DECKS = 6;

const RecentDecksQuery = graphql(/* GraphQL */ `
  query RecentDecksQuery(
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
          ...DeckCompactSummaryContent
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

export const RecentDecks = () => {
  const router = useRouter();
  const [recentShowMore, setRecentShowMore] = useState(false);
  const [{ data, fetching, error }] = useQuery({
    query: RecentDecksQuery,
  });
  const recentDeckItems = (data?.decks.edges ?? []).flatMap((edge, index) =>
    edge?.node
      ? [
          <UnstyledButton
            component="div"
            sx={{ flexGrow: 1, maxWidth: "100%" }}
            onClick={() => router.push(DECK_DETAIL_PATH(edge.node.id))}
          >
            <Card
              sx={(theme) => {
                const { border, background, color, hover } = theme.fn.variant({
                  variant: "default",
                });
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
              <DeckCompactSummaryContent deck={edge.node} />
            </Card>
          </UnstyledButton>,
        ]
      : []
  );
  const canShowMoreRecentDecks = recentDeckItems.length > INITIAL_RECENT_DECKS;
  if (canShowMoreRecentDecks && !recentShowMore) {
    recentDeckItems.length = INITIAL_RECENT_DECKS;
  }
  recentDeckItems.reverse();
  return (
    <Stack>
      <Flex
        direction="row-reverse"
        wrap="wrap-reverse"
        gap="xs"
        justify="stretch"
      >
        {recentDeckItems}
      </Flex>
      {canShowMoreRecentDecks && (
        <Button
          fullWidth
          variant="subtle"
          onClick={() => setRecentShowMore(!recentShowMore)}
        >
          {!recentShowMore && "Show more"}
          {recentShowMore && "Show less"}
        </Button>
      )}
    </Stack>
  );
};
