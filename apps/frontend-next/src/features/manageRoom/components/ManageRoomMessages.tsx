import { FragmentType, graphql, useFragment } from '@generated/gql';
import { ManageRoomMessagesSubscriptionSubscription, MessageContentType, ManageRoomMessagesFragment as ManageRoomMessagesFragmentType, MessageUpdateOperations } from '@generated/gql/graphql';
import { Divider, Space, Stack, Text, Title } from '@mantine/core';
import { useSubscription } from 'urql';

interface Props {
  roomId: string;
}

const ManageRoomMessagesFragment = graphql(/* GraphQL */ `
  fragment ManageRoomMessages on Message {
    content
    createdAt
    id
    sender {
      id
      name
    }
    type
  }
`);

const ManageRoomMessagesSubscription = graphql(/* GraphQL */ `
  subscription ManageRoomMessagesSubscription($id: ID!) {
    messageUpdatesByRoomId(id: $id) {
      operation
      value {
        ...ManageRoomMessages
      }
    }
  }
`);

function handleMessageUpdates(
  messages: ManageRoomMessagesFragmentType[] = [],
  response: ManageRoomMessagesSubscriptionSubscription
): ManageRoomMessagesFragmentType[] {
  const { messageUpdatesByRoomId: { operation, value } } = response;
  switch (operation) {
    case MessageUpdateOperations.MessageCreate: {
      const valueFragment = useFragment(ManageRoomMessagesFragment, value);
      return [...messages, valueFragment];
    }
  }
}

export const ManageRoomMessages = ({ roomId }: Props) => {
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
      query: ManageRoomMessagesSubscription,
      variables: { id: roomId },
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
