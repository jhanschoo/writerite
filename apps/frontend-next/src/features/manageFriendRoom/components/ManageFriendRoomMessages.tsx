import { graphql, useFragment } from '@generated/gql';
import {
  ManageFriendRoomMessagesFragment as ManageFriendRoomMessagesFragmentType,
  ManageFriendRoomMessagesSubscriptionSubscription,
  MessageContentType,
  MessageUpdateOperations,
} from '@generated/gql/graphql';
import { Divider, Space, Stack, Text } from '@mantine/core';
import { useSubscription } from 'urql';

interface Props {
  roomId: string;
}

// Note: the fragment shape needs to be in a minimal format to avoid
const ManageFriendRoomMessagesFragment = graphql(/* GraphQL */ `
  fragment ManageFriendRoomMessages on Message {
    content
    createdAt
    id
    senderId
    type
  }
`);

const ManageFriendRoomMessagesSubscription = graphql(/* GraphQL */ `
  subscription ManageFriendRoomMessagesSubscription($id: ID!) {
    messageUpdatesByRoomId(id: $id) {
      operation
      value {
        ...ManageFriendRoomMessages
      }
    }
  }
`);

function handleMessageUpdates(
  messages: ManageFriendRoomMessagesFragmentType[] | undefined,
  response: ManageFriendRoomMessagesSubscriptionSubscription
): ManageFriendRoomMessagesFragmentType[] {
  
  const {
    messageUpdatesByRoomId: { operation, value },
  } = response;
  switch (operation) {
    case MessageUpdateOperations.MessageCreate:
    default: {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const valueFragment = useFragment(ManageFriendRoomMessagesFragment, value);
      return [...(messages || []), valueFragment];
    }
  }
}

export const ManageFriendRoomMessages = ({ roomId }: Props) => {
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
  const [{ data }] = useSubscription(
    {
      query: ManageFriendRoomMessagesSubscription,
      variables: { id: roomId },
    },
    handleMessageUpdates
  );
  const displayMessages = stackElements.concat(
    (data ?? [])
      .filter((basicMessage) => basicMessage.type === MessageContentType.Text)
      .map(({ content, id, senderId }) => (
        <Text key={id}>{(content as any).text}, {senderId}</Text>
      ))
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
