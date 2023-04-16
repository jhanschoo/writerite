import { Stack } from '@mantine/core';
import { ManageDeckContent } from './ManageDeckContent';
import { ManageDeckAdditionalInfo } from './ManageDeckAdditionalInfo';
import { ManageDeckFrontMatter } from './ManageDeckFrontMatter';
import { FragmentType, graphql, useFragment } from '@generated/gql';

const ManageDeckFragment = graphql(/* GraphQL */ `
  fragment ManageDeck on Deck {
    id
    ...ManageDeckFrontMatter
    ...ManageDeckAdditionalInfo
    ...ManageDeckContent
  }
`);

interface Props {
  deck: FragmentType<typeof ManageDeckFragment>;
  path: string[];
}

// TODO: pagination
export const ManageDeck = ({ deck, path }: Props) => {
  const deckFragment = useFragment(ManageDeckFragment, deck);
  return (
    <Stack spacing={2} align="center" sx={{ height: '100%' }}>
      <Stack
        sx={({ breakpoints }) => ({ maxWidth: breakpoints.lg, width: '100%' })}
        p="md"
        align="stretch"
      >
        <ManageDeckFrontMatter deck={deckFragment} />
        <ManageDeckAdditionalInfo deck={deckFragment} />
      </Stack>
      <ManageDeckContent deck={deckFragment} path={path} />
    </Stack>
  );
};
