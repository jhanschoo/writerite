import { Tabs, Title } from '@mantine/core';

import { FriendsMutualsList } from './FriendsMutualsList';
import { FriendsListReceived } from './FriendsListReceived';
import { FriendsListSent } from './FriendsListSent';

export const FriendsList = () => (
  <Tabs defaultValue="mutuals">
    <Tabs.List>
      <Tabs.Tab value="mutuals">Friends</Tabs.Tab>
      <Tabs.Tab value="pending">Pending</Tabs.Tab>
    </Tabs.List>

    <Tabs.Panel value="mutuals">
      <FriendsMutualsList />
    </Tabs.Panel>
    <Tabs.Panel value="pending">
      <Title order={3}>Received</Title>
      <FriendsListReceived />
      <Title order={3}>Sent</Title>
      <FriendsListSent />
    </Tabs.Panel>
  </Tabs>
);
