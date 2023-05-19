import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useCurrentUser } from '@/hooks';
import { STANDARD_DEBOUNCE_MS } from '@/utils';
import { PageParams } from '@/utils/PageParams';
import { FragmentType, graphql, useFragment } from '@generated/gql';
import {
  ManageFriendRoomMessagesSubscriptionSubscription,
  MessageUpdateOperations,
} from '@generated/gql/graphql';
import { Divider, Space, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useQuery, useSubscription } from 'urql';
import { useDebouncedCallback } from 'use-debounce';

import { CurrentUser } from '@/lib/tokenManagement';

import {
  ManageFriendRoomMessage,
  ManageFriendRoomMessagesFragment,
} from './ManageFriendRoomMessage';

const INITIAL_FETCH_MESSAGE_COUNT = 2;

const FETCH_MESSAGE_COUNT = 10;

const ManageFriendRoomMessagesQuery = graphql(/* GraphQL */ `
  query ManageFriendRoomMessagesQuery(
    $id: ID!
    $after: ID
    $before: ID
    $first: Int
    $last: Int
  ) {
    room(id: $id) {
      id
      messages(after: $after, before: $before, first: $first, last: $last) {
        edges {
          cursor
          node {
            id
            senderBareId
            ...ManageFriendRoomMessages
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`);

const ManageFriendRoomMessagesSubscription = graphql(/* GraphQL */ `
  subscription ManageFriendRoomMessagesSubscription($id: ID!) {
    messageUpdatesByRoomId(id: $id) {
      operation
      value {
        id
        senderBareId
        ...ManageFriendRoomMessages
      }
    }
  }
`);

type MessageType = FragmentType<typeof ManageFriendRoomMessagesFragment> & {
  id: string;
  senderBareId?: string | null;
};

function handleMessageUpdates(
  prev: [MessageType[], MessageType | undefined] | undefined,
  response: ManageFriendRoomMessagesSubscriptionSubscription
): [MessageType[], MessageType | undefined] {
  const [messages] = prev ?? [];
  const {
    messageUpdatesByRoomId: { operation, value },
  } = response;
  switch (operation) {
    case MessageUpdateOperations.MessageCreate:
    default: {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return [[...(messages || []), value], value];
    }
  }
}

interface Props {
  roomId: string;
}

export const ManageFriendRoomMessages = ({ roomId }: Props) => {
  const [pageParams, setPageParams] = useState<PageParams>({
    first: INITIAL_FETCH_MESSAGE_COUNT,
  });
  const currentUserDangerous = useCurrentUser();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  useEffect(() => {
    if (!currentUser && currentUserDangerous) {
      setCurrentUser(currentUserDangerous);
    }
  }, [currentUser, currentUserDangerous]);
  const [{ data: historicalData, fetching: fetchingHistorical }] = useQuery({
    query: ManageFriendRoomMessagesQuery,
    variables: {
      id: roomId,
      ...pageParams,
    },
  });
  const [lastScrollFromBottom, setLastScrollFromBottom] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>();
  const bottomContainerRef = useRef<HTMLDivElement>();
  const { ref, entry } = useIntersection({
    root: containerRef.current,
    threshold: 1,
  });
  useEffect(() => {
    if (bottomContainerRef.current) {
      bottomContainerRef.current.scrollTop =
        bottomContainerRef.current.scrollHeight - lastScrollFromBottom;
    }
  }, [historicalData, lastScrollFromBottom]);
  const { hasNextPage, endCursor } =
    historicalData?.room?.messages?.pageInfo ?? {};
  const shouldLoadMore =
    !fetchingHistorical && entry?.isIntersecting && hasNextPage && endCursor;
  const debouncedSetPageParams = useDebouncedCallback(
    (newPageParams: PageParams) => {
      if (bottomContainerRef.current) {
        setLastScrollFromBottom(
          bottomContainerRef.current.scrollHeight -
            bottomContainerRef.current.scrollTop
        );
      }
      setPageParams(newPageParams);
    },
    STANDARD_DEBOUNCE_MS
  );
  useEffect(() => {
    if (shouldLoadMore) {
      debouncedSetPageParams({
        first: FETCH_MESSAGE_COUNT,
        after: endCursor,
      });
    } else {
      debouncedSetPageParams.cancel();
    }
  }, [debouncedSetPageParams, endCursor, shouldLoadMore]);
  const label = fetchingHistorical
    ? 'loading...'
    : hasNextPage
    ? 'scroll up to load more'
    : 'start of chat';
  const stackElements: JSX.Element[] = [
    <Space sx={{ flexGrow: 100 }} h="50%" key="spacer" ref={ref} />,
    <Divider
      label={label}
      variant="dashed"
      mr="md"
      mb="md"
      labelPosition="center"
      key="start-element"
    />,
  ];
  const [{ data }] = useSubscription<
    ManageFriendRoomMessagesSubscriptionSubscription,
    [MessageType[], MessageType | undefined]
  >(
    {
      query: ManageFriendRoomMessagesSubscription,
      variables: { id: roomId },
    },
    handleMessageUpdates
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { senderBareId: lastSenderId } = data?.[1] || {};
  useEffect(() => {
    if (lastSenderId === currentUser?.bareId) {
      if (bottomContainerRef.current) {
        bottomContainerRef.current.scrollTop =
          bottomContainerRef.current.scrollHeight;
      }
    }
  }, [currentUser?.bareId, lastSenderId, data]);
  const historicalMessageComponents = (
    historicalData?.room?.messages?.edges ?? []
  ).flatMap((messageFragment) =>
    messageFragment
      ? [
          <ManageFriendRoomMessage
            key={messageFragment.node.id}
            message={messageFragment.node}
          />,
        ]
      : []
  );
  historicalMessageComponents.reverse();
  const subscriptionMessageComponents = (data?.[0] ?? []).map(
    (messageFragment) => (
      <ManageFriendRoomMessage
        key={messageFragment.id}
        message={messageFragment}
      />
    )
  );
  const displayMessages = stackElements
    .concat(historicalMessageComponents)
    .concat(subscriptionMessageComponents);
  return (
    <Stack
      px="md"
      justify="stretch"
      sx={{
        height: '100%',
        overflow: 'hidden',
      }}
      ref={containerRef as MutableRefObject<HTMLDivElement | null>}
    >
      <Stack
        sx={{
          minHeight: 0,
          flexGrow: 100,
          overflowWrap: 'anywhere',
          overflowY: 'scroll',
          wordBreak: 'break-word',
        }}
        ref={bottomContainerRef as MutableRefObject<HTMLDivElement | null>}
      >
        {displayMessages}
      </Stack>
    </Stack>
  );
};
