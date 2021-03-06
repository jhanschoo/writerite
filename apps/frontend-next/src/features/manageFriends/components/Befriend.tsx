import { useState } from 'react';
import { graphql } from '@generated/gql';
import { Button, Flex, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconHash, IconPlus } from '@tabler/icons-react';
import { useMutation } from 'urql';

const ManageFriendsBefriendMutation = graphql(/* GraphQL */ `
  mutation ManageFriendsBefriendMutation($befriendedId: ID!) {
    befriend(befriendedId: $befriendedId) {
      id
    }
  }
`);

export const Befriend = () => {
  const [befriendedId, setBefriendedId] = useState('');
  const [, befriendMutation] = useMutation(ManageFriendsBefriendMutation);
  const handleBefriend = async () => {
    const { data } = await befriendMutation({ befriendedId });
    if (data) {
      notifications.show({
        message: `Sent a friend request to user with Friend ID ${befriendedId}`,
      });
    }
  };
  return (
    <Flex align="flex-end" gap="sm">
      <TextInput
        value={befriendedId}
        onChange={(event) => setBefriendedId(event.currentTarget.value)}
        label="Add a friend by their Friend ID: e.g. XYxxyX in pollockk#XYxxyX"
        placeholder="XYxxyX"
        icon={<IconHash size={16} />}
        sx={{
          flexGrow: 1,
        }}
      />
      <Button leftIcon={<IconPlus />} onClick={handleBefriend}>
        Add
      </Button>
    </Flex>
  );
};
