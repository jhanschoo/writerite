import { FC } from 'react';
import {
  BasicMessageFragment,
  MessageContentType,
  MessageUpdatesByRoomSlugDocument,
  MessageUpdatesByRoomSlugSubscription,
  MessageUpdatesByRoomSlugSubscriptionVariables,
  MessageUpdateOperation,
  RoomDetailFragment,
} from '@generated/graphql';
import { Box, Divider, Space, Stack, Text, Title } from '@mantine/core';
import { useSubscription } from 'urql';

interface Props {
  room?: RoomDetailFragment;
}

function handleMessageUpdates(
  messages: BasicMessageFragment[] = [],
  response: MessageUpdatesByRoomSlugSubscription
) {
  const { messageUpdatesByRoomSlug } = response;
  switch (messageUpdatesByRoomSlug.operation) {
    case MessageUpdateOperation.MessageCreate:
      return [...messages, messageUpdatesByRoomSlug.value];
  }
}

export const ManageRoomMessages: FC<Props> = ({ room }) => {
  const stackElements: JSX.Element[] = [
    <Space sx={{ height: 0, flexGrow: 100 }} key="spacer" />,
    <Divider
      label="start of chat"
      variant="dashed"
      mr="md"
      mb="md"
      labelPosition="center"
      key="start-of-chat"
    />,
  ];
  const [{ data }] = useSubscription<
    MessageUpdatesByRoomSlugSubscription,
    BasicMessageFragment[],
    MessageUpdatesByRoomSlugSubscriptionVariables
  >(
    {
      query: MessageUpdatesByRoomSlugDocument,
      variables: { slug: room?.slug as string },
    },
    handleMessageUpdates
  );
  const displayMessages = stackElements.concat(
    (data ?? [])
      .filter((basicMessage) => basicMessage.type === MessageContentType.Text)
      .map(({ content, id }) => <Text key={id}>{(content as any)['text']}</Text>)
  );
  return (
    <Stack
      px="md"
      justify="stretch"
      sx={{
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Title order={2}>Chat</Title>
      <Stack
        sx={{
          minHeight: 0,
          flexGrow: 100,
          overflowWrap: 'anywhere',
          overflowY: 'scroll',
          wordBreak: 'break-word',
        }}
      >
        {displayMessages}
      </Stack>
    </Stack>
  );
};
