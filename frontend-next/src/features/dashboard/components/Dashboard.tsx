import { FC } from 'react';
import { Stack } from '@mantine/core';
import { UserDecksSummary } from './UserDecksSummary';
import { UserRoomsSummary } from './UserRoomsSummary';

export const Dashboard: FC = () => (
  <Stack p="md">
    <UserDecksSummary />
    <UserRoomsSummary />
  </Stack>
);
