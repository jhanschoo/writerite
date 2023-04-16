import { useState, ChangeEvent, useEffect } from 'react';
import { useMutation, useQuery } from 'urql';
import { Button, Divider, Flex, Stack, TextInput, Title } from '@mantine/core';
import { IconArrowLeft, IconCheck, IconLink, IconPlus, IconUpload } from '@tabler/icons-react';
import { BasicList } from '@/components/BasicList';
import { SubdeckListItemContent } from './SubdeckListItemContent';
import { useRouter } from 'next/router';
import { DECK_DETAIL_PATH } from '@/paths';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import { ManageDeckSubdecksLinkSubdeckQueryQuery } from '@generated/gql/graphql';
import { ManageDeckSubdecksFragment } from '../fragments/ManageDeckSubdecksFragment';

export const INITIAL_RECENT_DECKS = 5;

const ManageDeckSubdecksLinkSubdeckQuery = graphql(/* GraphQL */ `
  query ManageDeckSubdecksLinkSubdeckQuery(
    $after: ID
    $before: ID
    $first: Int
    $last: Int
    $input: DecksQueryInput!
  ) {
    decks(after: $after, before: $before, first: $first, last: $last, input: $input) {
      edges {
        cursor
        node {
          ...SubdeckListItemContent
          id
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

const ManageDeckSubdecksLinkSubdeckAddSubdeckMutation = graphql(/* GraphQL */ `
  mutation ManageDeckSubdecksLinkSubdeckAddSubdeck($deckId: ID!, $subdeckId: ID!) {
    deckAddSubdeck(deckId: $deckId, subdeckId: $subdeckId) {
      id
    }
  }
`);

const ManageDeckSubdecksLinkSubdeckCreateSubdeckMutation = graphql(/* GraphQL */ `
  mutation ManageDeckSubdecksLinkSubdeckCreateSubdeck($input: DeckCreateMutationInput!) {
    deckCreate(input: $input) {
      id
    }
  }
`);

interface Props {
  deck: FragmentType<typeof ManageDeckSubdecksFragment>;
  onFinishedLinkingSubdecks(): void;
}

export const ManageDeckSubdecksLinkSubdeck = ({ deck, onFinishedLinkingSubdecks }: Props) => {
  const deckFragment = useFragment(ManageDeckSubdecksFragment, deck);
  const { id: deckId, subdecks } = deckFragment;
  const stoplist = subdecks.map(({ id }) => id);
  stoplist.push(deckId);
  const router = useRouter();
  const [titleFilter, setTitleFilter] = useState('');
  const [recentShowMore, setRecentShowMore] = useState(false);
  const [added, setAdded] = useState<string[]>([]);
  const [persistedRecentDecks, setPersistedDecks] = useState<
    ManageDeckSubdecksLinkSubdeckQueryQuery['decks']['edges']
  >([]);
  const [{ data, fetching, error }] = useQuery({
    query: ManageDeckSubdecksLinkSubdeckQuery,
    variables: {
      input: {
        stoplist,
      }
    },
  });
  useEffect(() => {
    if (data && persistedRecentDecks.length === 0) {
      setPersistedDecks(data.decks.edges);
    }
  }, [data]);
  const [, addSubdeck] = useMutation(ManageDeckSubdecksLinkSubdeckAddSubdeckMutation);
  const [, deckCreateMutation] = useMutation(ManageDeckSubdecksLinkSubdeckCreateSubdeckMutation);
  const handleCreateSubdeck = async () => {
    const createdDeck = await deckCreateMutation({
      input: {
        answerLang: 'en',
        cards: [],
        description: null,
        name: '',
        promptLang: 'en',
        published: false,
        parentDeckId: deckId,
      },
    });
    if (createdDeck.data?.deckCreate.id) {
      router.push(DECK_DETAIL_PATH(createdDeck.data.deckCreate.id));
    }
  };
  const handleAddSubdeck = async (subdeckId: string) => {
    await addSubdeck({ deckId, subdeckId });
    setAdded(added.concat([subdeckId]));
  };
  const recentDeckItems = (persistedRecentDecks ?? []).flatMap((edge, index) => (
    edge ? [
    <SubdeckListItemContent
      key={index}
      deck={edge.node}
      onAction={() => handleAddSubdeck(edge.node.id)}
      actioned={added.includes(edge.node.id)}
      actionText="Link"
      actionedText="Linked"
      actionIcon={<IconLink />}
      actionedIcon={<IconCheck />}
    />] : []
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
