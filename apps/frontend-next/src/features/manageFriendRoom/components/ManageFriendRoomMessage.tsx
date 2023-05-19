import { FragmentType, graphql, useFragment } from '@generated/gql';
import { MessageContentType } from '@generated/gql/graphql';
import { Box, Text } from '@mantine/core';
import { useQuery } from 'urql';

// Note: the fragment shape needs to be in a minimal format to avoid
export const ManageFriendRoomMessagesFragment = graphql(/* GraphQL */ `
  fragment ManageFriendRoomMessages on Message {
    content
    createdAt
    id
    senderId
    type
  }
`);

const ManageFriendRoomMessageSenderQuery = graphql(/* GraphQL */ `
  query ManageFriendRoomMessageSenderQuery($id: ID!) {
    friend(id: $id) {
      id
      name
    }
  }
`);

export const ManageFriendRoomMessageSender = ({ id }: { id: string }) => {
  const [{ data }] = useQuery({
    query: ManageFriendRoomMessageSenderQuery,
    variables: {
      id,
    },
  });
  const { name } = data?.friend || {};
  if (!name) {
    return null;
  }
  return (
    <Text component="span" fw="bold">
      {name}
    </Text>
  );
};

interface Props {
  message: FragmentType<typeof ManageFriendRoomMessagesFragment>;
}

export const ManageFriendRoomMessage = ({ message }: Props) => {
  const { type, content, senderId, createdAt } = useFragment(
    ManageFriendRoomMessagesFragment,
    message
  );
  if (type !== MessageContentType.Text) {
    return null;
  }
  return (
    <Box>
      <Text>
        {senderId && <ManageFriendRoomMessageSender id={senderId} />}{' '}
        <Text component="span" size="xs">
          {createdAt}
        </Text>
      </Text>
      <Text>{(content as any).text}</Text>
    </Box>
  );
};
