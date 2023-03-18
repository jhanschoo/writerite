import { DeckRemoveSubdeckDocument, DeckSummaryFragment } from '@generated/graphql';
import { FC, useState } from 'react';
import { useMutation } from 'urql';
import type { ManageDeckProps } from '@/features/manageDeck';
import { Button, Stack, Text } from '@mantine/core';
import { IconCheck, IconLinkOff, IconPlus } from '@tabler/icons-react';
import { BasicList } from '@/components/BasicList';
import { SubdeckListItemContent } from './SubdeckListItemContent';

interface Props extends ManageDeckProps {
  onAddSubdeck(): void;
}

export const ManageDeckSubdecksBrowse: FC<Props> = ({ deck: { id, subdecks }, onAddSubdeck }) => {
  const [removed, setRemoved] = useState<string[]>([]);
  const [, removeSubdeck] = useMutation(DeckRemoveSubdeckDocument);
  const [persistedSubdecks] = useState<DeckSummaryFragment[]>(subdecks);
  const handleRemove = async (subdeckId: string) => {
    await removeSubdeck({ id, subdeckId });
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
