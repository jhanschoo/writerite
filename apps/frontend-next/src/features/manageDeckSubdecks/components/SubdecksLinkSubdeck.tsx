import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { DECK_DETAIL_PATH } from '@/paths';
import { STANDARD_DEBOUNCE_MS } from '@/utils';
import { PageParams } from '@/utils/PageParams';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import {
  DecksQueryScope,
  ManageDeckSubdecksLinkSubdeckQueryQuery,
} from '@generated/gql/graphql';
import {
  Button,
  Divider,
  Flex,
  SegmentedControl,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCheck,
  IconLink,
  IconPlus,
} from '@tabler/icons-react';
import { useMutation, useQuery } from 'urql';
import { useDebounce } from 'use-debounce';

import { BasicList } from '@/components/BasicList';

import { ManageDeckSubdecksFragment } from '../fragments/ManageDeckSubdecksFragment';
import { SubdeckListItemContent } from './SubdeckListItemContent';

export const MANAGE_DECKS_SUBDECKS_DECKS_NUM = 10;
export const MANAGE_DECKS_SUBDECKS_RECENT_DECKS_NUM = 5;

const ManageDeckSubdecksLinkSubdeckQuery = graphql(/* GraphQL */ `
  query ManageDeckSubdecksLinkSubdeckQuery(
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
          name
          ...SubdeckListItemContent
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
  mutation ManageDeckSubdecksLinkSubdeckAddSubdeck(
    $deckId: ID!
    $subdeckId: ID!
  ) {
    deckAddSubdeck(deckId: $deckId, subdeckId: $subdeckId) {
      ...ManageDeckSubdecks
    }
  }
`);

const ManageDeckSubdecksLinkSubdeckCreateSubdeckMutation =
  graphql(/* GraphQL */ `
    mutation ManageDeckSubdecksLinkSubdeckCreateSubdeck(
      $input: DeckCreateMutationInput!
    ) {
      deckCreate(input: $input) {
        id
      }
    }
  `);

interface Props {
  deck: FragmentType<typeof ManageDeckSubdecksFragment>;
  onFinishedLinkingSubdecks(): void;
}

export const ManageDeckSubdecksLinkSubdeck = ({
  deck,
  onFinishedLinkingSubdecks,
}: Props) => {
  const deckFragment = useFragment(ManageDeckSubdecksFragment, deck);
  const { id: deckId, subdecks } = deckFragment;
  const stoplist = subdecks.map(({ id }) => id);
  stoplist.push(deckId);
  const router = useRouter();
  const [titleContainsInput, setTitleContainsInput] = useState('');
  const [titleContains] = useDebounce(titleContainsInput, STANDARD_DEBOUNCE_MS);
  const [scope, setScope] = useState<DecksQueryScope>(DecksQueryScope.Owned);
  const [pageParams, setPageParams] = useState<PageParams>({
    first: MANAGE_DECKS_SUBDECKS_DECKS_NUM,
  });
  const [added, setAdded] = useState<string[]>([]);
  const [persistedRecentDecks, setPersistedDecks] = useState<
    ManageDeckSubdecksLinkSubdeckQueryQuery['decks']['edges']
  >([]);
  const [{ data: recentData }] = useQuery({
    query: ManageDeckSubdecksLinkSubdeckQuery,
    variables: {
      first: MANAGE_DECKS_SUBDECKS_RECENT_DECKS_NUM,
      input: {
        stoplist,
      },
    },
  });
  const [{ data: searchData }] = useQuery({
    query: ManageDeckSubdecksLinkSubdeckQuery,
    variables: {
      ...pageParams,
      input: {
        stoplist,
        scope,
        titleContains,
      },
    },
  });
  const { hasPreviousPage, hasNextPage, startCursor, endCursor } =
    searchData?.decks.pageInfo ?? {};
  const searchDecks = searchData?.decks.edges.flatMap((edge) => {
    if (
      edge?.node?.name
        .toLocaleLowerCase()
        .includes(titleContainsInput.toLocaleLowerCase())
    ) {
      return [edge];
    }
    return [];
  });
  useEffect(() => {
    if (recentData && persistedRecentDecks.length === 0) {
      setPersistedDecks(recentData.decks.edges);
    }
  }, [recentData, persistedRecentDecks.length]);
  const [, addSubdeck] = useMutation(
    ManageDeckSubdecksLinkSubdeckAddSubdeckMutation
  );
  const [, deckCreateMutation] = useMutation(
    ManageDeckSubdecksLinkSubdeckCreateSubdeckMutation
  );
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
  const recentDeckItems = (persistedRecentDecks ?? []).flatMap((edge, index) =>
    edge
      ? [
          <SubdeckListItemContent
            key={index}
            deck={edge.node}
            onAction={() => handleAddSubdeck(edge.node.id)}
            actioned={added.includes(edge.node.id)}
            actionText="Link"
            actionedText="Linked"
            actionIcon={<IconLink />}
            actionedIcon={<IconCheck />}
          />,
        ]
      : []
  );
  const searchDeckItems = searchDecks?.flatMap((edge, index) =>
    edge
      ? [
          <SubdeckListItemContent
            key={index}
            deck={edge.node}
            onAction={() => handleAddSubdeck(edge.node.id)}
            actioned={added.includes(edge.node.id)}
            actionText="Link"
            actionedText="Linked"
            actionIcon={<IconLink />}
            actionedIcon={<IconCheck />}
          />,
        ]
      : []
  );
  return (
    <Stack p="sm">
      <Button
        sx={{ alignSelf: 'flex-start' }}
        variant="default"
        onClick={onFinishedLinkingSubdecks}
        leftIcon={<IconArrowLeft />}
      >
        Back
      </Button>
      <Title order={2} size="h4">
        Link subdecks
      </Title>
      <BasicList borderTop borderBottom data={recentDeckItems} />
      <Flex justify="space-between" align="center">
        <Flex gap="md" wrap="wrap" justify="flex-end">
          <Button
            variant="filled"
            onClick={handleCreateSubdeck}
            leftIcon={<IconPlus />}
          >
            New
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <Title order={3} size="h5">
        Search
      </Title>
      <SegmentedControl
        value={scope}
        onChange={setScope as Dispatch<SetStateAction<string>>}
        data={[
          { label: 'Owned', value: DecksQueryScope.Owned },
          { label: 'Public', value: DecksQueryScope.Visible },
        ]}
      />
      <TextInput
        variant="filled"
        label="Find more decks"
        placeholder="e.g. ocabular"
        size="md"
        mb="md"
        value={titleContainsInput}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setTitleContainsInput(e.target.value);
          setAdded([]);
        }}
      />
      {hasPreviousPage && startCursor && (
        <Button
          onClick={() => {
            setPageParams({
              last: MANAGE_DECKS_SUBDECKS_DECKS_NUM,
              before: startCursor,
            });
          }}
          variant="outline"
        >
          View previous...
        </Button>
      )}
      {searchDeckItems && (
        <BasicList borderTop borderBottom data={searchDeckItems} />
      )}
      {hasNextPage && endCursor && (
        <Button
          onClick={() => {
            setPageParams({
              first: MANAGE_DECKS_SUBDECKS_DECKS_NUM,
              after: endCursor,
            });
          }}
        >
          View more...
        </Button>
      )}
    </Stack>
  );
};
