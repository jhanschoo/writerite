import {
  DeckAddSubdeckDocument,
  DeckCreateDocument,
  DecksQueryOrder,
  DeckSummaryFragment,
} from '@generated/graphql';
import { FC, useState, ChangeEvent, MouseEvent, useEffect } from 'react';
import { useMutation } from 'urql';
import type { ManageDeckProps } from '@/features/manageDeck';
import { Button, Divider, Flex, Stack, TextInput, Title } from '@mantine/core';
import { IconArrowLeft, IconCheck, IconLink, IconPlus, IconUpload } from '@tabler/icons';
import { useQueryRecentDecks } from '@/hooks/datasource/useQueryRecentDecks';
import { BasicList } from '@/components/BasicList';
import { SubdeckListItemContent } from './SubdeckListItemContent';
import { useRouter } from 'next/router';
import { DECK_DETAIL_PATH } from '@/paths';

export const INITIAL_RECENT_DECKS = 5;

interface Props extends ManageDeckProps {
  onFinishedLinkingSubdecks(): void;
}

export const ManageDeckSubdecksLinkSubdeck: FC<Props> = ({
  deck: { id: deckId, subdecks },
  onFinishedLinkingSubdecks,
}) => {
  const stoplist = subdecks.map(({ id }) => id);
  stoplist.push(deckId);
  const router = useRouter();
  const [titleFilter, setTitleFilter] = useState('');
  const [recentShowMore, setRecentShowMore] = useState(false);
  const [added, setAdded] = useState<string[]>([]);
  const [persistedRecentDecks, setPersistedDecks] = useState<DeckSummaryFragment[]>([]);
  const [{ data, fetching, error }] = useQueryRecentDecks({
    stoplist,
    order: DecksQueryOrder.EditedRecency,
  });
  useEffect(() => {
    if (data && persistedRecentDecks.length === 0) {
      setPersistedDecks(data.decks);
    }
  }, [data]);
  const [, addSubdeck] = useMutation(DeckAddSubdeckDocument);
  const [, deckCreateMutation] = useMutation(DeckCreateDocument);
  const handleCreateSubdeck = async () => {
    const createdDeck = await deckCreateMutation({
      answerLang: 'en',
      cards: [],
      description: null,
      name: '',
      promptLang: 'en',
      published: false,
      parentDeckId: deckId,
    });
    if (createdDeck.data?.deckCreate.id) {
      router.push(DECK_DETAIL_PATH(createdDeck.data.deckCreate.id));
    }
  };
  const handleAddSubdeck = async (subdeckId: string) => {
    await addSubdeck({ id: deckId, subdeckId });
    setAdded(added.concat([subdeckId]));
  };
  const recentDeckItems = (persistedRecentDecks ?? []).map((deck, index) => (
    <SubdeckListItemContent
      key={index}
      deck={deck}
      onAction={() => handleAddSubdeck(deck.id)}
      actioned={added.includes(deck.id)}
      actionText="Link"
      actionedText="Linked"
      actionIcon={<IconLink />}
      actionedIcon={<IconCheck />}
    />
  ));
  const canShowMoreRecentDecks = recentDeckItems.length > INITIAL_RECENT_DECKS;
  if (canShowMoreRecentDecks && !recentShowMore) {
    recentDeckItems.length = INITIAL_RECENT_DECKS;
  }
  return (
    <Stack p="sm">
      <Title order={2} size="h4">
        Link subdecks
      </Title>
      <BasicList borderTop borderBottom data={recentDeckItems} />
      {canShowMoreRecentDecks && (
        <Button fullWidth variant="subtle" onClick={() => setRecentShowMore(!recentShowMore)}>
          {recentShowMore && 'Show less'}
          {!recentShowMore && 'Show more'}
        </Button>
      )}
      <Flex justify="space-between" align="center">
        <Button variant="subtle" onClick={onFinishedLinkingSubdecks} leftIcon={<IconArrowLeft />}>
          Back
        </Button>
        <Flex gap="md" wrap="wrap" justify="flex-end">
          <Button variant="filled" onClick={handleCreateSubdeck} leftIcon={<IconPlus />}>
            New
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('new subdeck')}
            leftIcon={<IconUpload />}
          >
            Import
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <TextInput
        variant="filled"
        label="Find more decks"
        placeholder="e.g. ocabular"
        size="md"
        mb="md"
        value={titleFilter}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setTitleFilter(e.target.value);
          setAdded([]);
        }}
      />
    </Stack>
  );
};
