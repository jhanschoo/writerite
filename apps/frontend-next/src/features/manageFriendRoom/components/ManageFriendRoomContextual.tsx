import { Box } from '@mantine/core';

import { ManageFriendRoomContextualState } from '../constants';

interface Props {
  state: ManageFriendRoomContextualState;
}

export const ManageFriendRoomContextual = ({ state }: Props) => (
  <Box>{state} this is a dummy contextual view</Box>
);
