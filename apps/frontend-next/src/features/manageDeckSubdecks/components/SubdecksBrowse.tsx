import { useState } from 'react';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import { Button, Stack, Text } from '@mantine/core';
import { IconCheck, IconLinkOff, IconPlus } from '@tabler/icons-react';
import { useMutation } from 'urql';

import { BasicList } from '@/components/BasicList';

import { ManageDeckSubdecksFragment } from '../fragments/ManageDeckSubdecksFragment';
import {
  SubdeckListItemContent,
  SubdeckListItemContentFragment,
} from './SubdeckListItemContent';

const ManageDeckSubdecksBrowseRemoveSubdeckMutation = graphql(/* GraphQL */ `
  mutation ManageDeckSubdecksBrowseRemoveSubdeck(
    $deckId: ID!
    $subdeckId: ID!
  ) {
    deckRemoveSubdeck(deckId: $deckId, subdeckId: $subdeckId) {
      id
    }
  }
`);

interface Props {
  deck: FragmentType<typeof ManageDeckSubdecksFragment>;
  onAddSubdeck(): void;
}

// TODO: revisit pagination
export const ManageDeckSubdecksBrowse = ({ deck, onAddSubdeck }: Props) => {
  const deckFragment = useFragment(ManageDeckSubdecksFragment, deck);
  const { id: deckId, subdecks } = deckFragment;
  const [removed, setRemoved] = useState<string[]>([]);
  const [, removeSubdeck] = useMutation(
    ManageDeckSubdecksBrowseRemoveSubdeckMutation
  );
  const [persistedSubdecks] = useState(subdecks);
  const handleRemove = async (subdeckId: string) => {
    await removeSubdeck({ deckId, subdeckId });
    setRemoved(removed.concat([subdeckId]));
  };
  const decks = persistedSubdecks.map((deck, index) => (
    <SubdeckListItemContent
      key={index}
      deck={deck}
      onAction={() => handleRemove(deck.id)}
      actioned={removed.includes(deck.id)}
      actionText="Unlink"
      actionedText="Unlinked"
      actionIcon={<IconLinkOff />}
      actionedIcon={<IconCheck />}
    />
  ));
  return (
    <Stack spacing="md">
      {decks.length ? undefined : <Text>No subdecks to show.</Text>}
      <BasicList borderTop borderBottom data={decks} />
      <Button
        radius="xl"
        leftIcon={<IconPlus />}
        onClick={onAddSubdeck}
        sx={{ alignSelf: 'center' }}
      >
        Link / add subdecks
      </Button>
    </Stack>
  );
};
