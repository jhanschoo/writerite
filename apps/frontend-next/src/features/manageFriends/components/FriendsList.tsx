import { Stack, Tabs, Title } from '@mantine/core';

import { FriendsListReceived } from './FriendsListReceived';
import { FriendsListSent } from './FriendsListSent';
import { FriendsMutualsList } from './FriendsMutualsList';

export const FriendsList = () => (
  <Tabs defaultValue="mutuals">
    <Tabs.List>
      <Tabs.Tab value="mutuals">Friends</Tabs.Tab>
      <Tabs.Tab value="pending">Pending</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="mutuals" py="md">
      <Stack>
        <FriendsMutualsList />
      </Stack>
    </Tabs.Panel>
    <Tabs.Panel value="pending">
      <Title order={3}>Received</Title>
      <Stack>
        <FriendsListReceived />
      </Stack>
      <Title order={3}>Sent</Title>
      <Stack>
        <FriendsListSent />
      </Stack>
    </Tabs.Panel>
  </Tabs>
);
