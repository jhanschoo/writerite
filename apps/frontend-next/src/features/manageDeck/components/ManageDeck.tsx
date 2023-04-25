import { graphql } from '@generated/gql';
import { Stack } from '@mantine/core';
import { useQuery } from 'urql';

import { ManageDeckAdditionalInfo } from './ManageDeckAdditionalInfo';
import { ManageDeckContent } from './ManageDeckContent';
import { ManageDeckFrontMatter } from './ManageDeckFrontMatter';

const DeckQuery = graphql(/* GraphQL */ `
  query DeckQuery($id: ID!, $after: ID, $first: Int, $before: ID, $last: Int) {
    deck(id: $id) {
      id
    ...ManageDeckFrontMatter
    ...ManageDeckAdditionalInfo
    ...ManageDeckContent
    }
  }
`);

interface Props {
  deckId: string;
  path: string[];
}

// TODO: pagination
export const ManageDeck = ({ deckId, path }: Props) => {
  const [{ data }] = useQuery({
    query: DeckQuery,
    variables: { id: deckId },
  });
  if (!data) {
    return null;
  }
  const { deck } = data;
  return (
    <Stack spacing={2} align="center" sx={{ height: '100%' }}>
      <Stack
        sx={({ breakpoints }) => ({ maxWidth: breakpoints.lg, width: '100%' })}
        p="md"
        align="stretch"
      >
        <ManageDeckFrontMatter deck={deck} />
        <ManageDeckAdditionalInfo deck={deck} />
      </Stack>
      <ManageDeckContent deck={deck} path={path} />
    </Stack>
  );
};
