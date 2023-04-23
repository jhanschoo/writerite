import { FragmentType, graphql, useFragment } from '@generated/gql';

import { ManageRoomAddOccupants } from './ManageRoomAddOccupants';
import { ManageRoomSetDeck } from './ManageRoomSetDeck';

const ManageRoomContextualFragment = graphql(/* GraphQL */ `
  fragment ManageRoomContextual on Room {
    id
    activeRound {
      deck {
        id
        name
      }
      id
      slug
      state
    }
  }
`);

interface Props {
  room: FragmentType<typeof ManageRoomContextualFragment>;
}

export const ManageRoomContextual = ({ room }: Props) => {
  const roomFragment = useFragment(ManageRoomContextualFragment, room);
  if (!roomFragment.activeRound) {
    return <ManageRoomSetDeck roomId={roomFragment.id} />;
  }
  return null;
};
